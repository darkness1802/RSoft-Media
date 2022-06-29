import express from 'express'
import Users from "../database/users.model.js"
import jwt from 'jsonwebtoken'
import Middleware from '../middleware/index.js'

const user = express.Router()

user.get("/", (req, res) => {
    res.status(200).json({ status: 200, msg: "User Router" })
})

user.post("/signin", async (req, res) => {
    let { username, password } = req.body
    console.log(`POST :: SIGN_IN [ ${username} | ${password} ]`)

    try {
        let user = await Users.findOne({ username, password })
        if (user) {
            let token = jwt.sign({ username:user.username, email:user.email }, global.JWT_ACCESS_SECRET, { expiresIn: "8h" })
            return res.status(200).json({ status: 200, msg: "Sign in success", username, token })
        } else return res.status(404).json({ status: 404, msg: "Not found" })
    } catch (error) {
        return res.status(500).json({ status: 500, msg: "Error", error })
    }
})

user.post("/signup", async (req, res) => {
    let { username, password, email } = req.body
    console.log(`POST :: SIGN_UP`)
    console.table({ username, password, email })
    try {
        let result = await Users.create({ username, password, email })
        let token = jwt.sign({ username:result.username, email:result.email }, global.JWT_ACCESS_SECRET, { expiresIn: "8h" })
        return res.status(200).json({ status: 200, msg: "Success", username, token })
    } catch (err) {
        return res.status(500).json({ status: 500, msg: "Error", err })
    }
})

user.get(`/get-library`, Middleware, async (req, res) => {
    let { username } = req.user
    console.log(`GET :: LIBRARY [ ${username} ]`)
    try {
        let result = await Users.findOne({ username })
        return res.status(200).json({ status: 200, msg: "Success", library: result.library })
    } catch (err) {
        return res.status(500).json({ status: 500, msg: "Error", err })
    }
})

user.post(`/add-to-library`, Middleware, async (req, res) => {
    // Add a audio to user's library
    console.log(req.headers)
    let { source } = req.body
    try {
        let user = await Users.findOne({ username:req.user.username })
        if (user) {
            user.library.push(source)
            await user.save()
            return res.status(200).json({ status: 200, msg: "Success" })
        } else return res.status(404).json({ status: 404, msg: "Not found" })
    } catch (err) {
        return res.status(500).json({ status: 500, msg: "Error", err })
    }
})

export default user