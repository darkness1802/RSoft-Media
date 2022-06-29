import { server } from "./api.js"
import { Server } from "socket.io"

var io = new Server(server, {
    'cors': {
        origin: "*",
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {

    socket.on(`generate-remote`, () => {
        socket.emit(`reflex:generate-remote`, socket.id)
        return null
    })

    socket.on(`ping`, data => {
        socket.emit(`reflex:ping`, data)
        return null
    })

    socket.on(`send-command`, ({ action, payload, id }) => {
        socket.to(id).emit(`reflex:send-command`, { action, payload })
        return null
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
        return null
    })
})

const PORT = process.env.PORT || 8888

server.listen(PORT, () => console.log(`Server is running on :: http://localhost:8888`))