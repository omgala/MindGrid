const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const pool = require("../config/database");

async function registerStudent({
    email,
    password,
    fullName,
    department,
    yearOfStudy
}) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Check whether email already exists
        const existingUser = await client.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            throw new Error("EMAIL_EXISTS");
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const userResult = await client.query(
            `
            INSERT INTO users (
                email,
                password_hash,
                role
            )
            VALUES ($1, $2, 'STUDENT')
            RETURNING id, email, role
            `,
            [email, passwordHash]
        );

        const user = userResult.rows[0];

        // Generate anonymous student ID
        const anonymousId =
            "MG-" +
            crypto.randomBytes(4).toString("hex").toUpperCase();

        // Create student profile
        await client.query(
            `
            INSERT INTO student_profiles (
                user_id,
                student_id,
                department,
                year_of_study,
                anonymous_id
            )
            VALUES ($1, $2, $3, $4, $5)
            `,
            [
                user.id,
                anonymousId,
                department || null,
                yearOfStudy || null,
                anonymousId
            ]
        );

        // Store identity separately
        await client.query(
            `
            INSERT INTO student_identities (
                user_id,
                full_name,
                email
            )
            VALUES ($1, $2, $3)
            `,
            [
                user.id,
                fullName,
                email
            ]
        );

        await client.query("COMMIT");

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            anonymousId
        };

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();

    }
}


async function loginUser(email, password) {

    const result = await pool.query(
        `
        SELECT
            id,
            email,
            password_hash,
            role
        FROM users
        WHERE email = $1
        AND is_active = TRUE
        `,
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const user = result.rows[0];

    const passwordCorrect = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordCorrect) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const token = jwt.sign(
        {
            userId: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        }
    };
}


module.exports = {
    registerStudent,
    loginUser
};