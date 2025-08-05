import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface RelatedVideosProps {
  videos: Array<{
    _id: string;
    videotitle: string;
    videochanel: string;
    views: number;
    createdAt: string;
  }>;
}
const vid = "/video/vdo.mp4";
export default function RelatedVideos({ videos }: any) {
  console.log(videos);
  return (
    <div className="space-y-2">
      {/* {videos.map((video) => ( */}
        <Link
          key={videos._id}
          href={`/watch/${videos._id}`}
          className="flex gap-2 group"
        >
          <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden flex-shrink-0">
            <video
              src={vid}
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600">
              {videos.videotitle}
            </h3>
            <p className="text-xs text-gray-600 mt-1">{videos.videochanel}</p>
            <p className="text-xs text-gray-600">
              {videos.views.toLocaleString()} views •{" "}
              {formatDistanceToNow(new Date(videos.createdAt))} ago
            </p>
          </div>
        </Link>
      
    </div>
  );
}