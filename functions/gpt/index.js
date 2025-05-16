import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // 환경변수에서 API 키 읽음
});

export async function onRequest(context) {
  const { request } = context;
  const body = await request.json();

  if (!body.messages) {
    return new Response(
      JSON.stringify({ error: "Missing messages in request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: body.messages,
    });

    return new Response(
      JSON.stringify(completion.choices[0].message),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
