const chatContainer = document.getElementById('chat-container');
const inputField = document.getElementById('input-field');
const sendButton = document.getElementById('send-button');
const voiceButton = document.getElementById('voice-button');
const canvas = document.getElementById('face-canvas');
const ctx = canvas.getContext('2d');

const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;

let teacherImg = new Image();
teacherImg.src = 'teacher.jpg';  // 사진 파일명, index.html과 같은 폴더에 위치해야 함

teacherImg.onload = () => {
  drawFace(0);
};

sendButton.addEventListener('click', () => {
  const text = inputField.value.trim();
  if(text) {
    addMessage('user', text);
    inputField.value = '';
    getGPTResponse(text);
  }
});

inputField.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') sendButton.click();
});

voiceButton.addEventListener('click', () => {
  startSpeechRecognition();
});

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  addMessage('user', transcript);
  getGPTResponse(transcript);
};

function addMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
  messageDiv.textContent = text;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function getGPTResponse(text) {
  addMessage('bot', '...');
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': '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'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{role: 'user', content: text}]
      })
    });
    const data = await response.json();
    const reply = data.choices[0].message.content;
    updateLastBotMessage(reply);
    speak(reply);
  } catch (error) {
    updateLastBotMessage('Error: ' + error.message);
  }
}

function updateLastBotMessage(text) {
  const messages = chatContainer.getElementsByClassName('bot-message');
  if(messages.length) {
    messages[messages.length - 1].textContent = text;
  }
}

let animationId;
let mouthOpen = 0;

function speak(text) {
  if(synth.speaking) {
    synth.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';

  // Web Audio API를 활용해 음성 볼륨 측정
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(new MediaStream());
  let analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  let dataArray = new Uint8Array(analyser.frequencyBinCount);

  // synth 음성 출력 -> 오디오 노드 연결 (workaround)
  // 실제로 synth 음성 출력은 브라우저가 직접 제어해 Web Audio API 접근 불가
  // 그래서 아래는 근사치 애니메이션용 타이머 처리

  utterance.onstart = () => {
    // 단순 타이머 기반 입 애니메이션 시작
    animateMouth();
  };

  utterance.onend = () => {
    cancelAnimationFrame(animationId);
    mouthOpen = 0;
    drawFace(mouthOpen);
    audioCtx.close();
  };

  synth.speak(utterance);

  // 음성 볼륨 직접 측정 불가해 아래 대체 구현
}

function animateMouth() {
  // 실제 음성 볼륨 측정 불가해 sine 함수 대신 랜덤값 섞어 좀 더 자연스러운 움직임 구현
  mouthOpen = 0.3 + 0.7 * Math.abs(Math.sin(Date.now() / 80) + Math.random() * 0.3);
  drawFace(mouthOpen);
  animationId = requestAnimationFrame(animateMouth);
}

function drawFace(mouthRatio) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (teacherImg.complete) {
    ctx.drawImage(teacherImg, 0, 0, canvas.width, canvas.height);
  }

  ctx.fillStyle = 'rgba(150, 0, 0, 0.7)';
  const mouthX = canvas.width / 2;
  const mouthY = canvas.height * 0.75;
  const mouthWidth = 80;
  const mouthHeight = 20 * mouthRatio;
  ctx.beginPath();
  ctx.ellipse(mouthX, mouthY, mouthWidth / 2, mouthHeight / 2, 0, 0, Math.PI * 2);
  ctx.fill();
}

function startSpeechRecognition() {
  recognition.start();
}
