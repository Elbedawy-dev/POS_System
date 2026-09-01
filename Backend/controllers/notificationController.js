import Notifications from "../models/Notifications.js"


export const getNotifications = async (req, res) => {
    const notes = await Notifications.find().sort({createdAt:-1})
    res.json(notes)
}


export const markSeen = async (req, res) => {
    const note = await Notifications.findByIdAndUpdate(
        req.params.id,
        {seen:true},
        {new:true}
    )

    res.json(note)
}