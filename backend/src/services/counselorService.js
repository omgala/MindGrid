const pool = require("../config/database");


async function getAvailableCounselors() {

    const result = await pool.query(`
        SELECT
            user_id,
            first_name,
            last_name,
            specialization,
            qualification,
            experience_years,
            is_available
        FROM public.counselor_profiles
        WHERE is_available = true
        ORDER BY first_name ASC, last_name ASC
    `);

    return result.rows;
}


async function getCounselorById(counselorUserId) {

    const result = await pool.query(
        `
        SELECT
            user_id,
            first_name,
            last_name,
            specialization,
            qualification,
            experience_years,
            is_available
        FROM public.counselor_profiles
        WHERE user_id = $1
        `,
        [counselorUserId]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}


async function createAppointment(
    studentUserId,
    counselorUserId,
    appointmentTime,
    durationMinutes,
    studentNote
) {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const counselorResult = await client.query(
            `
            SELECT
                user_id,
                is_available
            FROM public.counselor_profiles
            WHERE user_id = $1
            `,
            [counselorUserId]
        );

        if (counselorResult.rows.length === 0) {
            throw new Error("Counselor not found");
        }

        if (!counselorResult.rows[0].is_available) {
            throw new Error("Counselor is currently unavailable");
        }

        const appointmentDate = new Date(appointmentTime);

        if (Number.isNaN(appointmentDate.getTime())) {
            throw new Error("Invalid appointment time");
        }

        if (appointmentDate.getTime() <= Date.now()) {
            throw new Error("Appointment time must be in the future");
        }

        const duration = Number(durationMinutes ?? 30);

        if (
            !Number.isInteger(duration) ||
            duration <= 0 ||
            duration > 180
        ) {
            throw new Error(
                "Appointment duration must be between 1 and 180 minutes"
            );
        }

        const conflictResult = await client.query(
            `
            SELECT id
            FROM public.appointments
            WHERE counselor_user_id = $1
              AND status IN ('PENDING', 'CONFIRMED')
              AND appointment_time <
                  ($2::timestamp + ($3 * INTERVAL '1 minute'))
              AND
                  (appointment_time +
                   (duration_minutes * INTERVAL '1 minute'))
                  > $2::timestamp
            LIMIT 1
            `,
            [
                counselorUserId,
                appointmentDate,
                duration
            ]
        );

        if (conflictResult.rows.length > 0) {
            throw new Error(
                "Counselor already has an appointment during this time"
            );
        }

        const studentConflict = await client.query(
            `
            SELECT id
            FROM public.appointments
            WHERE student_user_id = $1
              AND status IN ('PENDING', 'CONFIRMED')
              AND appointment_time <
                  ($2::timestamp + ($3 * INTERVAL '1 minute'))
              AND
                  (appointment_time +
                   (duration_minutes * INTERVAL '1 minute'))
                  > $2::timestamp
            LIMIT 1
            `,
            [
                studentUserId,
                appointmentDate,
                duration
            ]
        );

        if (studentConflict.rows.length > 0) {
            throw new Error(
                "You already have an appointment during this time"
            );
        }

        const appointmentResult = await client.query(
            `
            INSERT INTO public.appointments
            (
                student_user_id,
                counselor_user_id,
                appointment_time,
                duration_minutes,
                status,
                student_note
            )
            VALUES
            ($1, $2, $3, $4, 'PENDING', $5)
            RETURNING
                id,
                counselor_user_id,
                appointment_time,
                duration_minutes,
                status,
                student_note,
                created_at
            `,
            [
                studentUserId,
                counselorUserId,
                appointmentDate,
                duration,
                studentNote ?? null
            ]
        );

        await client.query("COMMIT");

        return appointmentResult.rows[0];

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
}


async function getStudentAppointments(studentUserId) {

    const result = await pool.query(
        `
        SELECT
            a.id,
            a.counselor_user_id,
            a.appointment_time,
            a.duration_minutes,
            a.status,
            a.student_note,
            a.counselor_note,
            a.created_at,
            a.updated_at,

            c.first_name AS counselor_first_name,
            c.last_name AS counselor_last_name,
            c.specialization AS counselor_specialization

        FROM public.appointments a

        JOIN public.counselor_profiles c
            ON c.user_id = a.counselor_user_id

        WHERE a.student_user_id = $1

        ORDER BY a.appointment_time DESC
        `,
        [studentUserId]
    );

    return result.rows;
}


/*
 * COUNSELOR APPOINTMENTS
 */

async function getCounselorAppointments(counselorUserId) {

    const result = await pool.query(
        `
        SELECT
            a.id,
            a.student_user_id,
            a.appointment_time,
            a.duration_minutes,
            a.status,
            a.student_note,
            a.counselor_note,
            a.created_at,
            a.updated_at

        FROM public.appointments a

        WHERE a.counselor_user_id = $1

        ORDER BY a.appointment_time ASC
        `,
        [counselorUserId]
    );

    return result.rows;
}


async function updateAppointmentStatus(
    appointmentId,
    counselorUserId,
    newStatus
) {

    const result = await pool.query(
        `
        UPDATE public.appointments

        SET
            status = $1,
            updated_at = CURRENT_TIMESTAMP

        WHERE id = $2
          AND counselor_user_id = $3
          AND status = 'PENDING'

        RETURNING
            id,
            student_user_id,
            counselor_user_id,
            appointment_time,
            duration_minutes,
            status,
            student_note,
            counselor_note,
            created_at,
            updated_at
        `,
        [
            newStatus,
            appointmentId,
            counselorUserId
        ]
    );

    if (result.rows.length === 0) {

        throw new Error(
            "Appointment not found, does not belong to you, or is not pending"
        );
    }

    return result.rows[0];
}


async function confirmAppointment(
    appointmentId,
    counselorUserId
) {

    return updateAppointmentStatus(
        appointmentId,
        counselorUserId,
        "CONFIRMED"
    );
}


async function cancelAppointment(
    appointmentId,
    counselorUserId
) {

    return updateAppointmentStatus(
        appointmentId,
        counselorUserId,
        "CANCELLED"
    );
}

async function completeAppointment(
    appointmentId,
    counselorUserId,
    counselorNote
) {

    const result = await pool.query(
        `
        UPDATE public.appointments

        SET
            status = 'COMPLETED',
            counselor_note = $1,
            updated_at = CURRENT_TIMESTAMP

        WHERE id = $2
          AND counselor_user_id = $3
          AND status = 'CONFIRMED'

        RETURNING
            id,
            student_user_id,
            counselor_user_id,
            appointment_time,
            duration_minutes,
            status,
            student_note,
            counselor_note,
            created_at,
            updated_at
        `,
        [
            counselorNote ?? null,
            appointmentId,
            counselorUserId
        ]
    );


    if (result.rows.length === 0) {

        throw new Error(
            "Appointment not found, does not belong to you, or is not confirmed"
        );
    }


    return result.rows[0];
}

module.exports = {
    getAvailableCounselors,
    getCounselorById,
    createAppointment,
    getStudentAppointments,
    getCounselorAppointments,
    confirmAppointment,
    cancelAppointment,
    completeAppointment
};