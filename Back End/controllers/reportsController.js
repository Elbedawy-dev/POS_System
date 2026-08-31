import Invoice from "../models/Invoice.js"


export const dailyReport = async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0) 

    const invoices = await Invoice.find({
        createdAt:{$gte:today}
    })

    const totalSales = invoices.reduce((acc, inv)=> acc + inv.finalTotal,0)

    res.json({
        date:today,
        totalSales,
        count:invoices.length,
    })
}


export const rangeReport = async (req, res) => {
    const {start , end} = req.body

    const invoices = await Invoice.find({
        createdAt:{$gte:new Date(start) , $lte:new Date(end)}
    })

    const total = invoices.reduce((acc, i)=> acc + i.finalTotal,0)

    res.json({
        invoices,
        total,
    })
}

export const topProducts = async (req, res) => {
    const data = await Invoice.aggregate([
        { $unwind: "$items" },
        { $group: { _id: "$items.productId", sold: { $sum: "$items.qty" } } },
        { $sort: { sold: -1 } },
        { $limit: 10 },
        { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
        { $unwind: "$product" },
        { $project: { _id: "$product.name", sold: 1 } },
    ]);
    res.json(data);
};

export const weeklyReport = async (req, res) => {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const invoices = await Invoice.find({ createdAt: { $gte: start } });

    const days = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        const nextDay = new Date(day);
        nextDay.setDate(day.getDate() + 1);

        const dayTotal = invoices
            .filter(inv => inv.createdAt >= day && inv.createdAt < nextDay)
            .reduce((acc, inv) => acc + inv.finalTotal, 0);

        days.push({
            date: day.toISOString().split("T")[0],
            sales: dayTotal,
        });
    }

    res.json(days);
};