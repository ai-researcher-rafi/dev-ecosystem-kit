const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Google Gemini AI Engine
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const model = ai ? ai.getGenerativeModel({ model: "gemini-2.5-flash" }) : null;

// Target URL to scrape and analyze (Developers can change this URL dynamically)
const targetUrl = 'https://ycombinator.com'; 

async function startContextScraper() {
  console.log(`📡 [Scraper Active] Launching autonomous extraction request to: ${targetUrl}`);

  try {
    // Step 1: Fetch pure HTML data from the website using Axios
    const { data } = await axios.get(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });

    // Step 2: Parse HTML text using Cheerio to extract relevant raw context strings
    const $ = cheerio.load(data);
    let pageRawText = '';
    
    // Extracting all headers and paragraph contexts to feed the AI brain
    $('h1, h2, h3, p, .titleline').each((index, element) => {
      if (index < 50) { // Limit chunks to stay within optimal tokens
        pageRawText += $(element).text().trim() + '\n';
      }
    });

    if (!pageRawText) {
      console.log("❌ Extraction failed or website returned empty selector strings.");
      return;
    }

    console.log(`📦 Successfully extracted ${pageRawText.split('\n').length} lines of raw text data.`);

    if (!model) {
      console.log("⚠️ Gemini API Key missing! Outputting raw scraped context data only:\n", pageRawText.substring(0, 500));
      return;
    }

    // Step 3: Initialize Gemini AI Agent to run contextual and analytical analysis
    console.log("🧠 Transmitting text intelligence to Google Gemini for deep automated analysis...");

    const agentPrompt = `
      You are an Advanced Autonomous Web Scraper and Semantic Data Analyst.
      Analyze the raw text scraped from the website (${targetUrl}) and generate a structured executive report.
      
      Your Report Must Include:
      1. Main Core Theme of the website.
      2. Top 3 most critical news, topics, or insights discovered on the page.
      3. A summary of the semantic context and market/user impact.
      
      Raw Scraped Data:
      ${pageRawText}
    `;

    const result = await model.generateContent(agentPrompt);
    const response = await result.response;
    const finalExecutiveReport = response.text();

    console.log("\n🎯 [Autonomous Context Report Successfully Formatted]:");
    console.log("======================================================================");
    console.log(finalExecutiveReport);
    console.log("======================================================================");
    console.log("✅ Execution loop finalized successfully.");

  } catch (error) {
    console.error("❌ Agent Engine Failure:", error.message);
  }
}

startContextScraper();
