export async function onRequestPost(context) {
  try {
    const { text } = await context.request.json();
    const apiKey = context.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: text }]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "죄송해요, 응답을 못 받았어요.";

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ reply: "에러 발생: " + err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
}
