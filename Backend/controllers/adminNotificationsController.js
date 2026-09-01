import AdminNotification from "../models/adminNotification.js"

export const getAdminNotifications = async (req, res) => {
    const notes = await AdminNotification.find().sort({createdAt: -1})
    res.json(notes)
}

export const markAdminNotificationSeen = async (req, res) => {
    const note = await AdminNotification.findByIdAndUpdate(req.params.id, { seen: true }, {new: true});
    res.json(note)
}

export const createAdminNotification = async (req, res) => {
    const note = await AdminNotification.create(req.body)
    res.json(note)
}