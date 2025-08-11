import express from "express";
import {
  deletecomment,
  getallcomment,
  postcomment,
  editcomment,
  likecomment,
  dislikecomment,
  translateComment,
} from "../controllers/comment.js";


const routes = express.Router();
routes.get("/:videoid", getallcomment);
routes.post("/postcomment", postcomment);
routes.delete("/deletecomment/:id", deletecomment);
routes.post("/editcomment/:id", editcomment);
routes.post("/like", likecomment);
routes.post("/dislike", dislikecomment);
routes.post("/:id/translate", translateComment);


export default routes;
