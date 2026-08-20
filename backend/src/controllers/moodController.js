const {
    createMood,
    getMoodHistory,
    getMoodSummary
} = require("../services/moodService");


async function addMood(req, res) {

    try {

        const mood = await createMood(
            req.user.userId,
            req.body
        );


        res.status(201).json({
            success: true,
            message: "Mood entry created",
            mood
        });


    } catch (error) {

        console.error("Add mood error:", error);


        res.status(500).json({
            success: false,
            message: "Failed to create mood entry"
        });
    }
}


async function getMoods(req, res) {

    try {

        const moods = await getMoodHistory(
            req.user.userId
        );


        res.json({
            success: true,
            moods
        });


    } catch (error) {

        console.error("Get moods error:", error);


        res.status(500).json({
            success: false,
            message: "Failed to retrieve mood history"
        });
    }
}


async function getSummary(req, res) {

    try {

        const summary = await getMoodSummary(
            req.user.userId
        );


        res.json({
            success: true,
            summary
        });


    } catch (error) {

        console.error("Mood summary error:", error);


        res.status(500).json({
            success: false,
            message: "Failed to retrieve mood summary"
        });
    }
}


module.exports = {
    addMood,
    getMoods,
    getSummary
};