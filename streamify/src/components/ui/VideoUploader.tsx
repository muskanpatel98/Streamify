import { Check, X, FileVideo, Upload } from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "@radix-ui/react-label";
import { Progress } from "@radix-ui/react-progress";
import axiosInstance from "@/lib/axiosInstance";


const VideoUploader = ({ channelId, channelName }: any) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handlefilechange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith("video/")) {
        toast.error("Please upload a valid video file.");
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        toast.error("File size exceeds 100MB limit.");
        return;
      }
      setVideoFile(file);
      const filename = file.name;
      if (!videoTitle) {
        setVideoTitle(filename);
      }
    }
  };

  const resetForm = () => {
    setVideoFile(null);
    setVideoTitle("");
    setIsUploading(false);
    setUploadProgress(0);
    setUploadComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const cancelUpload = () => {
    if (isUploading) {
      toast.error("Your video upload has been cancelled");
    }
  };

  const handleUpload = async() => {
    if(!videoFile || !videoTitle.trim()){
      toast.error("Please provide file and title")
      return;
    }
    const formData = new FormData()
    formData.append("file" , videoFile)
    formData.append("videotitle",videoTitle)
    formData.append("videochanel", channelName)
    formData.append("uploader",channelId)
    console.log(formData)
    try{
      setIsUploading(true)
      setUploadProgress(0)
      const res = await axiosInstance.post("/video/upload",formData,{
         headers: {
    "Content-Type": "multipart/form-data", 
  },
        onUploadProgress:(progressEvent:any) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
            setUploadProgress(progress);
        },
      });
       toast.success("Upload successfully");
      resetForm();
    }
     catch (error) {
      console.error("Error uploading video:", error);
      toast.error("There was an error uploading your video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Upload a video</h2>
      <div className="space-y-4">
        {!videoFile ? (
          <>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2"/>
              <p className="text-lg font-medium">Drag and Drop video files to upload</p>
              <p className="text-sm text-gray-500 mt-1">or Click to select files</p>
              <p className="text-xs text-gray-400 mt-4">MP4,WebM,MOV or AVI</p>
              <input
                type="file"
                ref={fileInputRef}
                accept="video/*"
                className="hidden"
                onChange={handlefilechange}
              />
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="bg-blue-100 p-2 rounded-md">
                <FileVideo />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{videoFile.name}</p>
                <p className="text-sm text-gray-500">{(videoFile.size / (1024 * 1024)).toFixed(2)}</p>
              </div>
              {!isUploading && (
                <Button variant="ghost" size="icon" onClick={cancelUpload}>
                  <X className="w-5 h-5"/>
                </Button>
              )}
              {uploadComplete && (
                 <div className="bg-green-100 p-1 rounded-full">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              )}
            </div>

            <div  className="space-y-3">
              <div>
                <Label htmlFor="title"> Title </Label>
                <Input
                  id="title"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Add a title that describes your video"
                  className="mt-1"
                />
              </div>
            </div>
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
            <div  className="flex justify-end gap-3">
              {!uploadComplete && (
                <>
                  <Button onClick={cancelUpload} disabled={uploadComplete}>Cancel</Button>
                  <Button
                  onClick={handleUpload}
                    disabled={
                      isUploading || !videoTitle.trim() || uploadComplete
                    }>{isUploading ? "Uploading..." : "Upload"} </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default VideoUploader;
