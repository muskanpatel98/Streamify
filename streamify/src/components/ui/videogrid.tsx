import React, { useEffect, useState } from "react";
import VideoCard from "./videocard";
import axiosInstance from "@/lib/axiosInstance";

const Videogrid = () => {
  const [videos,setVideos] = useState<any[]>([]);
 const [loading, setloading] = useState(true);
  useEffect(()=>{
    const fetchvideo = async () => {
 try {
        const res = await axiosInstance.get("/video/getall");
        setVideos(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };
    fetchvideo();
  },[]);
  //   const videos = [
  //   {
  //     _id: "1",
  //     videotitle: "Amazing Nature Documentary",
  //     filename: "nature-doc.mp4",
  //     filetype: "video/mp4",
  //     filepath: "/videos/nature-doc.mp4",
  //     filesize: "500MB",
  //     videochanel: "Nature Channel",
  //     Like: 1250,
  //     views: 45000,
  //     uploader: "nature_lover",
  //     createdAt: new Date().toISOString(),
  //   },
  //   {
  //     _id: "2",
  //     videotitle: "Cooking Tutorial: Perfect Pasta",
  //     filename: "pasta-tutorial.mp4",
  //     filetype: "video/mp4",
  //     filepath: "/videos/pasta-tutorial.mp4",
  //     filesize: "300MB",
  //     videochanel: "Chef's Kitchen",
  //     Like: 890,
  //     views: 23000,
  //     uploader: "chef_master",
  //     createdAt: new Date(Date.now() - 86400000).toISOString(),
  //   },
  // ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        { loading ? (
          <> Loading.. </>
        ) : videos.map((video:any)=>(
            <VideoCard key={video._id} video={video}/>
        ))}
        </div>
  )};

  export default Videogrid;