const chatBox = document.getElementById("chatBox");

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = `${sender === 'user' ? 'You' : 'AI'}: ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const apiKey = document.getElementById("apiKey").value.trim();
  const model = document.getElementById("modelSelector").value;
  const userMessage = input.value.trim();

  if (!userMessage || !apiKey) {
    alert("Please enter both a message and API key.");
    return;
  }

  appendMessage("user", userMessage);
  input.value = "";

  const messages = JSON.parse(localStorage.getItem("chatHistory") || "[]");
  messages.push({ role: "user", content: userMessage });

  try {
    console.log("Sending request to OpenRouter...");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://yourgithubusername.github.io",  // optional
        "X-Title": "LLM Chat App",                                // optional
      },
      body: JSON.stringify({
        model: model,
        messages: messages
      }),
    });

    const data = await response.json();
    console.log("Response:", data);

    if (data.choices && data.choices.length > 0) {
      const botReply = data.choices[0].message.content;
      appendMessage("bot", botReply);
      messages.push({ role: "assistant", content: botReply });
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    } else {
      appendMessage("bot", "⚠️ No response received.");
    }

  } catch (error) {
    console.error("Fetch error:", error);
    appendMessage("bot", "⚠️ Error talking to OpenRouter API.");
  }
}

window.onload = () => {
  const messages = JSON.parse(localStorage.getItem("chatHistory") || "[]");
  for (const m of messages) {
    appendMessage(m.role === "user" ? "user" : "bot", m.content);
  }
};function formatBotReply(text) {
  // Split on numbers or bullet points
  const lines = text.split(/(?=\d+\.\s|•\s?)/g);
  return lines.map(l => "• " + l.trim()).join("\n\n");
}

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = (sender === 'bot') ? formatBotReply(text) : `You: ${text}`;
  document.getElementById("chatBox").appendChild(msg);
  document.getElementById("chatBox").scrollTop = chatBox.scrollHeight;
}
function capitalizeBold(text) {
  return text.replace(/\*\*(.*?)\*\*/g, (_, boldText) => {
    const capitalized = boldText
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return `${capitalized}**`;
  });
}

