const output = document.getElementById('output');
const response = document.getElementById('response');

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    output.textContent = transcript;

    // GPT API에 텍스트 보내기
    try {
      const res = await fetch('/functions/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: transcript }),
      });

      const data = await res.json();
      response.textContent = data.reply || '답변을 받지 못했습니다.';
    } catch (error) {
      response.textContent = '서버와 통신 중 오류가 발생했습니다.';
      console.error(error);
    }
  };

  recognition.onerror = (event) => {
    output.textContent = '음성 인식 중 오류: ' + event.error;
  };
}
