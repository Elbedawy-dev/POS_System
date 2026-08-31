import Settings from "../models/Settings.js"


export const getAdminSettings = async(req, res) => {
    const settings = await Settings.findOne()
    res.json(settings)
}


export const updateAdminSettings = async(req, res)=>{  
    const settings = await Settings.findOneAndUpdate({}, req.body , {new:true , upsert: true})
    res.json(settings)
}