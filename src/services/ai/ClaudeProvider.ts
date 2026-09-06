import { AiProvider, AiMessage, AiChatOptions } from "./AiProvider";

/**
 * ClaudeProvider — rele API Anthropic Claude dirèkteman (/v1/messages).
 * Mande ANTHROPIC_API_KEY nan .env.
 */
export class ClaudeProvider implements AiProvider {
  readonly name = "claude";

  private apiKey: string;
  private model: string;

  constructor() {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new Error("ANTHROPIC_API_KEY pa konfigire nan .env — kopye .env.example epi ajoute kle a");
    }
    this.apiKey = key;
    this.model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
  }

  async chat(messages: AiMessage[], options: AiChatOptions = {}): Promise<string> {
    // Claude separe "system" ak rès konvèsasyon an — filtre mesaj system yo
    const systemMessages = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
    const systemPrompt = options.systemPrompt || systemMessages || undefined;
    const conversationMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role, content: m.content }));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: options.maxTokens ?? 1024,
        system: systemPrompt,
        messages: conversationMessages,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Claude API erè (${response.status}): ${errBody}`);
    }

    const data = (await response.json()) as {
      content: Array<{ type: string; text?: string }>;
    };

    const textBlock = data.content.find((block) => block.type === "text");
    return textBlock?.text ?? "";
  }
}
