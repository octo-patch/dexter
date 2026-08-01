import { describe, expect, test } from 'bun:test';
import { getChatModel } from './llm.js';

describe('OpenAI API routing', () => {
  test('uses the Responses API for the GPT-5.6 family', () => {
    const previousApiKey = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = 'test-key';

    try {
      for (const model of ['gpt-5.6-sol', 'gpt-5.6-terra', 'gpt-5.6-luna']) {
        const llm = getChatModel(model) as { useResponsesApi?: boolean };
        expect(llm.useResponsesApi).toBe(true);
      }
    } finally {
      if (previousApiKey === undefined) {
        delete process.env.OPENAI_API_KEY;
      } else {
        process.env.OPENAI_API_KEY = previousApiKey;
      }
    }
  });
});

describe('MiniMax API routing', () => {
  test('uses the configured OpenAI-compatible endpoint', () => {
    const previousApiKey = process.env.MINIMAX_API_KEY;
    const previousBaseUrl = process.env.MINIMAX_BASE_URL;
    process.env.MINIMAX_API_KEY = 'test-key';
    process.env.MINIMAX_BASE_URL = 'https://api.minimaxi.com/v1';

    try {
      const llm = getChatModel('minimax:MiniMax-M3') as {
        clientConfig?: { baseURL?: string };
        model?: string;
        modelName?: string;
      };

      expect(llm.clientConfig?.baseURL).toBe('https://api.minimaxi.com/v1');
      expect(llm.model ?? llm.modelName).toBe('MiniMax-M3');
    } finally {
      if (previousApiKey === undefined) {
        delete process.env.MINIMAX_API_KEY;
      } else {
        process.env.MINIMAX_API_KEY = previousApiKey;
      }

      if (previousBaseUrl === undefined) {
        delete process.env.MINIMAX_BASE_URL;
      } else {
        process.env.MINIMAX_BASE_URL = previousBaseUrl;
      }
    }
  });
});
