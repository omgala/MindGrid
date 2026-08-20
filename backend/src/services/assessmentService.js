const pool = require("../config/database");
const {createRiskAssessment} = require("./riskService");
const { createRecommendations} = require("./recommendationService");

async function getActiveAssessments() {

    const result = await pool.query(`
        SELECT
            id,
            name,
            description,
            version,
            is_active,
            created_at
        FROM assessments
        WHERE is_active = true
        ORDER BY created_at DESC
    `);

    return result.rows;
}


async function getAssessmentWithQuestions(assessmentId) {

    const assessmentResult = await pool.query(
        `
        SELECT
            id,
            name,
            description,
            version,
            is_active
        FROM assessments
        WHERE id = $1
        AND is_active = true
        `,
        [assessmentId]
    );


    if (assessmentResult.rows.length === 0) {
        return null;
    }


    const questionsResult = await pool.query(
        `
        SELECT
            id,
            question_number,
            question_text,
            question_type
        FROM assessment_questions
        WHERE assessment_id = $1
        ORDER BY question_number ASC
        `,
        [assessmentId]
    );


    return {
        ...assessmentResult.rows[0],
        questions: questionsResult.rows
    };
}


async function submitAssessment(
    userId,
    assessmentId,
    responses
) {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");


        const assessmentCheck = await client.query(
            `
            SELECT id
            FROM assessments
            WHERE id = $1
            AND is_active = true
            `,
            [assessmentId]
        );


        if (assessmentCheck.rows.length === 0) {

            throw new Error("Assessment not found");
        }


        let totalScore = 0;


        for (const response of responses) {

            const questionCheck = await client.query(
                `
                SELECT id
                FROM assessment_questions
                WHERE id = $1
                AND assessment_id = $2
                `,
                [
                    response.questionId,
                    assessmentId
                ]
            );


            if (questionCheck.rows.length === 0) {

                throw new Error(
                    "Invalid question in assessment response"
                );
            }


            totalScore += Number(
                response.responseValue || 0
            );


            await client.query(
                `
                INSERT INTO assessment_responses
                (
                    user_id,
                    assessment_id,
                    question_id,
                    response_value,
                    response_text
                )
                VALUES ($1, $2, $3, $4, $5)
                `,
                [
                    userId,
                    assessmentId,
                    response.questionId,
                    response.responseValue ?? null,
                    response.responseText ?? null
                ]
            );
        }


        // Risk Engine
       const riskAssessment =
    await createRiskAssessment(
        client,
        userId,
        totalScore
    );


const recommendations =
    await createRecommendations(
        client,
        userId,
        riskAssessment.risk_level
    );


await client.query("COMMIT");


return {
    assessmentId,
    totalScore,
    responseCount: responses.length,
    riskAssessment,
    recommendations
};

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
}


async function getAssessmentHistory(userId) {

    const result = await pool.query(
        `
        SELECT
            ar.assessment_id,
            a.name AS assessment_name,
            COUNT(ar.id)::INTEGER AS response_count,
            COALESCE(SUM(ar.response_value), 0)::INTEGER AS total_score,
            MAX(ar.submitted_at) AS submitted_at
        FROM assessment_responses ar
        JOIN assessments a
            ON a.id = ar.assessment_id
        WHERE ar.user_id = $1
        GROUP BY
            ar.assessment_id,
            a.name
        ORDER BY submitted_at DESC
        `,
        [userId]
    );


    return result.rows;
}


module.exports = {
    getActiveAssessments,
    getAssessmentWithQuestions,
    submitAssessment,
    getAssessmentHistory
};