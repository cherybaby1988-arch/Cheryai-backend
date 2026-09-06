/**
 * AiProvider — kontra kominAI pou nenpòt founisè modèl lang (Claude, ChatGPT, elt.)
 *
 * Rezon pou entèfas sa a egziste: rès kòd backend la (chat, kreye tèks, tradiksyon,
 * plan biznis) pa dwe konnen si l ap pale ak Claude oswa ChatGPT. Li rele
 * `aiProvider.chat(...)` epi li resevwa yon repons — chanjman founisè a se
 * SÈLMAN yon varyab anviwònman (`AI_PROVIDER=claude` oswa `AI_PROVIDER=openai`),
 * pa yon rekonstriksyon kòd.
 */

export interface AiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AiChatOptions {
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AiProvider {
  /** Non founisè a (itilize pou logging/deboge — ex: "claude", "openai") */
  readonly name: string;

  /** Voye yon konvèsasyon epi resevwa repons AI a kòm tèks. */
  chat(messages: AiMessage[], options?: AiChatOptions): Promise<string>;
}
