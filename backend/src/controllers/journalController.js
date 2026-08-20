const {
    createJournalEntry,
    getJournalEntries,
    getJournalEntry,
    updateJournalEntry,
    deleteJournalEntry
} = require("../services/journalService");


async function createEntry(req, res) {

    try {

        const entry = await createJournalEntry(
            req.user.userId,
            req.body
        );


        res.status(201).json({
            success: true,
            message: "Journal entry created",
            journal: entry
        });


    } catch (error) {

        console.error("Create journal error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create journal entry"
        });
    }
}


async function getEntries(req, res) {

    try {

        const entries = await getJournalEntries(
            req.user.userId
        );


        res.json({
            success: true,
            journals: entries
        });


    } catch (error) {

        console.error("Get journals error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve journal entries"
        });
    }
}


async function getEntry(req, res) {

    try {

        const entry = await getJournalEntry(
            req.user.userId,
            req.params.id
        );


        if (!entry) {

            return res.status(404).json({
                success: false,
                message: "Journal entry not found"
            });
        }


        res.json({
            success: true,
            journal: entry
        });


    } catch (error) {

        console.error("Get journal error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve journal entry"
        });
    }
}


async function updateEntry(req, res) {

    try {

        const entry = await updateJournalEntry(
            req.user.userId,
            req.params.id,
            req.body
        );


        if (!entry) {

            return res.status(404).json({
                success: false,
                message: "Journal entry not found"
            });
        }


        res.json({
            success: true,
            message: "Journal entry updated",
            journal: entry
        });


    } catch (error) {

        console.error("Update journal error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update journal entry"
        });
    }
}


async function deleteEntry(req, res) {

    try {

        const entry = await deleteJournalEntry(
            req.user.userId,
            req.params.id
        );


        if (!entry) {

            return res.status(404).json({
                success: false,
                message: "Journal entry not found"
            });
        }


        res.json({
            success: true,
            message: "Journal entry deleted"
        });


    } catch (error) {

        console.error("Delete journal error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete journal entry"
        });
    }
}


module.exports = {
    createEntry,
    getEntries,
    getEntry,
    updateEntry,
    deleteEntry
};