import express from "express"

import cors from "cors"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import userRoutes from "./routes/auth.js"
import videoroutes from "./routes/video.js"
import likeroutes from "./routes/like.js"
import watchlaterroutes from "./routes/watchlater.js";
import historyrroutes from "./routes/history.js";
import commentroutes from "./routes/comment.js";
import path from "path"
dotenv.config()
const app = express()

app.use(cors())
app.use(express.json({limit: "30mb" , extended:true}))
app.use(express.urlencoded({limit:"30mb" , extended:true}))
app.use("/uploads",express.static(path.join("uploads")))
app.get("/" , (req,res)=> {
    res.send("Youtube backend is working")
})

app.use(bodyParser.json())
app.use("/user",userRoutes);
app.use("/video",videoroutes);
app.use("/like", likeroutes);
app.use("/watch", watchlaterroutes);
app.use("/history", historyrroutes);
app.use("/api/comment", commentroutes);
const PORT = process.env.PORT || 5000

app.listen(PORT , ()=> {
    console.log(`server running on port ${PORT}`)
})

const DBURL = process.env.DB_URL
mongoose.connect(DBURL).then(()=> {
    console.log("MongoDb connected")
}).catch((error)=> {
    console.log(error)
})
