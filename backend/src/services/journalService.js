const pool = require("../config/database");


async function createJournalEntry(userId, journalData) {

    const {
        title,
        content,
        moodScore,
        isPrivate
    } = journalData;


    const result = await pool.query(
        `
        INSERT INTO journal_entries
        (
            user_id,
            title,
            content,
            mood_score,
            is_private
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id,
            title,
            content,
            mood_score,
            is_private,
            created_at,
            updated_at
        `,
        [
            userId,
            title || null,
            content,
            moodScore ?? null,
            isPrivate ?? true
        ]
    );


    return result.rows[0];
}


async function getJournalEntries(userId) {

    const result = await pool.query(
        `
        SELECT
            id,
            title,
            content,
            mood_score,
            is_private,
            created_at,
            updated_at
        FROM journal_entries
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [userId]
    );


    return result.rows;
}


async function getJournalEntry(userId, journalId) {

    const result = await pool.query(
        `
        SELECT
            id,
            title,
            content,
            mood_score,
            is_private,
            created_at,
            updated_at
        FROM journal_entries
        WHERE id = $1
        AND user_id = $2
        `,
        [journalId, userId]
    );


    return result.rows[0];
}


async function updateJournalEntry(
    userId,
    journalId,
    journalData
) {

    const {
        title,
        content,
        moodScore,
        isPrivate
    } = journalData;


    const result = await pool.query(
        `
        UPDATE journal_entries
        SET
            title = $1,
            content = $2,
            mood_score = $3,
            is_private = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        AND user_id = $6
        RETURNING
            id,
            title,
            content,
            mood_score,
            is_private,
            created_at,
            updated_at
        `,
        [
            title || null,
            content,
            moodScore ?? null,
            isPrivate ?? true,
            journalId,
            userId
        ]
    );


    return result.rows[0];
}


async function deleteJournalEntry(userId, journalId) {

    const result = await pool.query(
        `
        DELETE FROM journal_entries
        WHERE id = $1
        AND user_id = $2
        RETURNING id
        `,
        [journalId, userId]
    );


    return result.rows[0];
}


module.exports = {
    createJournalEntry,
    getJournalEntries,
    getJournalEntry,
    updateJournalEntry,
    deleteJournalEntry
};