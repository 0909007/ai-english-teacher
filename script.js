const micButton = document.getElementById('micButton');
const output = document.getElementById('output');
const response = document.getElementById('response');

// 음성 인식 객체 생성 (크롬 기준)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;

recognition.onstart = () => {
  micButton.classList.add('listening');
  micButton.textContent = '🔴 듣는 중...';
};

recognition.onend = () => {
  micButton.classList.remove('listening');
  micButton.textContent = '🎤 말하기 시작';
};

recognition.onerror = (event) => {
  micButton.classList.remove('listening');
  micButton.textContent = '🎤 말하기 시작';
  output.textContent = '에러 발생: ' + event.error;
};

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  output.textContent = '당신: ' + transcript;

  // 여기에 OpenAI API 호출하는 부분 넣기 (예시)
  // 예) const reply = await askOpenAI(transcript);
  // response.textContent = 'AI: ' + reply;
};

function startListening() {
  recognition.start();
}
