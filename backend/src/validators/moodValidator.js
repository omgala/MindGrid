const {
    body,
    validationResult
} = require("express-validator");


const moodValidationRules = [

    body("moodScore")
        .isInt({ min: 1, max: 5 })
        .withMessage("Mood score must be between 1 and 5"),

    body("stressLevel")
        .isInt({ min: 1, max: 5 })
        .withMessage("Stress level must be between 1 and 5"),

    body("energyLevel")
        .isInt({ min: 1, max: 5 })
        .withMessage("Energy level must be between 1 and 5"),

    body("sleepHours")
        .isFloat({ min: 0, max: 24 })
        .withMessage("Sleep hours must be between 0 and 24"),

    body("note")
        .optional()
        .isString()
        .isLength({ max: 2000 })
        .withMessage("Note must be under 2000 characters")
];


function validateMood(req, res, next) {

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
    moodValidationRules,
    validateMood
};