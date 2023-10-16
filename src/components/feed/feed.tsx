import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

let items = [
  "Item 1",
  "Item 2",
  "Item 3",
  "Item 4",
  "Item 5",
  "Item 6",
  "Item 7",
  "Item 8",
  "Item 9",
  "Item 10",
];

import { useActiveProfile, useFeed } from "@lens-protocol/react-web";
import { useEffect } from "react";

export default function Feed() {
  // console.log("HEEEERE");
  // console.log({ address });

  const { data: profile, error, loading } = useActiveProfile();

  useEffect(() => {
    console.log("data AHAHAH: " + profile);
    console.log(profile);
    // console.log({ error });
    // console.log({ loading });
  }, [profile, error, loading]);

  const {
    data: feedData,
    loading: feedLoading,
    hasMore,
    next,
  } = useFeed({
    profileId: profile?.id || "0x0",
    limit: 10,
  });

  useEffect(() => {
    console.log({ feedData });
    console.log({ feedLoading });
    console.log({ hasMore });
  }, [feedData, feedLoading, hasMore]);

  function formatTimeAgo(timestamp) {
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

  return (
    <div>
      {/* <MyProfile /> */}
      {feedData?.map((post) => (
        <Card key={post.root.id}>
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
      ))}
    </div>
  );
}
