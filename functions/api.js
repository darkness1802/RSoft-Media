import "../root.js"
import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'
import serverless from 'serverless-http'
import os from "os"
import DBConnect from "../database/index.js"

import audio from '../routes/audio.route.js'
import video from '../routes/video.route.js'
import user from '../routes/user.route.js'

export const app = express()
export const server = http.createServer(app)
DBConnect()
/* <- Socket IO is not supported on Netlify -> */

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.json({
        'SoundBox Server': 'v1.2',
        'Usable RAM': `${os.freemem} byte`,
        'Performance': `${os.cpus()[0].model} X${os.cpus().length} cores`,
        'Features': `Search, Play, Remote ...etc audio or video on youtube without advertisement and user features`,
        'API': {
            '[GET] audio trending': '/audio/trending',
            '[GET] audio top rate': '/audio/toprate',
            '[GET] audio stream': '/audio/stream?id=G4qampDJb-o',
            '[GET] audio info': '/audio/info?id=G4qampDJb-o&type=single',
            '[POST] audio search': '/audio/search { keyword }',
            '[POST] sign in': '/user/signin { username, password }',
            '[POST] sign up': '/user/signup { username, password, email }',
            '[POST] add-to-library': '/user/add-to-library * { source }',
            '[POST] delete-from-library': '/user/detele-from-library * { source }',
            '[GET] get-library': '/user/get-library *',
            '*': 'Require headers.token'
        }
    })
})

app.use("/audio", audio)
app.use("/video", video)
app.use("/user", user)

export const handler = serverless(app)
