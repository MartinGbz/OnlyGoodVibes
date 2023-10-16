"use client";

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

export default function Home() {
  return (
    <main className="w-screen h-[calc(100vh-3.5rem)] flex flex-row">
      <div
        className="basis-1/4 flex justify-center items-start"
        style={{
          fontSize: "150px",
        }}>
        {" "}
        🍀{" "}
      </div>
      <div className="basis-2/4 overflow-scroll	space-y-2">
        {items.map((data, id) => (
          <Card key={id}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Avatar className="w-10">
                  <AvatarImage
                    className="rounded-full"
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <CardTitle>MartinGbz</CardTitle>
              </div>
              <CardDescription>@martingbz - 10m</CardDescription>
            </CardHeader>
            <CardContent>Post</CardContent>
          </Card>
        ))}
      </div>
      <div
        className="basis-1/4 flex justify-center content-end items-end"
        style={{
          fontSize: "150px",
        }}>
        {" "}
        🍀{" "}
      </div>
    </main>
  );
}
