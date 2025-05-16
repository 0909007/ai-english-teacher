export async function onRequest(context) {
  const { request, env } = context;
  const OPENAI_API_KEY = env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY가 설정되어 있지 않습니다." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { prompt } = await request.json();

    const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return new Response(
        JSON.stringify({ error: `OpenAI API 에러: ${errorText}` }),
        { status: apiResponse.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await apiResponse.json();

    return new Response(
      JSON.stringify({ text: data.choices[0].message.content }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: `서버 오류: ${error.message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
