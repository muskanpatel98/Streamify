import mongoose from "mongoose";
const commentschema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    videoid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videofiles",
      required: true,
    },
    commentbody: { type: String ,required: true },
    usercommented: { type: String, required: true },
    location: { type: String }, // 🌍 City name from GeoIP

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    commentedon: { type: Date, default: Date.now },
     translations:{
     type: Map,
    of: String,
    default: {}
   }
  },
  {
    timestamps: true,
  },
  
   
);

export default mongoose.model("comment", commentschema);