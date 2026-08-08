const { GoogleGenAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const model = ai ? ai.getGenerativeModel({ model: "gemini-2.5-flash" }) : null;

/**
 * Advanced Autonomous Agent execution loop
 * It breaks a complex task into multiple logical steps automatically.
 */
async function executeAutonomousTask(userGoal) {
  if (!model) {
    return "Error: Gemini API key is missing. Update your environment variables.";
  }

  console.log(`\n🤖 [Agent initialized] Target Goal: "${userGoal}"`);
  
  // Base instructions to give the model agentic reasoning capabilities
  const systemInstruction = `
    You are an Autonomous AI Agent. Your goal is to break the user task into 3 execution steps.
    Analyze the user request, plan the path, and generate a final structured analytical report.
    Format your output using strict Markdown.
  `;

  try {
    console.log("🧠 Thinking and planning execution steps...");
    const prompt = `${systemInstruction}\n\nUser Task: ${userGoal}\nExecute and provide the finalized system execution log and answer.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("❌ Agent Loop Error:", error.message);
    return `Failed to execute agent loop: ${error.message}`;
  }
}

module.exports = { executeAutonomousTask };
