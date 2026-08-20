function calculateRisk(score) {

    if (score <= 7) {

        return {
            riskLevel: "LOW",
            recommendedAction:
                "Continue self-care and monitor your wellbeing. Consider using MindGrid wellness resources if needed."
        };
    }


    if (score <= 15) {

        return {
            riskLevel: "MODERATE",
            recommendedAction:
                "Consider additional wellbeing support and speaking with a counselor if difficulties continue or worsen."
        };
    }


    return {
        riskLevel: "HIGH",
        recommendedAction:
            "Consider contacting a counselor or appropriate student support service promptly for additional support."
    };
}


async function createRiskAssessment(
    client,
    userId,
    score
) {

    const {
        riskLevel,
        recommendedAction
    } = calculateRisk(score);


    let explanation;


    if (riskLevel === "LOW") {

        explanation =
            "The assessment score indicates relatively few reported wellbeing difficulties at the time of screening.";

    } else if (riskLevel === "MODERATE") {

        explanation =
            "The assessment score indicates several reported wellbeing difficulties that may benefit from additional support.";

    } else {

        explanation =
            "The assessment score indicates a higher level of reported wellbeing difficulties and may benefit from prompt additional support.";
    }


    const result = await client.query(
        `
        INSERT INTO public.risk_assessments
        (
            user_id,
            risk_level,
            risk_score,
            trigger_source,
            explanation,
            recommended_action
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
            id,
            user_id,
            risk_level,
            risk_score,
            trigger_source,
            explanation,
            recommended_action,
            created_at
        `,
        [
            userId,
            riskLevel,
            score,
            "WELLBEING_ASSESSMENT",
            explanation,
            recommendedAction
        ]
    );


    return result.rows[0];
}


module.exports = {
    calculateRisk,
    createRiskAssessment
};