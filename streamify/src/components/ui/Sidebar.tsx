import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./button";
import {
  Home,
  Compass,
  PlaySquare,
  History,
  Clock,
  ThumbsUp,
  User,
} from "lucide-react";
import ChannelDialogue from "./ChannelDialogue";
import { useUser } from "@/lib/AuthContext";

const Sidebar = () => {
   const { user } = useUser();
  // const user: any = {
  //   id: "1",
  //   name: "John Doe",
  //   email: "john@example.com",
  //   image: "https://github.com/shadcn.png?height=32&width=32",
  // };
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  return (
    <aside className="w-64 bg-white  border-r min-h-screen p-2">
      <nav className="space-y-1">
        <Link href={"/"}>
          <Button variant="ghost" className="w-full justify-start">
            <Home className="w-5 h-5 mr-3" />
            Home
          </Button>
        </Link>
        <Link href="/explore">
          <Button variant="ghost" className="w-full justify-start">
            <Compass className="w-5 h-5 mr-3" />
            Explore
          </Button>
        </Link>
        <Link href="/subscriptions">
          <Button variant="ghost" className="w-full justify-start">
            <PlaySquare className="w-5 h-5 mr-3" />
            Subscriptions
          </Button>
        </Link>

        {user && (
          <>
            <div className="border-t pt-2 mt-2">
              <Link href="/history">
                <Button variant="ghost" className="w-full justify-start">
                  <History className="w-5 h-5 mr-3" />
                  History
                </Button>
              </Link>

              <Link href="/liked">
                <Button variant="ghost" className="w-full justify-start">
                  <ThumbsUp className="w-5 h-5 mr-3" />
                  Liked videos
                </Button>
              </Link>
              <Link href="/watch-later">
                <Button variant="ghost" className="w-full justify-start">
                  <Clock className="w-5 h-5 mr-3" />
                  Watch later
                </Button>
              </Link>
              {user?.channelname ? (
                <Link href={`/channel/${user.id}`}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="w-5 h-5 mr-3" />
                  Your Channel
                  </Button>
                </Link>
              ) : (
                <div className="px-2 py-1.5">
                  <Button variant="secondary"
                    size="sm"
                    className="w-full" onClick={() => setIsDialogueOpen(true)}>
                    Create Channel
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
      <ChannelDialogue
        isOpen={isDialogueOpen}
        onClose={() => setIsDialogueOpen(false)}
        mode="create"
      />
    </aside>
  );
};

export default Sidebar;
