import React from 'react';
import { useRouter } from 'next/router';
import { notFound } from 'next/navigation';
import ChannelHeader from '@/components/ui/ChannelHeader';
import ChannelTabs from '@/components/ui/ChannelTabs';
import VideoUploader from '@/components/ui/VideoUploader';
import ChannelVideos from '@/components/ui/ChannelVideos';
import { useUser } from '@/lib/AuthContext';


const Index = () => {
    const router = useRouter();
    const {id} = router.query;
 const { user} = useUser();
  //   const user: any = {
  //   id: "1",
  //   name: "John Doe",
  //   email: "john@example.com",
  //   image: "https://github.com/shadcn.png?height=32&width=32",
  // };
  try {
    let channel = user
    if(!channel) {
        notFound();
    }
    const videos = [
      {
        _id: "1",
        videotitle: "Amazing Nature Documentary",
        filename: "nature-doc.mp4",
        filetype: "video/mp4",
        filepath: "/videos/nature-doc.mp4",
        filesize: "500MB",
        videochanel: "Nature Channel",
        Like: 1250,
        views: 45000,
        uploader: "nature_lover",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        videotitle: "Cooking Tutorial: Perfect Pasta",
        filename: "pasta-tutorial.mp4",
        filetype: "video/mp4",
        filepath: "/videos/pasta-tutorial.mp4",
        filesize: "300MB",
        videochanel: "Chef's Kitchen",
        Like: 890,
        views: 23000,
        uploader: "chef_master",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    return (
        <div className="flex-1 min-h-screen bg-white">
            <div className="max-w-full mx-auto">
            <ChannelHeader channel = {channel} user={user} />
            <ChannelTabs />
            <div className='px-4 pb-8'>
                <VideoUploader channelId = {id} channelName = {channel.channelname}/>
            </div>
            <div>
                <ChannelVideos videos={videos}/>
            </div>
            </div>
        </div>
    );
  } catch (error) {
   console.log("Error fetching channel data", error);
//    notFound();
  }
}

export default Index;