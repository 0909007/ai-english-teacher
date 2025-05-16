const micButton = document.getElementById('micButton');
const output = document.getElementById('output');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.continuous = false;  // 핸드폰에서 continuous는 문제될 수 있음

  let recognizing = false;

  micButton.addEventListener('click', () => {
    if (recognizing) {
      recognition.stop();
      return;
    }
    recognition.start();
  });

  recognition.onstart = () => {
    recognizing = true;
    micButton.textContent = '🎙️ 듣는중...';
    micButton.style.backgroundColor = '#e53935'; // 빨간색으로
    console.log('음성 인식 시작');
  };

  recognition.onend = () => {
    recognizing = false;
    micButton.textContent = '🎤 말하기 시작';
    micButton.style.backgroundColor = '#4caf50'; // 초록색으로
    console.log('음성 인식 종료');
  };

  recognition.onerror = (event) => {
    console.error('음성 인식 오류:', event.error);
    // aborted 오류는 무시하거나 인식 재시작 가능
    if (event.error === 'aborted') {
      micButton.textContent = '🎤 말하기 시작';
      micButton.style.backgroundColor = '#4caf50';
      recognizing = false;
    }
  };

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    output.textContent = transcript;
    console.log('인식 결과:', transcript);
  };
}
