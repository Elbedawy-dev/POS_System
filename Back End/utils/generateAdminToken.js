import jwt from "jsonwebtoken"

export const sendAdminToken = (admin, res) => {
    const token = jwt.sign (
        {id:admin._id, role:admin.role},
        process.env.JWT_SECRET,
        {expiresIn: "7d"},
    );


    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("admin_token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax", 
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

return res.json({
        success: true,
        message: "Authenticated successfully",
        admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
        },
                
        token,
    })
}