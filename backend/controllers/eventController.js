import { db } from "../config/db.js";

export const getAllEvents = async (req, res) => {
  try {
    const events = db.events.find();
    return res.status(200).json({ success: true, count: events.length, events });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error retrieving events." });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = db.events.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }
    return res.status(200).json({ success: true, event });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error retrieving event." });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, maxParticipants } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Event title is required." });
    }
    if (!date) {
      return res.status(400).json({ success: false, message: "Event date is required." });
    }

    const newEvent = db.events.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      date,
      location: location ? location.trim() : "TBD",
      maxParticipants: maxParticipants || 50,
      organizer: req.user._id
    });

    return res.status(201).json({ success: true, message: "Event created successfully.", event: newEvent });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error creating event." });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = db.events.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }
    if (event.organizer !== req.user._id) {
      return res.status(403).json({ success: false, message: "You can only edit your own events." });
    }

    const updatedEvent = db.events.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).json({ success: true, message: "Event updated successfully.", event: updatedEvent });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error updating event." });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = db.events.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }
    if (event.organizer !== req.user._id) {
      return res.status(403).json({ success: false, message: "You can only delete your own events." });
    }

    db.events.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Event deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error deleting event." });
  }
};