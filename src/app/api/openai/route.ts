import { basePrompt, openai } from "@/utils/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
  const body = await req.json();
  const messages: string[] = body.messages;
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

  const chatResponse = chatCompletion.choices[0].message.content;

  if (!chatResponse) {
    return NextResponse.json(
      { error: "no responses from ChatGPT" },
      { status: 500 }
    );
  }

  let listOfVibes: boolean[];
  try {
    listOfVibes = processChatResponse(chatResponse);
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "error parsing responses from ChatGPT" },
      { status: 500 }
    );
  }

  if (!listOfVibes) {
    return NextResponse.json(
      { error: "no responses from ChatGPT" },
      { status: 500 }
    );
  }

  return NextResponse.json(listOfVibes, { status: 200 });
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
