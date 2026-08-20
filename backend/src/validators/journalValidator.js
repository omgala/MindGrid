const {
    body,
    validationResult
} = require("express-validator");


const journalValidationRules = [

    body("title")
        .optional()
        .isString()
        .isLength({ max: 200 })
        .withMessage("Title must be under 200 characters"),

    body("content")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Journal content is required"),

    body("moodScore")
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage("Mood score must be between 1 and 5"),

    body("isPrivate")
        .optional()
        .isBoolean()
        .withMessage("isPrivate must be true or false")
];


function validateJournal(req, res, next) {

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
    journalValidationRules,
    validateJournal
};