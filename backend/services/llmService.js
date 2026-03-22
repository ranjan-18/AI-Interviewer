const { OpenAI } = require('openai');
require('dotenv').config();

class LLMService {
  constructor() {
    this.baseUrl = process.env.GITHUB_MODELS_BASE_URL || 'https://models.inference.ai.azure.com';
    this.defaultModel = process.env.MODEL_NAME || 'gpt-4o';
  }

  _getApiClient(apiKey) {
    return new OpenAI({
      baseURL: this.baseUrl,
      apiKey: apiKey
    });
  }

  async generateCompletion(prompt, systemPrompt = "", model = this.defaultModel) {
    const keyString = process.env.API_KEYS_LIST || process.env.GITHUB_MODELS_API_KEY;
    const keys = keyString ? keyString.split(',').map(k => k.trim()).filter(k => k) : [];
    
    if (keys.length === 0) {
      throw new Error("No API keys provided in environment variables.");
    }
    
    const shuffledKeys = keys.sort(() => 0.5 - Math.random());
    
    let lastError = null;
    
    for (const key of shuffledKeys) {
      try {
        const client = this._getApiClient(key);
        const response = await client.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          model: model,
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 1
        });
        return response.choices[0].message.content;
      } catch (error) {
        lastError = error;
        console.warn(`Token failed. Trying another...`);
      }
    }
    
    console.error(`All tokens failed. Last error: ${lastError.message}`);
    return `Error: All tokens in the rotation pool failed. Last error: ${lastError.message}`;
  }

  async generateJson(prompt, systemPrompt, model = this.defaultModel) {
    try {
      const responseText = await this.generateCompletion(prompt, systemPrompt, model);
      if (responseText.startsWith("Error:")) {
        return { error: responseText };
      }
      const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error(`Error generating JSON: ${error.message}`);
      return { error: "Invalid JSON response from LLM", raw_response: error.message };
    }
  }
}

module.exports = new LLMService();
