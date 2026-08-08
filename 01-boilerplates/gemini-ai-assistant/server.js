const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenAI } = require('@google/generative-ai');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Gemini AI (Falls back to env or empty string to prevent crashes)
const apiKey = process.env.GEMINI_API_KEY || "";
let aiModel = null;

if (apiKey) {
  const ai = new GoogleGenAI({ apiKey });
  // Using gemini-2.5-flash as the default performance/speed model for 2026
  aiModel = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
}

// Base Route
app.get('/', (req, res) => {
  res.json({ message: '🤖 Google Gemini AI Chat Assistant Server is live and ready!' });
});

// Advanced AI Chat Stream/Response Route
app.post('/api/ai/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Please provide a valid prompt or message!' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      error: 'Gemini API Key is missing! Please setup your .env file with GEMINI_API_KEY.' 
    });
  }

  try {
    // Generate content using Gemini AI
    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    const aiTextResponse = response.text();

    res.json({
      success: true,
      prompt: prompt,
      reply: aiTextResponse
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate response from Google Gemini AI.',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AI Server ignited and blasting off on port ${PORT} 🚀`));
