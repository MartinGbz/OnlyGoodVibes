import { basePrompt, openai } from "@/utils/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
  const body = await req.json();
  const posts: string[] = body.posts;
  console.log(posts.length);

  try {
    const listOfVibes = await getVibeOfPosts(posts);
    return NextResponse.json(listOfVibes, { status: 200 });
  } catch (e: any) {
    console.log(e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

async function getVibeOfPosts(posts: string[]): Promise<boolean[]> {
  const middleprompt = `Your array must contains exactly ${posts.length} elements.
  Messages:`;

  const messageToSend =
    basePrompt + "\n" + middleprompt + "\n\n" + posts.join("\n-");

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: messageToSend }],
    model: "gpt-3.5-turbo",
  });

  const chatResponse = chatCompletion.choices[0].message.content;

  if (!chatResponse) {
    throw new Error("No feeback from ChatGPT");
  }

  let listOfVibes: boolean[];
  try {
    listOfVibes = processChatResponse(chatResponse);
  } catch (e) {
    throw new Error("Error while parsing responses from ChatGPT");
  }

  if (!listOfVibes) {
    throw new Error("Error while parsing responses from ChatGPT");
  }
  return listOfVibes;
}

function processChatResponse(chatResponse: string): boolean[] {
  const listOfVibes: string[] = chatResponse.slice(1, -1).split(", ");
  const listOfVibesToReturn: boolean[] = listOfVibes.map(
    (x) => x === "true" || x === '"true"'
  );
  console.log(chatResponse);
  console.log(listOfVibes);
  console.log(listOfVibesToReturn);
  return listOfVibesToReturn;
}
