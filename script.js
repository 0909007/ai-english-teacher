const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

recognition.continuous = true; // 계속 듣기 (브라우저에 따라 다름)
recognition.interimResults = true; // 중간 결과도 보여줌
recognition.lang = 'en-US';

let recognizing = false;

const startButton = document.querySelector('button');
const output = document.getElementById('output'); // 음성 텍스트 출력용 요소 필요 (index.html에 추가해야 함)

function updateButton(status) {
  if (status === 'listening') {
    startButton.style.backgroundColor = '#f44336'; // 빨간색
    startButton.textContent = '🔴 듣는중... 말하세요!';
  } else {
    startButton.style.backgroundColor = '#4caf50'; // 초록색
    startButton.textContent = '🎤 말하기 시작';
  }
}

startButton.addEventListener('click', () => {
  if (recognizing) {
    recognition.stop();
  } else {
    recognition.start();
  }
});

// 음성 인식 시작
recognition.onstart = () => {
  recognizing = true;
  updateButton('listening');
};

// 음성 인식 종료
recognition.onend = () => {
  recognizing = false;
  updateButton('stopped');
};

// 결과 받기
recognition.onresult = (event) => {
  let interimTranscript = '';
  let finalTranscript = '';

  for (let i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      finalTranscript += event.results[i][0].transcript;
    } else {
      interimTranscript += event.results[i][0].transcript;
    }
  }

  output.textContent = finalTranscript + interimTranscript;
};

// 에러 처리
recognition.onerror = (event) => {
  if (event.error === 'aborted') {
    console.log('음성 인식이 사용자가 중단함으로 종료되었습니다.');
  } else if (event.error === 'no-speech') {
    alert('음성이 감지되지 않았어요. 다시 시도해주세요.');
  } else if (event.error === 'not-allowed') {
    alert('마이크 접근이 거부되었습니다. 권한을 허용해주세요.');
  } else {
    console.error('음성 인식 오류:', event.error);
  }
};
