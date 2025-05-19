const output = document.getElementById("output");

const startRecognition = () => {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    output.innerHTML = `<strong>내 말:</strong> ${transcript}<br><strong>AI 선생님:</strong> ...`;

    try {
      const res = await fetch("/functions/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: transcript })
      });

      const data = await res.json();
      if (data.result) {
        output.innerHTML = `<strong>내 말:</strong> ${transcript}<br><strong>AI 선생님:</strong> ${data.result}`;
      } else {
        output.innerHTML = `<strong>내 말:</strong> ${transcript}<br><strong>AI 선생님:</strong> 오류가 발생했습니다.`;
      }
    } catch (err) {
      output.innerHTML = `<strong>내 말:</strong> ${transcript}<br><strong>AI 선생님:</strong> 서버에 연결할 수 없습니다.`;
    }
  };
};
