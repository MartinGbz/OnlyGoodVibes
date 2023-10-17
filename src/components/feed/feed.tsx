import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import {
  Profile,
  ProfileId,
  useActiveProfile,
  useFeed,
} from "@lens-protocol/react-web";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Skeleton } from "../ui/skeleton";

import "./feed.css";

export default function Feed() {
  const { data: profile, error, loading } = useActiveProfile();

  const {
    data: feedData,
    loading: feedLoading,
    hasMore,
    next,
  } = useFeed({
    profileId: profile?.id as ProfileId,
    limit: 10,
  });

  function formatTimeAgo(timestamp: number) {
    const now = Date.now();
    const differenceInSeconds = Math.floor((now - timestamp) / 1000);

    if (differenceInSeconds < 60) {
      return `${differenceInSeconds} s ago`;
    } else if (differenceInSeconds < 3600) {
      const minutes = Math.floor(differenceInSeconds / 60);
      return `${minutes}m ago`;
    } else if (differenceInSeconds < 86400) {
      const hours = Math.floor(differenceInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(differenceInSeconds / 86400);
      return `${days}d ago`;
    }
  }

  const [postsVibe, setPostsVibe] = useState<boolean[]>([]);
  const [hasChatGPTVerified, setHasChatGPTVerified] = useState<boolean>(false);

  useEffect(() => {
    const verifyPostsVibe = async (posts: string[]) => {
      const response = await fetch("/api/vibe", {
        method: "POST",
        body: JSON.stringify({
          posts: posts,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      if (response.ok) {
        setPostsVibe(res);
        setHasChatGPTVerified(true);
      } else {
        console.error("error: ", res.error);
        setHasChatGPTVerified(true);
      }
    };
    if (feedData) {
      console.log(feedData);
      verifyPostsVibe(
        feedData
          .map((post) => post.root.metadata.content)
          .filter((content) => content !== null) as string[]
      );
    }
  }, [feedData]);

  useEffect(() => {
    if (postsVibe.length) {
      console.log({ postsVibe });
    }
  }, [postsVibe]);

  const feedSkeleton = Array.from({ length: 7 }, (_, index) => (
    <div key={index} className="p-4 space-y-4">
      <div className="flex items-center space-x-4 w-full">
        <Skeleton className="h-10 w-12 rounded-full bg-gray-300" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-4 w-full bg-gray-300" />
          <Skeleton className="h-4 custom-width bg-gray-300" />
        </div>
      </div>
      <Skeleton className="h-24 w-full bg-gray-300" />
    </div>
  ));

  useEffect(() => {
    setHasChatGPTVerified(false);
  }, [profile]);

  function getProfilePictureUrl(profile: Profile) {
    if (profile.picture && "original" in profile.picture) {
      return profile.picture?.original.url;
    } else {
      return "https://github.com/shadcn.png";
    }
  }

  return (
    // <div>
    (profile &&
      hasChatGPTVerified &&
      feedData?.map((post, index) => (
        <TooltipProvider key={post.root.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card
                className={
                  `${
                    postsVibe[index] === false
                      ? "blur cursor-pointer"
                      : "pointer-events-none"
                  }` + " break-words"
                }
                onClick={(event) => {
                  event.currentTarget.classList.remove("blur");
                }}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        className="rounded-full object-cover w-full h-full"
                        src={getProfilePictureUrl(post.root.profile)}
                        alt={post.root.profile.name ?? "unknown"}
                      />
                      <AvatarFallback>
                        {post.root.profile.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle>{post.root.profile.name}</CardTitle>
                  </div>
                  <CardDescription>
                    {"@" +
                      post.root.profile.handle +
                      " · " +
                      formatTimeAgo(Date.parse(post.root.createdAt))}
                  </CardDescription>
                </CardHeader>
                <CardContent>{post.root.metadata.content}</CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p> ⬅️ Click to see the bad post</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))) ||
    (profile && !hasChatGPTVerified && feedSkeleton) ||
    (!profile && (
      <div className="h-full flex justify-center content-center items-center text-[20px] md:text-[40px] text-gray-400 font-semibold	">
        {" "}
        Login to see your feed{" "}
      </div>
    ))
  );
}
