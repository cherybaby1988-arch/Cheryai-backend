import { AiProvider } from "./AiProvider";
import { ClaudeProvider } from "./ClaudeProvider";
import { OpenAiProvider } from "./OpenAiProvider";

/**
 * getAiProvider() — retounen enstans AiProvider ki konfigire nan .env
 * (AI_PROVIDER=claude oswa AI_PROVIDER=openai). Defo: "claude".
 *
 * Itilize yon sèl fwa (cache) pou pa rekreye kliyan an chak apèl.
 *
 * KOUMAN CHANJE FOUNISÈ A:
 * Chanje sèlman AI_PROVIDER nan .env — RAN kòd ki rele aiProvider.chat(...)
 * nan lòt fichye yo (chat.routes.ts, create.routes.ts, elt.) rete EGZAKTMAN
 * menm jan an, kèlkeswa founisè a.
 */
let cachedProvider: AiProvider | null = null;

export function getAiProvider(): AiProvider {
  if (cachedProvider) return cachedProvider;

  const providerName = (process.env.AI_PROVIDER || "claude").toLowerCase();

  switch (providerName) {
    case "openai":
    case "chatgpt":
      cachedProvider = new OpenAiProvider();
      break;
    case "claude":
    case "anthropic":
    default:
      cachedProvider = new ClaudeProvider();
      break;
  }

  console.log(`[AI] Founisè AI aktif: ${cachedProvider.name}`);
  return cachedProvider;
}

export type { AiProvider, AiMessage, AiChatOptions } from "./AiProvider";
