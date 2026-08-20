const {
    registerStudent,
    loginUser
} = require("../services/authService");


async function register(req, res) {

    try {

        const {
            email,
            password,
            fullName,
            department,
            yearOfStudy
        } = req.body;

        const student = await registerStudent({
            email,
            password,
            fullName,
            department,
            yearOfStudy
        });

        res.status(201).json({
            success: true,
            message: "Student registered successfully",
            student
        });

    } catch (error) {

        if (error.message === "EMAIL_EXISTS") {

            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });

        }

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
}


async function login(req, res) {

    try {

        const {
            email,
            password
        } = req.body;

        const result = await loginUser(
            email,
            password
        );

        res.json({
            success: true,
            ...result
        });

    } catch (error) {

        if (error.message === "INVALID_CREDENTIALS") {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
}


module.exports = {
    register,
    login
};