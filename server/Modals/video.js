import mongoose from "mongoose"
const videoSchema = mongoose.Schema({
    videotitle: {type: String,require: true},
    filename : {type: String , required: true},
   filetype : {type: String , required: true},
   filepath : {type: String , required: true},
   filesize : {type: String , required: true},
    videochanel : {type: String, required: true},
    Like : {type: Number, default: 0},
    views : {type:  Number, default: 0},
   uploader : {type: String},
}, {
    timestamps: true,
}
);

export default mongoose.model("videofiles",videoSchema);

