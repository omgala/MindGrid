const pool = require("../config/database");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});


async function createSession(userId, title = "New conversation") {

    const result = await pool.query(
        `
        INSERT INTO public.chat_sessions
        (
            user_id,
            title,
            last_message_at
        )
        VALUES ($1, $2, CURRENT_TIMESTAMP)
        RETURNING
            id,
            user_id,
            title,
            started_at,
            last_message_at
        `,
        [userId, title]
    );

    return result.rows[0];
}


async function getUserSessions(userId) {

    const result = await pool.query(
        `
        SELECT
            id,
            title,
            started_at,
            last_message_at
        FROM public.chat_sessions
        WHERE user_id = $1
        ORDER BY last_message_at DESC NULLS LAST
        `,
        [userId]
    );

    return result.rows;
}


async function getSessionMessages(
    userId,
    sessionId
) {

    const result = await pool.query(
        `
        SELECT
            m.id,
            m.sender,
            m.message,
            m.created_at
        FROM public.chat_messages m
        JOIN public.chat_sessions s
            ON s.id = m.session_id
        WHERE s.id = $1
          AND s.user_id = $2
        ORDER BY m.created_at ASC
        `,
        [sessionId, userId]
    );

    return result.rows;
}


async function sendMessage(
    userId,
    sessionId,
    userMessage
) {

    const sessionResult = await pool.query(
        `
        SELECT id
        FROM public.chat_sessions
        WHERE id = $1
          AND user_id = $2
        `,
        [sessionId, userId]
    );


    if (sessionResult.rows.length === 0) {
        throw new Error("SESSION_NOT_FOUND");
    }


    await pool.query(
        `
        INSERT INTO public.chat_messages
        (
            session_id,
            sender,
            message
        )
        VALUES ($1, 'USER', $2)
        `,
        [
            sessionId,
            userMessage
        ]
    );


    const historyResult = await pool.query(
        `
        SELECT
            sender,
            message
        FROM public.chat_messages
        WHERE session_id = $1
        ORDER BY created_at ASC
        LIMIT 30
        `,
        [sessionId]
    );


    const history =
        historyResult.rows
            .map((row) =>
                `${row.sender}: ${row.message}`
            )
            .join("\n");


    const prompt = `
You are MindGrid AI Support Assistant.

MindGrid is a digital mental-health support platform
for higher-education students.

Your role is to provide:
- empathetic emotional support
- general wellbeing guidance
- healthy coping strategies
- study and academic stress support
- encouragement to seek professional help when appropriate

You are NOT a replacement for a licensed mental-health professional.

Do not diagnose mental-health conditions.
Do not prescribe medication.
Do not make definitive clinical claims.

If a student describes serious distress, encourage
them to contact a qualified counselor or appropriate
local professional support.

Keep responses supportive, calm, respectful and concise.

Conversation:

${history}

Respond to the student's latest message.
`;


    const result =
        await model.generateContent(prompt);


    const botMessage =
        result.response.text();


    await pool.query(
        `
        INSERT INTO public.chat_messages
        (
            session_id,
            sender,
            message
        )
        VALUES ($1, 'BOT', $2)
        `,
        [
            sessionId,
            botMessage
        ]
    );


    await pool.query(
        `
        UPDATE public.chat_sessions
        SET last_message_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [sessionId]
    );


    return {
        message: botMessage
    };
}


module.exports = {
    createSession,
    getUserSessions,
    getSessionMessages,
    sendMessage
};