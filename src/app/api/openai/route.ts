import { basePrompt, openai } from "@/utils/openai";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Say this is a test" }],
    model: "gpt-3.5-turbo",
  });
  console.log({ chatCompletion });
  return NextResponse.json(chatCompletion, { status: 200 });
}

export async function POST(req: Request): Promise<NextResponse> {
  const body = await req.json();
  const messages: string[] = body.messages;
  console.log(messages);
  console.log(messages.length);

  // const messageToSend = basePrompt + "\n\n" + body.message;

  // create a message that takes the basePrompt and adds the all the messages from the body to it as a list
  const messageToSend = basePrompt + "\n\n" + messages.join("\n-");
  console.log(messageToSend);

  // const chatCompletion = await openai.chat.completions.create({
  //   messages: [{ role: "user", content: messageToSend }],
  //   model: "gpt-3.5-turbo",
  // });
  // console.log({ chatCompletion });
  // console.log(chatCompletion.choices);
  // return NextResponse.json({ chatCompletion }, { status: 200 });

  const resOA =
    "[true, true, false, false, true, true, true, false, false, false]";
  // convert the response from openai to a list of booleans
  const resOAList: string[] = resOA.slice(1, -1).split(", ");
  // convert the list of string to a list of boolean
  const resOAListBool: boolean[] = resOAList.map((x) => x === "true");
  console.log(resOAList);
  console.log(resOAListBool);

  return NextResponse.json(resOAListBool, { status: 200 });
}
