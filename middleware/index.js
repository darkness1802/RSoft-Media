import jwt from "jsonwebtoken"

export default async function Middleware (req, res, next) {
    let { token } = req.headers
    jwt.verify(token, global.JWT_ACCESS_SECRET, function(err, decoded) {
        if (err) return res.status(401).json({ status: 401, msg: "Unauthorized" })
        req.user = decoded
        next()
    })
}