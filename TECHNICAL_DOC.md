# TECHNICAL_DOC — CHERY AI Backend

## 1. AI Gateway — kijan chanjman founisè fonksyone

Backend la pa "kole" ak Claude oswa ChatGPT — li pale ak yon **entèfas jenerik** (`AiProvider`):

```
src/services/ai/
├── AiProvider.ts       ← kontra (chat(), name)
├── ClaudeProvider.ts   ← enplemantasyon Anthropic
├── OpenAiProvider.ts   ← enplemantasyon OpenAI
└── index.ts            ← faktori: getAiProvider() li AI_PROVIDER nan .env
```

Nenpòt wout (chat, create/text, translate, business/plan) rele:
```ts
const aiProvider = getAiProvider();
const reply = await aiProvider.chat(messages, { systemPrompt });
```

Pou **swiche ant Claude ak ChatGPT**, chanje sèlman `AI_PROVIDER=claude` oswa
`AI_PROVIDER=openai` nan `.env` — okenn kòd pa chanje.

**Ajoute yon 3yèm founisè pita** (ex: Mistral, Gemini): kreye yon nouvo klas ki
enplemante `AiProvider` (yon sèl fonksyon `chat()` pou ekri), ajoute l nan switch
`index.ts`. Rès aplikasyon an pa afekte.

## 2. Sekirite kle API — chemen konplè

```
App Android                Backend                    Founisè AI
     │                         │                            │
     │  POST /chat/message     │                            │
     │  Authorization: Bearer  │                            │
     │  <JWT itilizatè>        │                            │
     ├────────────────────────▶│                            │
     │                         │  Li ANTHROPIC_API_KEY nan   │
     │                         │  varyab anviwònman SÈVÈ a   │
     │                         │  (janm nan repo/app)        │
     │                         ├───────────────────────────▶│
     │                         │◀───────────────────────────┤
     │◀────────────────────────┤                            │
     │  { reply: "..." }       │                            │
```

App Android la pa janm wè ni manipile kle Claude/OpenAI a. Menm si yon moun
dekonpile APK a, pa gen okenn kle AI ladan — sèlman `API_BASE_URL` pwòp backend la.

## 3. Otantifikasyon ak Sesyon

- **JWT** siyen ak `JWT_SECRET`, ekspire apre `JWT_EXPIRES_IN` (defo 30 jou)
- Payload token: `{ userId, email }` — ase pou idantifye itilizatè a san reponn
  nan chak apèl a baz done a pou chak verifikasyon
- `authMiddleware` verifye header `Authorization: Bearer <token>` sou chak wout
  pwoteje — koresponn egzakteman ak sa `AuthInterceptor.kt` (Android) voye otomatikman
- **Modpas** chifre ak `bcryptjs` (10 wonn salting) — janm estoke an klè
- **Google Sign-In**: `googleAuth.service.ts` verifye `idToken` ak Google Cloud
  (`google-auth-library`), kreye/jwenn itilizatè a, retounen menm fòma JWT ak login klasik

## 4. Baz Done — rezime relasyon

```
User ──┬── Conversation ── Message[]
       ├── GeneratedImage[]
       ├── GeneratedVideo[]
       ├── UserProgress[] ── Course ── Lesson[]
       └── Subscription[]

BusinessTool (endepandan, pa gen relasyon ak User — zouti jeneral)
```

Chwa Prisma (olye SQL manyèl oswa Sequelize): migrasyon otomatik ki swiv chanjman
`schema.prisma`, tip TypeScript jenere otomatikman (menm avantaj tip sekirite ak
Kotlin sou app Android la), ak yon sentaks lizib pou rekèt konplèks (`include`, `where`).

## 5. Validasyon Done

Chak wout ki resevwa done itilizatè (`req.body`) itilize **Zod** (`schema.safeParse`)
anvan nenpòt lojik biznis egzekite. Sa anpeche:
- Done manke oswa move tip rive nan baz done a
- Erè kraze sèvè a san jesyon (Zod retounen yon erè 400 klè olye yon eksepsyon)

## 6. Rate Limiting — estrateji 3 nivo

| Middleware | Rezon |
|---|---|
| `globalRateLimiter` | Premye liy defans kont bonbadman jeneral |
| `authRateLimiter` | Anpeche "brute-force" sou modpas (login/register) |
| `aiRateLimiter` | Pwoteje kont kredi AI (chak apèl Claude/OpenAI koute lajan) |

## 7. Sipò Miltiling (Kreyòl, Franse, Angle, Espayòl)

- **Chat AI**: `CHAT_SYSTEM_PROMPT` enstwi modèl la reponn nan Kreyòl pa defo,
  men swiv lang itilizatè a si li ekri nan yon lòt lang — Claude/ChatGPT rekonèt
  lang otomatikman san parametrè siplemantè
- **Tradiksyon**: `/translate` itilize modèl lang lan kòm motè tradiksyon (pito pase
  yon API "tradisyonèl" tankou Google Translate) paske modèl lang modèn yo jere
  Kreyòl Ayisyen pi byen — `languageNames` mapping nan `translate.routes.ts`
- **Pou ajoute yon lang**: ajoute l nan `languageNames` (`translate.routes.ts`) ak
  nan `supportedLanguages` (Android `TranslateViewModel.kt`)

## 8. Pwochèn Etap Achitekti (pou grandi kòm platfòm entènasyonal)

- **Cache repons AI** (Redis) pou pwenpt repete souvan (ex: kesyon Akademi kominman poze)
- **File d'attente** (BullMQ/Redis) pou jenerasyon videyo — olye HTTP senkwòn ki blòk
- **CDN** pou imaj/videyo jenere (Cloudflare R2, AWS S3 + CloudFront)
- **Observability**: Sentry pou erè, logs strikti (Pino/Winston) pou pwodiksyon
- **Multi-région**: lè itilizatè entènasyonal ogmante, konsidere deplwaye backend
  la pi pre yo (ex: US-East pou dyaspora, région Ewopeyen pou Frans)

## 9. Estati Fonksyonalite (verite kounye a)

| Sèvis | Estati |
|---|---|
| Enskripsyon/Koneksyon | ✅ Fonksyonèl (mande DATABASE_URL + JWT_SECRET) |
| Google Sign-In | ✅ Kòd pare, mande GOOGLE_CLIENT_ID pou aktive |
| Chat AI | ✅ Fonksyonèl (mande ANTHROPIC_API_KEY oswa OPENAI_API_KEY) |
| Kreye Tèks | ✅ Fonksyonèl |
| Tradiksyon | ✅ Fonksyonèl |
| Plan Biznis | ✅ Fonksyonèl |
| Akademi (lis kou/pwogrè) | ✅ Fonksyonèl (done demarraj via `npm run seed`) |
| Imaj AI | 🚧 Estrikti pare, mande kle founisè imaj (OpenAI DALL-E/Stability) |
| Videyo AI | 🚧 Estrikti pare (jobId + polling), mande founisè videyo |
| Vwa AI (TTS/STT) | 🚧 Estrikti pare, mande ElevenLabs/Whisper |
