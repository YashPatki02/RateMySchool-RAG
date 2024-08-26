import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `You are an expert in RateMySchool, equipped with detailed data about various universities. Your role is to help users find the best results based on their queries by providing accurate and relevant information from the dataset. Respond to user questions with clear, informative answers based on the available data about schools.If a user asks a question outside of your knowledge or data, politely reply, "I don't have knowledge about that."`;

export async function POST(req) {
  // conversation

  const data = await req.json();
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  const index = pc.Index("demo").namespace("ns1");
  const openai = new OpenAI();

  const text = data[data.length - 1].content;
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float',
  })

  //
  const res = await index.query({
    topK: 3,
    includeMetadata: true,
    vector: embedding.data[0].embedding,
  });
  let resultString = "Returned result from vector db";
  res.matches.forEach((match) => {
    resultString += `\n\n
    id: ${match.id}',\n
    schoolID: ${match.metadata.schoolID},\n
    Location:${match.metadata.Location},\n
    OverallScore: ${match.metadata.OverallScore},\n
    Safety: ${match.metadata.Saftey},\n
    Reputation: ${match.metadata.Reputation},\n
    Facilities: ${match.metadata.Facilities},\n
    Happiness: ${match.metadata.Happiness},\n
    Opportunities: ${match.metadata.Opportunities},\n
    Internet: ${match.metadata.Internet},\n
    Clubs: ${match.metadata.Clubs},\n
    Social: ${match.metadata.Social},\n
    Location_Rating: ${match.metadata.Location_Rating},\n
    Food: ${match.metadata.Food}
    \n\n
    `;
  });
  console.log("result string")
  console.log(resultString)
  const lastMessage = data[data.length - 1];
  const lastMessageContent = lastMessage + resultString;
  const lastDataWithoutLastMessage = data.slice(0, data.length - 1);
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      ...lastDataWithoutLastMessage,
      { role: "user", content: lastMessageContent },
    ],
    model: "gpt-3.5-turbo",
    stream: true,
  });
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });
  return new NextResponse(stream);
}
