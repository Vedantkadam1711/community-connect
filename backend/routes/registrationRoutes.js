import { Router } from "express";
import { registerForEvent, cancelRegistration, getMyRegistrations, getParticipants } from "../controllers/registrationController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/:id/register", authenticateToken, registerForEvent);
router.delete("/:id/register", authenticateToken, cancelRegistration);
router.get("/my-registrations", authenticateToken, getMyRegistrations);
router.get("/:id/participants", authenticateToken, getParticipants);

export default router;