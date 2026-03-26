import Event from "../models/Event.js";

// POST /api/events/create - submit hackathon (any logged-in user)
export async function createEvent(req, res) {
    try {
        const { title, organization, description, date, mode, location, registrationLink, teamSize, image, type, price } = req.body;
        if (!title || !description || !date || !mode) {
            return res.status(400).json({ error: "title, description, date, and mode are required" });
        }
        const event = await Event.create({
            title,
            organization: organization || "",
            description,
            date,
            mode,
            location: location || "",
            registrationLink: registrationLink || "",
            teamSize: teamSize || 1,
            image: image || "",
            type: type || "hackathon",
            price: price || "Free",
            createdBy: req.userId,
            status: "pending",
        });
        res.status(201).json(event);
    } catch (e) {
        console.error("createEvent error:", e);
        res.status(500).json({ error: "Server error" });
    }
}

// GET /api/events/:id - public: get single hackathon details
export async function getEventById(req, res) {
    try {
        const event = await Event.findById(req.params.id)
            .populate("createdBy", "name username avatar email")
            .lean();
        if (!event) return res.status(404).json({ error: "Event not found" });
        res.json(event);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
}

// GET /api/events - public: only approved hackathons
export async function getApprovedEvents(req, res) {
    try {
        const events = await Event.find({ status: "approved" })
            .sort({ date: 1 })
            .populate("createdBy", "name username")
            .lean();
        res.json(events);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
}

// GET /api/events/admin - all events (admin only)
export async function getAllEvents(req, res) {
    try {
        const events = await Event.find()
            .sort({ createdAt: -1 })
            .populate("createdBy", "name username email")
            .lean();
        res.json(events);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
}

// PUT /api/events/:id/approve
export async function approveEvent(req, res) {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { status: "approved" },
            { new: true }
        );
        if (!event) return res.status(404).json({ error: "Event not found" });
        res.json(event);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
}

// PUT /api/events/:id/reject
export async function rejectEvent(req, res) {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { status: "rejected" },
            { new: true }
        );
        if (!event) return res.status(404).json({ error: "Event not found" });
        res.json(event);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
}

// GET /api/events/my - events created by the logged-in user
export async function getMyEvents(req, res) {
    try {
        const events = await Event.find({ createdBy: req.userId })
            .sort({ createdAt: -1 })
            .lean();
        res.json(events);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
}

// PUT /api/events/:id - update user's own event
export async function updateEvent(req, res) {
    try {
        const { title, organization, description, date, mode, location, registrationLink, teamSize, image, type, price } = req.body;
        const event = await Event.findOne({ _id: req.params.id, createdBy: req.userId });
        if (!event) return res.status(404).json({ error: "Event not found or not authorized" });

        event.title = title || event.title;
        event.organization = organization !== undefined ? organization : event.organization;
        event.description = description || event.description;
        event.date = date || event.date;
        event.mode = mode || event.mode;
        event.location = location !== undefined ? location : event.location;
        event.registrationLink = registrationLink !== undefined ? registrationLink : event.registrationLink;
        event.teamSize = teamSize || event.teamSize;
        event.image = image !== undefined ? image : event.image;
        event.type = type || event.type;
        event.price = price || event.price;

        await event.save();
        res.json(event);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
}

// DELETE /api/events/:id - delete user's own event
export async function deleteEvent(req, res) {
    try {
        const event = await Event.findOneAndDelete({ _id: req.params.id, createdBy: req.userId });
        if (!event) return res.status(404).json({ error: "Event not found or not authorized" });
        res.json({ message: "Event deleted" });
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
}
