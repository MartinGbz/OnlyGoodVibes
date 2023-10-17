import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { useActiveProfile, useFeed } from "@lens-protocol/react-web";
import { use, useEffect, useState } from "react";
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
    profileId: profile?.id || "0x0",
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

  const [messagesVibe, setMessagesVibe] = useState<boolean[]>([]);
  const [hasChatGPTVerified, setHasChatGPTVerified] = useState<boolean>(false);

  useEffect(() => {
    console.log(feedData);
    const verifyMessagesVibe = async (messages: string[]) => {
      const response = await fetch("/api/openai", {
        method: "POST",
        body: JSON.stringify({
          messages: messages,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      if (response.ok) {
        setMessagesVibe(res);
        setHasChatGPTVerified(true);
      } else {
        console.error("error: ", res.error);
        setHasChatGPTVerified(true);
      }
    };
    if (feedData) {
      verifyMessagesVibe(
        feedData
          .map((post) => post.root.metadata.content)
          .filter((content) => content !== null) as string[]
      );
    }
  }, [feedData]);

  useEffect(() => {
    console.log({ messagesVibe });
  }, [messagesVibe]);

  const feedSkeleton = Array.from({ length: 10 }, (_, index) => (
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

  return (
    <div>
      {hasChatGPTVerified &&
        feedData?.map((post, index) => (
          <TooltipProvider key={post.root.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card
                  className={
                    `${
                      messagesVibe[index] === false
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
                          src={
                            post.root.profile.picture.original.url ??
                            "https://github.com/shadcn.png"
                          }
                          alt="@shadcn"
                        />
                        <AvatarFallback>
                          {post.root.profile.name
                            ?.substring(0, 2)
                            .toUpperCase()}
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
        ))}
      {!hasChatGPTVerified && feedSkeleton}
    </div>
  );
}
