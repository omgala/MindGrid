const express = require("express");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {
    createEntry,
    getEntries,
    getEntry,
    updateEntry,
    deleteEntry
} = require("../controllers/journalController");

const {
    journalValidationRules,
    validateJournal
} = require("../validators/journalValidator");


const router = express.Router();


router.use(
    authenticateToken,
    authorizeRoles("STUDENT")
);


router.post(
    "/",
    journalValidationRules,
    validateJournal,
    createEntry
);


router.get(
    "/",
    getEntries
);


router.get(
    "/:id",
    getEntry
);


router.put(
    "/:id",
    journalValidationRules,
    validateJournal,
    updateEntry
);


router.delete(
    "/:id",
    deleteEntry
);


module.exports = router;