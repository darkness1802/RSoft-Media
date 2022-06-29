import express from 'express'
import ytdl from 'ytdl-core'
import yts from 'yt-search'

const TOP20 = "PLUadgMpPaifXLKV26KIqpFp6mpZiyF2l9"
const TRENDING = "PLUadgMpPaifVmhXn4xz-jRO934EAORUnX"

const video = express.Router()

video.get("/", async (req, res) => {
    res.status(200).json("You can use API to get data from youtube")
})

/** @method get : top 20 */
video.get("/toprate", async (req, res) => {
    console.log("GET :: TOPRATE")
    try {
        const result = await yts({ videoId: TOP20 })
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

/** @method get : trending */
video.get("/trending", async (req, res) => {
    console.log("GET :: TRENDING")
    try {
        const result = await yts({ videoId: TRENDING })
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

/** @method get : video or list info */
video.get("/info", async (req, res) => {
    let { id, type } = req.query
    console.log(`GET :: ${type} <${id}>  INFO`)
    try {
        if (type === "single") {
            const result = await yts({ videoId: id })
            res.status(200).json(result)
        } else if (type === "list") {
            const result = await yts({ listId: id })
            res.status(200).json(result)
        }
    } catch (err) {
        console.log(err)
    }
})

/** @method post : tìm kiếm dựa trên keyword { keyword } */
video.get("/search", async (req, res) => {
    let { keyword } = req.query
    console.log(`POST :: SEARCH <${keyword}>`)
    try {
        const results = await yts(keyword)
        const { videos, playlists, lists, channels } = results
        res.status(200).json({videos, playlists, lists, channels})
    } catch (err) {
        console.log(err)
    }
})

/** @method get : tải file về server rồi truyền về client (beta) */
// video.get("/download", async (req, res) => {
//     // example: localhost:8888/api/download?id=N-MeunQr8gk
//     let { id } = req.query
//     ytdl(id).pipe(fs.createWriteStream('/source/temp.mp4'))
//         .on("finish", () => {
//             res.status(200).download("/source/temp.mp4")
//         })
// })

/** @method get : client gửi đến 1 playlist id, sever xử lý và gửi về 1 mảng các stream src */
video.get("/tracklist", async (req, res) => {
    let id = req.query.id
    console.log(`GET :: TRACK LIST <${id}>`)
    const { videos } = await yts({ listId: id })
    Promise.all(videos.map(item => {
        return ytdl.getInfo(item.videoId)
    })).then(result => {
        let src = result.map(item => {
            return item.formats.find(i => i.itag === 251).url
        })
        res.status(200).json(src)
    })
})

/** @method get : nhận id, trả về 1 media stream src */
video.get("/stream", async (req, res) => {
    let { id } = req.query // example: localhost:8888/video/stream?id=N-MeunQr8gk
    if (!id) res.status(404).json({ code: 404, msg: "Video id is required" })
    console.log(`Get video media stream source: ${id}`)
    try {
        let { formats } = await ytdl.getInfo(id)
        let { url : video } = formats.find(item => item.itag === 137)
        let { url : audio } = formats.find(item => item.itag === 251)
        res.status(200).json({video, audio})
    } catch (err) {
        console.log(err)
        res.status(500).json("Not found")
    }
})

export default video