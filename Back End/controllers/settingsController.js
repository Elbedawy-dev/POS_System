import Settings from "../models/Settings.js"


export const getSettings = async(req,res)=>{
    const settings = await Settings.findOne()
    res.json(settings)
}


export const updateSettings = async(req,res)=>{
    const settings = await Settings.findOneAndUpdate({}, req.body,{
        new:true,
        upsert:true,
    })

    res.json(settings)
}