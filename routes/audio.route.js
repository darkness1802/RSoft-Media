import express from 'express'
import ytdl from 'ytdl-core'
import yts from 'yt-search'

const TOP20 = "PLUadgMpPaifXLKV26KIqpFp6mpZiyF2l9"
const TRENDING = "PLUadgMpPaifVmhXn4xz-jRO934EAORUnX"

const audio = express.Router()

/** @method get : top 20 */
audio.get("/toprate", async (req, res) => {
    console.log("GET :: TOPRATE")
    try {
        const result = await yts({ listId: TOP20 })
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

/** @method get : trending */
audio.get("/trending", async (req, res) => {
    console.log("GET :: TRENDING")
    try {
        const result = await yts({ listId: TRENDING })
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

/** @method get : audio stream { id } */
audio.get("/stream", async (req, res) => {
    let { id } = req.query
    console.log(`GET :: AUDIO STREAM <${id}>`)
    try {
        let { formats } = await ytdl.getInfo(id)
        let { url } = formats.find(item => item.itag === 251)
        res.status(200).json(url)
    } catch (err) {
        console.log("Error", err)
        res.status(500).json(err)
    }
})

/** @method get : audio info { id, type } */
audio.get("/info", async (req, res) => {
    
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
audio.post("/search", async (req, res) => {
    let { keyword } = req.body
    console.log(`POST :: SEARCH <${keyword}>`)
    try {
        const results = await yts(keyword)
        const { videos, playlists, lists, channels } = results
        res.status(200).json({videos, playlists, lists, channels})
    } catch (err) {
        console.log(err)
    }
})

/** @method get : 1 list media stream source { id } */
audio.get("/tracklist", async (req, res) => {
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

export default audio