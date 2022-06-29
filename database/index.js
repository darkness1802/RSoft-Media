import mongoose from "mongoose"

export default function DBConnect () {
    mongoose.connect(global.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    const db = mongoose.connection
    db.on("error", console.error.bind(console, "connection error:"))
    db.once("open", () => {
        console.log("  ::: ROYAL SOFT SERVER :::  ")
    })
}

