const { default: ollama } = require('ollama');

const PROMPT_PREFIX = 'Respond to the following input as succinctly as possible:';

const messages = {};

module.exports = async ({ sessionId, input }) => {
  const model = 'mistral';
  const content = `${PROMPT_PREFIX} ${input}`;

  if (!messages[sessionId]) {
    messages[sessionId] = [];
  }

  messages[sessionId].push({
    role: 'user',
    content
  });

  console.log(`<LLM> :: New prompt (Prompt #${Date.now()}): ${content}.`);

  const response = await ollama.chat({
    model,
    messages: messages[sessionId]
  });

  const reply = response?.message?.content;

  console.log(`<LLM> :: Reply to prompt (Prompt #${Date.now()}): ${reply}.`);

  messages[sessionId].push({
    role: 'assistant',
    content: reply
  });

  return {
    success: Boolean(reply),
    reply
  };
};
