const {
    getActiveAssessments,
    getAssessmentWithQuestions,
    submitAssessment,
    getAssessmentHistory
} = require("../services/assessmentService");


async function getAssessments(req, res) {

    try {

        const assessments =
            await getActiveAssessments();


        res.json({
            success: true,
            assessments
        });


    } catch (error) {

        console.error(
            "Get assessments error:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Failed to retrieve assessments"
        });
    }
}


async function getAssessment(req, res) {

    try {

        const assessment =
            await getAssessmentWithQuestions(
                req.params.id
            );


        if (!assessment) {

            return res.status(404).json({
                success: false,
                message: "Assessment not found"
            });
        }


        res.json({
            success: true,
            assessment
        });


    } catch (error) {

        console.error(
            "Get assessment error:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Failed to retrieve assessment"
        });
    }
}


async function submit(req, res) {

    try {

        const result =
            await submitAssessment(
                req.user.userId,
                req.params.id,
                req.body.responses
            );


        res.status(201).json({
            success: true,
            message: "Assessment submitted successfully",
            result
        });


    } catch (error) {

        console.error(
            "Submit assessment error:",
            error
        );


        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


async function getHistory(req, res) {

    try {

        const history =
            await getAssessmentHistory(
                req.user.userId
            );


        res.json({
            success: true,
            history
        });


    } catch (error) {

        console.error(
            "Assessment history error:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Failed to retrieve assessment history"
        });
    }
}


module.exports = {
    getAssessments,
    getAssessment,
    submit,
    getHistory
};