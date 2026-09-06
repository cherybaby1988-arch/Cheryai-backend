import { AiProvider, AiMessage, AiChatOptions } from "./AiProvider";

/**
 * OpenAiProvider — rele API OpenAI (ChatGPT, /v1/chat/completions).
 * Mande OPENAI_API_KEY nan .env.
 */
export class OpenAiProvider implements AiProvider {
  readonly name = "openai";

  private apiKey: string;
  private model: string;

  constructor() {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error("OPENAI_API_KEY pa konfigire nan .env — kopye .env.example epi ajoute kle a");
    }
    this.apiKey = key;
    this.model = process.env.OPENAI_MODEL || "gpt-4o";
  }

  async chat(messages: AiMessage[], options: AiChatOptions = {}): Promise<string> {
    const chatMessages = [...messages];
    if (options.systemPrompt) {
      chatMessages.unshift({ role: "system", content: options.systemPrompt });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: options.maxTokens ?? 1024,
        temperature: options.temperature ?? 0.7,
        messages: chatMessages,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`OpenAI API erè (${response.status}): ${errBody}`);
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    return data.choices[0]?.message?.content ?? "";
  }
}
