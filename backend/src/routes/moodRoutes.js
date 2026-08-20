const express = require("express");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {
    addMood,
    getMoods,
    getSummary
} = require("../controllers/moodController");

const {
    moodValidationRules,
    validateMood
} = require("../validators/moodValidator");


const router = express.Router();


router.use(
    authenticateToken,
    authorizeRoles("STUDENT")
);


router.post(
    "/",
    moodValidationRules,
    validateMood,
    addMood
);


router.get(
    "/",
    getMoods
);


router.get(
    "/summary",
    getSummary
);


module.exports = router;