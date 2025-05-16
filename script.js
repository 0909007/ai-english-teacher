// 음성 인식 설정
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.continuous = false;

const resultDiv = document.getElementById("result");
const micButton = document.getElementById("micButton");

let listening = false;

micButton.addEventListener("click", () => {
  if (!listening) {
    recognition.start();
  } else {
    recognition.stop();
  }
});

// 음성 인식 시작
recognition.onstart = () => {
  listening = true;
  micButton.style.backgroundColor = "#4caf50"; // 녹색으로 바꿈
  micButton.textContent = "듣는 중...";
};

// 음성 인식 종료
recognition.onend = () => {
  listening = false;
  micButton.style.backgroundColor = ""; // 원래색으로
  micButton.textContent = "🎤 말하기 시작";
};

// 음성 인식 결과 받기
recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  resultDiv.textContent = "내 말: " + transcript;

  // GPT에 메시지 보내기 (system 역할 포함)
  const messages = [
    { role: "system", content: "You are a helpful AI English teacher." },
    { role: "user", content: transcript },
  ];

  const reply = await fetchGPTResponse(messages);
  resultDiv.textContent += "\nAI 선생님: " + reply;
};

// GPT API 호출 함수
async function fetchGPTResponse(messages) {
  try {
    const response = await fetch("/functions/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("GPT API error:", error);
      return "오류 발생: " + error.error;
    }

    const data = await response.json();
    return data.content;
  } catch (e) {
    console.error("Fetch error:", e);
    return "네트워크 오류 또는 서버에 연결할 수 없습니다.";
  }
}
