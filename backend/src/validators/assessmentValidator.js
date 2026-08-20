const {
    body,
    validationResult
} = require("express-validator");


const submitAssessmentRules = [

    body("responses")
        .isArray({ min: 1 })
        .withMessage("Responses must contain at least one answer"),

    body("responses.*.questionId")
        .isUUID()
        .withMessage("Invalid question ID"),

    body("responses.*.responseValue")
        .optional()
        .isInt({ min: 0, max: 3 })
        .withMessage(
            "Response value must be between 0 and 3"
        ),

    body("responses.*.responseText")
        .optional()
        .isString()
        .withMessage("Response text must be a string")
];


function validateAssessment(req, res, next) {

    const errors = validationResult(req);


    if (!errors.isEmpty()) {

        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }


    next();
}


module.exports = {
    submitAssessmentRules,
    validateAssessment
};