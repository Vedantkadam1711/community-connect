import { db } from "../config/db.js";

// ========================================
// REGISTER FOR EVENT
// ========================================
export const registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = db.events.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const existingRegistration = db.registrations.findOne({ user: userId, event: eventId });
    if (existingRegistration) {
      return res.status(409).json({ success: false, message: "You are already registered for this event." });
    }

    const registeredCount = db.registrations.countDocuments({ event: eventId });
    if (registeredCount >= event.maxParticipants) {
      return res.status(409).json({ success: false, message: "Event is full." });
    }

    const registration = db.registrations.create({ user: userId, event: eventId });

    return res.status(201).json({
      success: true,
      message: "Successfully registered for this event.",
      registration
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ========================================
// CANCEL REGISTRATION
// ========================================
export const cancelRegistration = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const registration = db.registrations.findOne({ user: userId, event: eventId });
    if (!registration) {
      return res.status(404).json({ success: false, message: "Registration not found." });
    }

    db.registrations.findByIdAndDelete(registration._id);

    return res.status(200).json({ success: true, message: "Registration cancelled successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ========================================
// GET MY REGISTRATIONS
// ========================================
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = db.registrations.find({ user: req.user._id });

    const enriched = registrations.map(reg => {
      const event = db.events.findById(reg.event);
      return { ...reg, event };
    });

    return res.status(200).json({ success: true, count: enriched.length, registrations: enriched });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ========================================
// GET EVENT PARTICIPANTS (organizer only)
// ========================================
export const getParticipants = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = db.events.findById(eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    if (event.organizer !== req.user._id) {
      return res.status(403).json({ success: false, message: "You are not authorized to view participants." });
    }

    const registrations = db.registrations.find({ event: eventId });

    const participants = registrations.map(reg => {
      const user = db.users.findById(reg.user);
      return {
        _id: reg._id,
        registeredAt: reg.registeredAt,
        user: user ? { _id: user._id, name: user.name, email: user.email } : null
      };
    });

    return res.status(200).json({ success: true, count: participants.length, participants });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};