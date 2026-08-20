const {
    createSession,
    getUserSessions,
    getSessionMessages,
    sendMessage
} = require("../services/chatService");


async function createChatSession(req, res) {

    try {

        const title =
            req.body.title || "New conversation";

        const session =
            await createSession(
                req.user.userId,
                title
            );

        res.status(201).json({
            success: true,
            session
        });

    } catch (error) {

        console.error(
            "Create chat session error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to create chat session"
        });
    }
}


async function getChatSessions(req, res) {

    try {

        const sessions =
            await getUserSessions(
                req.user.userId
            );

        res.json({
            success: true,
            sessions
        });

    } catch (error) {

        console.error(
            "Get chat sessions error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to retrieve chat sessions"
        });
    }
}


async function getChatMessages(req, res) {

    try {

        const messages =
            await getSessionMessages(
                req.user.userId,
                req.params.sessionId
            );

        res.json({
            success: true,
            messages
        });

    } catch (error) {

        console.error(
            "Get chat messages error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to retrieve messages"
        });
    }
}


async function sendChatMessage(req, res) {

    try {

        const {
            message
        } = req.body;


        if (
            !message ||
            typeof message !== "string" ||
            !message.trim()
        ) {

            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }


        const result =
            await sendMessage(
                req.user.userId,
                req.params.sessionId,
                message.trim()
            );


        res.json({
            success: true,
            ...result
        });

    } catch (error) {

        if (
            error.message ===
            "SESSION_NOT_FOUND"
        ) {

            return res.status(404).json({
                success: false,
                message: "Chat session not found"
            });
        }


        console.error(
            "Send chat message error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to send message"
        });
    }
}


module.exports = {
    createChatSession,
    getChatSessions,
    getChatMessages,
    sendChatMessage
};