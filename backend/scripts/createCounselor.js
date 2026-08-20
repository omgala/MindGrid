require("dotenv").config();

const bcrypt = require("bcrypt");

const pool = require("../src/config/database");


async function createCounselor() {

    const email = "counselor@mindgrid.test";
    const password = "Counselor@123";

    const firstName = "Aarav";
    const lastName = "Shah";

    const specialization =
        "Student Mental Health & Wellbeing";

    const qualification =
        "M.A. Clinical Psychology";

    const experienceYears = 5;


    const client = await pool.connect();


    try {

        await client.query("BEGIN");


        /*
         * Prevent accidental duplicate account.
         */
        const existingUser = await client.query(
            `
            SELECT id, role
            FROM public.users
            WHERE email = $1
            `,
            [email]
        );


        if (existingUser.rows.length > 0) {

            throw new Error(
                `A user with ${email} already exists`
            );
        }


        /*
         * Use the same bcrypt cost factor
         * as the existing student registration.
         */
        const passwordHash =
            await bcrypt.hash(password, 12);


        /*
         * Create counselor user.
         */
        const userResult = await client.query(
            `
            INSERT INTO public.users
            (
                email,
                password_hash,
                role,
                is_active
            )
            VALUES
            ($1, $2, 'COUNSELOR', TRUE)
            RETURNING
                id,
                email,
                role,
                is_active
            `,
            [
                email,
                passwordHash
            ]
        );


        const user = userResult.rows[0];


        /*
         * Create counselor profile.
         */
        await client.query(
            `
            INSERT INTO public.counselor_profiles
            (
                user_id,
                first_name,
                last_name,
                specialization,
                qualification,
                experience_years,
                is_available
            )
            VALUES
            ($1, $2, $3, $4, $5, $6, TRUE)
            `,
            [
                user.id,
                firstName,
                lastName,
                specialization,
                qualification,
                experienceYears
            ]
        );


        await client.query("COMMIT");


        console.log("");
        console.log("Counselor created successfully");
        console.log("--------------------------------");
        console.log("User ID:", user.id);
        console.log("Email:", user.email);
        console.log("Password:", password);
        console.log("Role:", user.role);
        console.log("--------------------------------");
        console.log("Counselor profile created");
        console.log("");


    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "Failed to create counselor:",
            error.message
        );

        process.exitCode = 1;

    } finally {

        client.release();

        /*
         * Close PostgreSQL pool so the script
         * can terminate cleanly.
         */
        await pool.end();
    }
}


createCounselor();