const output = document.getElementById("output");

const startRecognition = () => {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    output.innerHTML = `내 말: ${transcript}\nAI 선생님: ...`;

    try {
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: transcript })
      });

      const data = await res.json();
      output.innerHTML = `내 말: ${transcript}\nAI 선생님: ${data.result || "응답을 받지 못했어요."}`;
    } catch (err) {
      output.innerHTML = `내 말: ${transcript}\nAI 선생님: 네트워크 오류 또는 서버에 연결할 수 없습니다.`;
    }
  };
};
