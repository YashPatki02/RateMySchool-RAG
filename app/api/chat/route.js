import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `You are a chatbot for UniMatch, designed to assist users in finding the best universities based on their queries. Your primary role is to provide accurate, relevant, and engaging information about universities. You will be given results from a vector database along with each query, which you should use to formulate your responses.

Instructions for Response:
Summarize the university ratings in a clear and engaging way. Highlight the key strengths and unique aspects of each university, rather than listing all details.
Use a friendly and conversational tone to make your responses more personable and relatable.
Provide a brief overview for each university, mentioning a few standout points (e.g., reputation, facilities, social life) and any areas where the university might need improvement.
If a user asks a question outside of the provided knowledge or data, politely respond with, "I don't have knowledge about that."
Encourage further conversation by inviting the user to ask more questions or request more details.`;

export async function POST(req) {
    // conversation

    const data = await req.json();
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pc.Index("demo").namespace("ns1");
    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    const text = data[data.length - 1].content;
    const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float",
    });

    //
    const res = await index.query({
        topK: 3,
        includeMetadata: true,
        vector: embedding.data[0].embedding,
    });
    let resultString = "Returned result from vector database: ";
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
    console.log("result string");
    console.log(resultString);
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
