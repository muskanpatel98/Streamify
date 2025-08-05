import express from "express";
import { getallvideo, uploadvideo, deleteVideo } from "../controllers/video.js";
import upload from "../filehelper/filehelper.js";
const routes = express.Router();

routes.post("/upload", upload.single("file"), uploadvideo);
routes.get("/getall", getallvideo);
routes.delete("/delete/:id", deleteVideo);
export default routes;