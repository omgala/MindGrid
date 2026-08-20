const {
    getStudentRecommendations
} = require("../services/recommendationService");


async function getRecommendations(req, res) {

    try {

        const recommendations =
            await getStudentRecommendations(
                req.user.userId
            );


        res.json({
            success: true,
            recommendations
        });


    } catch (error) {

        console.error(
            "Get recommendations error:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Failed to retrieve recommendations"
        });
    }
}


module.exports = {
    getRecommendations
};