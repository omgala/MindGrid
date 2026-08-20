const express = require("express");

const router = express.Router();

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {
    getCounselors,
    getCounselor,
    create,
    getAppointments,
    getCounselorManageAppointments,
    confirm,
    cancel,
    complete
} = require("../controllers/counselorController");


/*
 * STUDENT
 */

router.get(
    "/",
    authenticateToken,
    authorizeRoles("STUDENT"),
    getCounselors
);


router.get(
    "/appointments",
    authenticateToken,
    authorizeRoles("STUDENT"),
    getAppointments
);


router.post(
    "/appointments",
    authenticateToken,
    authorizeRoles("STUDENT"),
    create
);


/*
 * COUNSELOR
 */

router.get(
    "/appointments/manage",
    authenticateToken,
    authorizeRoles("COUNSELOR"),
    getCounselorManageAppointments
);


router.patch(
    "/appointments/:id/confirm",
    authenticateToken,
    authorizeRoles("COUNSELOR"),
    confirm
);


router.patch(
    "/appointments/:id/complete",
    authenticateToken,
    authorizeRoles("COUNSELOR"),
    complete
);


/*
 * STUDENT
 */

router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("STUDENT"),
    getCounselor
);


module.exports = router;
