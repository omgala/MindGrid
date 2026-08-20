const express = require("express");


const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");


const {
    getAssessments,
    getAssessment,
    submit,
    getHistory
} = require("../controllers/assessmentController");


const {
    submitAssessmentRules,
    validateAssessment
} = require("../validators/assessmentValidator");


const router = express.Router();


router.use(
    authenticateToken,
    authorizeRoles("STUDENT")
);


router.get(
    "/",
    getAssessments
);


router.get(
    "/history",
    getHistory
);


router.get(
    "/:id",
    getAssessment
);


router.post(
    "/:id/submit",
    submitAssessmentRules,
    validateAssessment,
    submit
);


module.exports = router;