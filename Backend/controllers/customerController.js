import Customer from "../models/Customer.js"


export const createCustomer = async (req, res) => {
    const customer = await Customer.create(req.body)
    res.json(customer)
}


export const getCustomers = async (req, res) => {
    const customers = await Customer.find()
    res.json(customers)
}


export const updateCustomer = async (req, res) => {
    const update = await Customer.findByIdAndUpdate(req.params.id , req.body,{
        new:true,
    })
    res.json(update)
}


export const deleteCustomer = async (req, res) => {
    await Customer.findByIdAndDelete(req.params.id)

    res.json({message:"Customer deleted"})
}