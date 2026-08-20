const pool = require("../config/database");


async function createMood(userId, moodData) {

    const {
        moodScore,
        stressLevel,
        energyLevel,
        sleepHours,
        note
    } = moodData;


    const result = await pool.query(
        `
        INSERT INTO mood_entries
        (
            user_id,
            mood_score,
            stress_level,
            energy_level,
            sleep_hours,
            note
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
            id,
            mood_score,
            stress_level,
            energy_level,
            sleep_hours,
            note,
            recorded_at
        `,
        [
            userId,
            moodScore,
            stressLevel,
            energyLevel,
            sleepHours,
            note || null
        ]
    );


    return result.rows[0];
}


async function getMoodHistory(userId, limit = 30) {

    const result = await pool.query(
        `
        SELECT
            id,
            mood_score,
            stress_level,
            energy_level,
            sleep_hours,
            note,
            recorded_at
        FROM mood_entries
        WHERE user_id = $1
        ORDER BY recorded_at DESC
        LIMIT $2
        `,
        [userId, limit]
    );


    return result.rows;
}


async function getMoodSummary(userId) {

    const result = await pool.query(
        `
        SELECT
            COUNT(*)::INTEGER AS total_entries,
            ROUND(AVG(mood_score), 2) AS average_mood,
            ROUND(AVG(stress_level), 2) AS average_stress,
            ROUND(AVG(energy_level), 2) AS average_energy,
            ROUND(AVG(sleep_hours), 2) AS average_sleep
        FROM mood_entries
        WHERE user_id = $1
        `,
        [userId]
    );


    return result.rows[0];
}


module.exports = {
    createMood,
    getMoodHistory,
    getMoodSummary
};