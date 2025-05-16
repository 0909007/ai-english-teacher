const apiKey = "여기에_너의_DID_API_KEY_넣기";
const imageUrl = "https://raw.githubusercontent.com/0909007/ai-english-teacher/main/teacher.jpg";

async function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = async function(event) {
    const userSpeech = event.results[0][0].transcript;
    console.log("🎧 You said:", userSpeech);

    const gptReply = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 여기에_너의_ChatGPT_API_Key"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a friendly English teacher speaking simply." },
          { role: "user", content: userSpeech }
        ]
      })
    }).then(res => res.json());

    const replyText = gptReply.choices[0].message.content;
    console.log("🧠 GPT:", replyText);

    // D-ID API 호출
    const videoRes = await fetch("https://api.d-id.com/talks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        script: { type: "text", input: replyText, provider: { type: "microsoft", voice_id: "en-US-JennyNeural" } },
        source_url: imageUrl
      })
    }).then(res => res.json());

    const videoId = videoRes.id;

    // 영상 주소 가져오기
    const checkVideo = async () => {
      const status = await fetch(`https://api.d-id.com/talks/${videoId}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      }).then(res => res.json());

      if (status.result_url) {
        document.getElementById("video").src = status.result_url;
      } else {
        setTimeout(checkVideo, 1000);
      }
    };

    checkVideo();
  };
}
