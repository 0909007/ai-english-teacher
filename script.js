const micButton = document.getElementById("micButton");
const outputText = document.getElementById("outputText");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";  // 영어 인식
  recognition.interimResults = false; 
  recognition.continuous = false;

  let listening = false;

  function startListening() {
    recognition.start();
    listening = true;
    micButton.classList.add("listening");
    micButton.textContent = "🎙️ 듣는중...";
  }

  function stopListening() {
    recognition.stop();
    listening = false;
    micButton.classList.remove("listening");
    micButton.textContent = "🎤 마이크";
  }

  micButton.addEventListener("click", () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  });

  recognition.addEventListener("result", (event) => {
    const transcript = event.results[0][0].transcript;
    outputText.textContent = transcript;
  });

  recognition.addEventListener("end", () => {
    if (listening) {
      stopListening();
    }
  });

  recognition.addEventListener("error", (event) => {
    console.error("음성 인식 오류:", event.error);
    stopListening();
  });
}
