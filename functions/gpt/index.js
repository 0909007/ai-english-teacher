<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>AI 영어 선생님</title>
  <style>
    body {
      font-family: sans-serif;
      text-align: center;
      padding: 2rem;
      background: #f5f5f5;
    }
    #micButton {
      padding: 1rem;
      font-size: 1.2rem;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    #micButton.listening {
      background: #f44336;
    }
    #output, #response {
      margin-top: 1rem;
      font-size: 1.1rem;
      min-height: 2rem;
    }
  </style>
</head>
<body>
  <h1>👩‍🏫 AI 영어 선생님</h1>
  <p>마이크에 대고 말해보세요!</p>

  <button id="micButton" onclick="startListening()">🎤 말하기 시작</button>

  <div id="output"></div>
  <div id="response"></div>

  <script src="script.js"></script>
</body>
</html>
