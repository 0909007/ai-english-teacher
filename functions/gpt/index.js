export async function onRequestPost(context) {
  const { user } = await context.request.json();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${context.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "당신은 친절한 영어 선생님입니다. 학생이 영어로 말하면 대답해주세요." },
        { role: "user", content: user }
      ]
    })
  });

  const data = await response.json();
  return new Response(JSON.stringify({ result: data.choices?.[0]?.message?.content || "오류 발생" }), {
    headers: { "Content-Type": "application/json" }
  });
}
