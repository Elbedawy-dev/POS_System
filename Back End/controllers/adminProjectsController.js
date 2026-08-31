import Project from "../models/Project.js"


export const createProject = async(req,res)=>{
    try{
        const project = await Project.create(req.body)
        res.json(project)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

export const getAllProjects = async(req , res)=>{
    const projects = await Project.find()

    res.json(projects)
}


export const getProjectById = async(req , res)=>{
    const project = await Project.findById(req.params.id)

    res.json(project)
}


export const updateProject = async(req,res)=>{
    const update = await Project.findByIdAndUpdate(req.params.id , req.body,{new:true})
    res.json(update)
}

export const deleteProject = async(req,res)=>{
    await Project.findByIdAndDelete(req.params.id)
    res.json({message: "Project Deleted"})
}