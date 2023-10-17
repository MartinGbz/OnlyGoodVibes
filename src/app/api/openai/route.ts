import { basePrompt, openai } from "@/utils/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
  const body = await req.json();
  const messages: string[] = body.messages;
  console.log(messages);
  console.log(messages.length);

  const middleprompt = `Your array must contains exactly ${messages.length} elements.
Messages:`;

  const messageToSend =
    basePrompt + "\n" + middleprompt + "\n\n" + messages.join("\n-");
  console.log(messageToSend);

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: messageToSend }],
    model: "gpt-3.5-turbo",
  });
  console.log({ chatCompletion });
  console.log(chatCompletion.choices);

  const chatResponse = chatCompletion.choices[0].message.content;

  // mock
  // const resOA =
  //   "[true, true, false, false, true, true, true, false, false, false]";

  // convert the response from openai to a list of booleans
  if (!chatResponse) {
    return NextResponse.json(
      { error: "no responses from ChatGPT" },
      { status: 500 }
    );
  }
  const listOfVibes: string[] = chatResponse.slice(1, -1).split(", ");
  const listOfVibesToReturn: boolean[] = listOfVibes.map((x) => x === "true");
  console.log(listOfVibes);
  console.log(listOfVibesToReturn);

  return NextResponse.json(listOfVibesToReturn, { status: 200 });
}
