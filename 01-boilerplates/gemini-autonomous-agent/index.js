const { executeAutonomousTask } = require('./agent');

// Dummy / Sample heavy task for the autonomous agent to research and build a report
const complexTask = "Analyze the web developer market trends in 2026 and outline 3 critical skills needed to stay relevant.";

(async () => {
  console.log("🚀 Starting Autonomous Agent Pipeline...");
  
  const executionResult = await executeAutonomousTask(complexTask);
  
  console.log("\n🎯 [Final Autonomous Agent Report Received]:");
  console.log("--------------------------------------------------");
  console.log(executionResult);
  console.log("--------------------------------------------------");
  console.log("✅ Agent pipeline successfully executed. Ready for deployment.");
})();
