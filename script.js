const startBtn = document.getElementById("startBtn");
const output = document.getElementById("output");

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let isListening = false;

startBtn.addEventListener("click", () => {
  if (!isListening) {
    recognition.start();
  }
});

recognition.onstart = () => {
  isListening = true;
  startBtn.classList.add("listening");
  startBtn.textContent = "🎤 듣는 중...";
};

recognition.onend = () => {
  isListening = false;
  startBtn.classList.remove("listening");
  startBtn.textContent = "말하기 시작";
};

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  output.innerText = "🧑‍🎤 나: " + transcript;

  const reply = await getChatGPTResponse(transcript);
  setTimeout(() => {
    output.innerText += "\n🤖 선생님: " + reply;
  }, 500);
};

async function getChatGPTResponse(text) {
  const res = await fetch("/functions/gpt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const data = await res.json();
  return data.reply;
}
