const {
    getAvailableCounselors,
    getCounselorById,
    createAppointment,
    getStudentAppointments,
    getCounselorAppointments,
    confirmAppointment,
    cancelAppointment,
    completeAppointment
} = require("../services/counselorService");


async function getCounselors(req, res) {

    try {

        const counselors =
            await getAvailableCounselors();

        res.json({
            success: true,
            counselors
        });

    } catch (error) {

        console.error("Get counselors error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve counselors"
        });
    }
}


async function getCounselor(req, res) {

    try {

        const counselor =
            await getCounselorById(req.params.id);

        if (!counselor) {

            return res.status(404).json({
                success: false,
                message: "Counselor not found"
            });
        }

        res.json({
            success: true,
            counselor
        });

    } catch (error) {

        console.error("Get counselor error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve counselor"
        });
    }
}


async function create(req, res) {

    try {

        const {
            counselorUserId,
            appointmentTime,
            durationMinutes,
            studentNote
        } = req.body;

        if (!counselorUserId) {

            return res.status(400).json({
                success: false,
                message: "counselorUserId is required"
            });
        }

        if (!appointmentTime) {

            return res.status(400).json({
                success: false,
                message: "appointmentTime is required"
            });
        }

        const appointment =
            await createAppointment(
                req.user.userId,
                counselorUserId,
                appointmentTime,
                durationMinutes ?? 30,
                studentNote
            );

        res.status(201).json({
            success: true,
            message: "Appointment request created successfully",
            appointment
        });

    } catch (error) {

        console.error(
            "Create appointment error:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


async function getAppointments(req, res) {

    try {

        const appointments =
            await getStudentAppointments(
                req.user.userId
            );

        res.json({
            success: true,
            appointments
        });

    } catch (error) {

        console.error(
            "Get appointments error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to retrieve appointments"
        });
    }
}


/*
 * COUNSELOR APPOINTMENT MANAGEMENT
 */

async function getCounselorManageAppointments(req, res) {

    try {

        const appointments =
            await getCounselorAppointments(
                req.user.userId
            );

        res.json({
            success: true,
            appointments
        });

    } catch (error) {

        console.error(
            "Get counselor appointments error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to retrieve counselor appointments"
        });
    }
}


async function confirm(req, res) {

    try {

        const appointment =
            await confirmAppointment(
                req.params.id,
                req.user.userId
            );

        res.json({
            success: true,
            message: "Appointment confirmed successfully",
            appointment
        });

    } catch (error) {

        console.error(
            "Confirm appointment error:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


async function cancel(req, res) {

    try {

        const appointment =
            await cancelAppointment(
                req.params.id,
                req.user.userId
            );

        res.json({
            success: true,
            message: "Appointment cancelled successfully",
            appointment
        });

    } catch (error) {

        console.error(
            "Cancel appointment error:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function complete(req, res) {

    try {

        const {
            counselorNote
        } = req.body;


        const appointment =
            await completeAppointment(
                req.params.id,
                req.user.userId,
                counselorNote
            );


        res.json({
            success: true,
            message: "Appointment completed successfully",
            appointment
        });

    } catch (error) {

        console.error(
            "Complete appointment error:",
            error
        );


        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getCounselors,
    getCounselor,
    create,
    getAppointments,
    getCounselorManageAppointments,
    confirm,
    cancel,
    complete
};