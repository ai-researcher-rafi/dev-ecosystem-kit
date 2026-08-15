const { execSync } = require('child_process');
const { GoogleGenAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Google Gemini Client
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const model = ai ? ai.getGenerativeModel({ model: "gemini-2.5-flash" }) : null;

async function runAIShuttle() {
  console.log("🔍 Scanning local repository for code changes...");

  try {
    // Get git diff (unstaged/staged changes)
    const gitDiff = execSync('git diff HEAD').toString().trim();

    if (!gitDiff) {
      console.log("✨ No code changes detected! Your working tree is perfectly clean.");
      return;
    }

    if (!model) {
      console.log("⚠️ Gemini API key is missing. Using default fallback message.");
      executeGitCommands("feat: update codebase with latest localized changes");
      return;
    }

    console.log("🧠 Analyzing your code changes with Google Gemini AI...");
    
    const prompt = `
      You are an expert software architect. Analyze the following Git Diff and generate a single, professional, brief git commit message (max 10 words). Use standard conventional commits format like (feat:, fix:, chore:, docs:).
      
      Git Diff:
      ${gitDiff.substring(0, 2000)}
      
      Output only the message string, nothing else.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiCommitMessage = response.text().trim().replace(/['"]/g, '');

    console.log(`🤖 AI Generated Message: "${aiCommitMessage}"`);
    executeGitCommands(aiCommitMessage);

  } catch (error) {
    console.error("❌ Shuttle Error:", error.message);
  }
}

function executeGitCommands(message) {
  try {
    console.log("🚀 Staging files (git add .)...");
    execSync('git add .');

    console.log(`💾 Committing changes with AI message...`);
    execSync(`git commit -m "${message}"`);

    console.log("🛰️ Code successfully packed locally! Run 'git push' to broadcast to GitHub.");
  } catch (gitErr) {
    console.error("Git Execution Fail:", gitErr.message);
  }
}

runAIShuttle();
