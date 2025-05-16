// main.js

const chatContainer = document.getElementById('chat-container');
const inputField = document.getElementById('input-field');
const sendButton = document.getElementById('send-button');

const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;

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
        'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
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

function speak(text) {
  if(synth.speaking) {
    synth.cancel();
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  synth.speak(utterance);
}

function startSpeechRecognition() {
  recognition.start();
}

// 입모양 싱크, 애니메이션 등은 추가 구현 필요

