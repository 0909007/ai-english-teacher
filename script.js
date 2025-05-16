window.onload = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';  // 영어 인식
  recognition.interimResults = false;  // 중간 결과 미사용
  recognition.continuous = true;       // 계속 인식 모드

  recognition.onresult = event => {
    const last = event.results.length - 1;
    const text = event.results[last][0].transcript.trim();
    console.log('사용자 음성 인식:', text);
    document.getElementById('userText').innerText = `너가 말한 문장: ${text}`;
    // TODO: GPT API 호출 넣기
  };

  recognition.onerror = event => {
    console.error('음성 인식 에러:', event.error);
  };

  recognition.start();
};
