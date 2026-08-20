require("dotenv").config();

const express = require("express");
const cors = require("cors");

const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const moodRoutes = require("./routes/moodRoutes");
const journalRoutes = require("./routes/journalRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const counselorRoutes =require("./routes/counselorRoutes");

const app = express();

app.use(cors());

app.use(express.json());


// ==========================
// Health
// ==========================

app.get("/", (req, res) => {

    res.json({
        message: "MindGrid API is running"
    });

});


app.get("/api/health", (req, res) => {

    res.json({
        status: "OK",
        service: "MindGrid Backend"
    });

});


// ==========================
// Routes
// ==========================

app.use("/api/test", testRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/student", studentRoutes);

app.use("/api/moods", moodRoutes);

app.use("/api/journals", journalRoutes);

app.use("/api/assessments", assessmentRoutes);

app.use("/api/recommendations",  recommendationRoutes);

app.use("/api/counselors",counselorRoutes);

// ==========================
// 404
// ==========================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found"
    });

});


module.exports = app;