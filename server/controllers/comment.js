import Comment from "../Modals/comment.js";
import mongoose from "mongoose";
import axios from "axios";
import * as translateModule from "@vitalets/google-translate-api";

export const postcomment = async (req, res) => {
  const commentdata = req.body;
  // if (!isValidComment(commentdata.commentbody)) {
  //   return res
  //     .status(400)
  //     .json({ message: "Comment contains invalid characters" });
  // }
  try {
    // Get IP from request
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Call IP API to get location
    const geoRes = await axios.get(`http://ip-api.com/json/${ip}`);
    const city = geoRes.data?.city || "Unknown";

    const postcomment = new comment({
      ...commentdata,
      location: city, // ✅ add city here
    });

    await postcomment.save();
    return res.status(200).json({ comment: true });
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getallcomment = async (req, res) => {
  const { videoid } = req.params;
  try {
    const commentvideo = await Comment.find({ videoid: videoid });
    return res.status(200).json(commentvideo);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deletecomment = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("comment unavailable");
  }
  try {
    await Comment.findByIdAndDelete(_id);
    return res.status(200).json({ comment: true });
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

export const editcomment = async (req, res) => {
  const { id: _id } = req.params;
  const { commentbody } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("comment unavailable");
  }
  try {
    const updatecomment = await Comment.findByIdAndUpdate(_id, {
      $set: { commentbody: commentbody },
    });
    res.status(200).json(updatecomment);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const likecomment = async (req, res) => {
  const { commentId, userId } = req.body;

  try {
    const existingComment = await Comment.findById(commentId);
    if (!existingComment)
      return res.status(404).json({ message: "Comment not found" });

    // const userIdStr = userId.toString();
    const hasLiked = existingComment.likes.some(
      (id) => id && id.toString() === userId
    );

    if (hasLiked) {
      // If user has already liked, remove like
      existingComment.likes = existingComment.likes.filter(
        (id) => id && id?.toString() !== userId
      );
    } else {
      // Add like
      existingComment.likes.push(userId);
      // Remove dislike if present
      existingComment.dislikes = existingComment.dislikes.filter(
        (id) => id && id.toString() !== userId
      );
    }

    await existingComment.save();
    res.status(200).json(existingComment);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const dislikecomment = async (req, res) => {
  const { commentId, userId } = req.body;

  try {
    const existingComment = await Comment.findById(commentId);
    if (!existingComment)
      return res.status(404).json({ message: "Comment not found" });

    const hasDisliked = existingComment.dislikes.some(
      (id) => id?.toString() === userId
    );

    if (hasDisliked) {
      // Remove dislike
      existingComment.dislikes = existingComment.dislikes.filter(
        (id) => id?.toString() !== userId
      );
    } else {
      // Add dislike
      existingComment.dislikes.push(userId);
      // Remove like if present
      existingComment.likes = existingComment.likes.filter(
        (id) => id?.toString() !== userId
      );
    }

    if (existingComment.dislikes.length >= 2) {
      await comment.findByIdAndDelete(commentId);
      return res.status(200).json({ message: "Comment deleted" });
    } else {
      await existingComment.save();
      res.status(200).json(existingComment);
    }
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const translateComment = async (req, res) => {
   const {id} = req.params;
    const { targetLang } = req.body;

    if (!targetLang) {
    return res.status(400).json({ message: "Target language is required" });
  }


  try {
    const foundComment = await Comment.findById(id);
    if (!foundComment) return res.status(404).json({ message: "Comment not found" });

    const result = await translateModule.translate(foundComment.commentbody, { to: targetLang });
    
   foundComment.translations.set(targetLang, result.text);
    await foundComment.save();
    res.status(200).json({ translated: result.text });
  } catch (error) {
    console.error("Translation error:", error);
    res
      .status(500)
      .json({ message: "Failed to translate", error: error.message });
  }
};
