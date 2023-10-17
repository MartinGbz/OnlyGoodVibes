import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const baseSoloMessagePrompt = `[MOST IMPORTANT INSTRUCTION: YOU NEED ANSWER ONLY PER "false" or "true"]
You are an agent.
This message is automatialy sent through a website API.
I'll give you a message, you need to determine whether the overall feeling of the message is good, neutral or bad:
- If the message is good or neutral answer: "true"
- If the message is bad answer: "false"
Message:`;

export const basePrompt = `[MOST IMPORTANT INSTRUCTION: YOU NEED ANSWER ONLY PER AN ARRAY THAT CAN CONTAIN EITHER "false" or "true"]
You are an agent.
This message is automaticaly sent through a website API.
I'll give you a list of messages, you need to determine whether the overall feeling of the message is good, neutral or bad:
- If the message is good or neutral answer: "true"
- If the message is bad answer: "false"

Messages are send in a specific order, you need to set your "true" and "false" in the array in the same order.`;

export const basePromptStrict = `[MOST IMPORTANT INSTRUCTION: YOU NEED ANSWER ONLY PER AN ARRAY THAT CAN CONTAIN EITHER "false" or "true"]
You are an agent.
This message is automaticaly sent through a website API.
I'll give you a list of messages, you need to determine whether the overall feeling of the message is good, neutral or bad:
- If the message is good answer: "true"
- If the message is bad or neutral answer: "false"

Messages are send in a specific order, you need to set your "true" and "false" in the array in the same order.`;
