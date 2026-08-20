const express = require("express");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {
    createChatSession,
    getChatSessions,
    getChatMessages,
    sendChatMessage
} = require("../controllers/chatController");


const router = express.Router();


router.use(
    authenticateToken,
    authorizeRoles("STUDENT")
);


router.post(
    "/sessions",
    createChatSession
);


router.get(
    "/sessions",
    getChatSessions
);


router.get(
    "/sessions/:sessionId/messages",
    getChatMessages
);


router.post(
    "/sessions/:sessionId/messages",
    sendChatMessage
);


module.exports = router;