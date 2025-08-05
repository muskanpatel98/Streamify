import video from "../Modals/video.js";

export const uploadvideo = async (req, res) => {
  if (req.file === undefined) {
    return res
      .status(404)
      .json({ message: "please upload a mp4 video file only" });
  } else {
    try {
      const file = new video({
        videotitle: req.body.videotitle,
        filename: req.file.originalname,
        filepath: req.file.path,
        filetype: req.file.mimetype,
        filesize: req.file.size,
        videochanel: req.body.videochanel,
        uploader: req.body.uploader,
      });
      await file.save();
      return res.status(201).json("file uploaded successfully");
    } catch (error) {
      console.error(" error:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
};


export const getallvideo = async (req, res) => {
  try {
    const files = await video.find();
    return res.status(200).send(files);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  try {
    const vid = await video.findById(id);
    if (!vid) return res.status(404).json({ message: "Video not found" });

    // Delete video file from filesystem
    fs.unlink(vid.filepath, (err) => {
      if (err) console.error("File deletion error:", err);
    });

    // Delete video document from DB
    await video.findByIdAndDelete(id);

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete video" });
  }
};