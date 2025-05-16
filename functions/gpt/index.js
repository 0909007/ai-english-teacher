import { OpenAI } from "openai";

export async function onRequest(context) {
  const { request, env } = context;

  try {
    const { message } = await request.json();
    const openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "너는 친절한 영어 선생님이야." },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "오류 발생" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
