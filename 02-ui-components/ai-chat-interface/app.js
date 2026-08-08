// Premium Frontend Chat Mechanism and Event Listeners
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const messageText = userInput.value.trim();
  if (!messageText) return;

  // 1. Render User Message on the Screen instantly
  appendMessage(messageText, 'user');
  userInput.value = '';

  // 2. Render Temporary Mock AI Thinking Loader
  const loaderId = appendMessage('🧠 System calculating response from backend database...', 'ai-loader');

  // 3. Simulate backend API processing delay and return dynamic response
  setTimeout(() => {
    // Remove the temporary thinking loader
    document.getElementById(loaderId)?.remove();
    
    // Append the dynamic expert template reply
    appendMessage(`[Received from http://localhost:5000/api/ai/chat]: This frontend dashboard is successfully connected and fully ready to stream real-time data from your Google Gemini server boilerplate code!`, 'ai');
  }, 1200);
});

// Helper function to dynamically construct and append UI bubble blocks
function appendMessage(text, type) {
  const messageWrapper = document.createElement('div');
  const uniqueId = 'msg-' + Date.now();
  messageWrapper.id = uniqueId;
  
  if (type === 'user') {
    messageWrapper.className = 'flex gap-3 max-w-[80%] ml-auto justify-end';
    messageWrapper.innerHTML = `
      <div class="bg-blue-600 p-4 rounded-2xl rounded-tr-none text-white shadow-md shadow-blue-600/5">
        ${text}
      </div>
    `;
  } else {
    const isLoader = type === 'ai-loader';
    messageWrapper.className = 'flex gap-3 max-w-[80%]';
    messageWrapper.innerHTML = `
      <div class="w-8 h-8 rounded-lg ${isLoader ? 'bg-amber-600 animate-spin' : 'bg-blue-600'} flex items-center justify-center font-bold text-xs shrink-0">AI</div>
      <div class="${isLoader ? 'bg-slate-900 border border-slate-800 text-amber-500' : 'bg-slate-800 text-slate-200'} p-4 rounded-2xl rounded-tl-none">
        ${text}
      </div>
    `;
  }

  chatBox.appendChild(messageWrapper);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest updates
  return uniqueId;
}
