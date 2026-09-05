# CHERY AI Assistant — Backend API

Aprann • Kreye • Travay • Inove

Backend pwodiksyon-pare pou CHERY AI Assistant — Node.js + TypeScript + Express + PostgreSQL (Prisma).

---

## 🎯 Poukisa Node.js/TypeScript olye FastAPI (Python)

| Kritè | Node.js/TypeScript (chwa nou) | FastAPI (Python) |
|---|---|---|
| Kowerans ak ekosistèm | Menm langaj konsèp (TypeScript) tou pre Kotlin Android la — pi fasil pou yon sèl ekip swiv toude | Langaj diferan, mande chanje "kontèks mantal" |
| Async I/O pou apèl AI | Node.js fèt pou I/O konkouran (apèl API AI yo se sitou tann rezo) — modèl evènman an natif | FastAPI ak async/await bon tou, men mwens matirite pou anpil ka itilizasyon konkouran an gwo echèl |
| Ekosistèm librairi | npm gen anpil SDK pou founisè AI (Anthropic, OpenAI, elt.), Prisma se yon ORM mòdèn ak migrasyon otomatik | Python gen bon SDK AI tou, men Prisma-ekivalan (SQLAlchemy) mande plis konfigirasyon manyèl |
| Deplwaman senp | Railway/Render/Vercel gen sipò Node.js "zero-config" trè solid | Sipò FastAPI byen tou, men souvan mande Dockerfile manyèl |
| Tip sekirite (TypeScript) | Erè detekte a konpilasyon, DTOs pataje ak konsèp Kotlin Android la fasil | Python type hints la pi fèb pase TypeScript strict mode |

**Konklizyon:** Toude chwa yo valab pou yon pwodiksyon reyèl. Nou chwazi Node.js/TypeScript prensipalman pou **kowerans langaj ak achitekti** ak rès pwojè a (Kotlin Android + potansyèl React/Next.js pou yon vèsyon Web pita), ak matirite Prisma pou jesyon migrasyon baz done.

## 🏗️ Achitekti Jeneral

```
Android App (Kotlin/Compose)
        │  HTTPS + Bearer Token
        ▼
┌─────────────────────────────────┐
│     CHERY AI Backend (Node.js)  │
│  ┌────────────────────────────┐ │
│  │  Express Routes            │ │──▶ PostgreSQL (Prisma)
│  │  (auth, chat, create, ...) │ │
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │  AI Gateway (AiProvider)    │ │──▶ Claude API (Anthropic)
│  │  Claude ⇄ ChatGPT           │ │──▶ ChatGPT API (OpenAI)
│  └────────────────────────────┘ │
└─────────────────────────────────┘
```

Kle API yo (Claude, OpenAI, elt.) rete SÈLMAN sou backend la, nan varyab anviwònman sèvè a — yo pa janm rive nan app Android la.

## 📁 Estrikti Pwojè

```
CHERY-AI-Backend/
├── src/
│   ├── index.ts                 ← pwen antre, konfigirasyon Express
│   ├── config/
│   │   └── prisma.ts            ← kliyan Prisma pataje
│   ├── middleware/
│   │   ├── auth.middleware.ts   ← verifikasyon token JWT
│   │   ├── rateLimiter.ts       ← limit rekèt (jeneral, auth, AI)
│   │   └── errorHandler.ts      ← jesyon erè global
│   ├── routes/
│   │   ├── auth.routes.ts       ← enskripsyon/koneksyon/Google/modpas bliye
│   │   ├── user.routes.ts       ← pwofil itilizatè
│   │   ├── chat.routes.ts       ← Chat AI (konekte ak AI Gateway)
│   │   ├── create.routes.ts     ← Kreye Tèks/Imaj/Videyo
│   │   ├── voice.routes.ts      ← Vwa AI (TTS/STT)
│   │   ├── translate.routes.ts  ← Tradiksyon (4 lang)
│   │   ├── academy.routes.ts    ← Akademi CHERY
│   │   └── business.routes.ts   ← Biznis & Inovasyon
│   ├── services/
│   │   ├── ai/                  ← AI GATEWAY (gade TECHNICAL_DOC.md)
│   │   │   ├── AiProvider.ts    ← entèfas jenerik
│   │   │   ├── ClaudeProvider.ts
│   │   │   ├── OpenAiProvider.ts
│   │   │   └── index.ts         ← faktori (chwazi selon .env)
│   │   └── googleAuth.service.ts
│   └── utils/
│       └── jwt.ts
├── prisma/
│   ├── schema.prisma             ← modèl baz done konplè
│   └── seed.ts                   ← done demarraj (kou, zouti biznis)
├── .env.example                  ← modèl varyab anviwònman
├── package.json
├── tsconfig.json
├── TECHNICAL_DOC.md
└── API_DOCUMENTATION.md
```

## 🛠️ Enstalasyon Lokal

**Prerekizi:** Node.js 20+, PostgreSQL (lokal oswa cloud), npm

```bash
# 1. Antre nan dosye a
cd CHERY-AI-Backend

# 2. Enstale depandans yo
npm install

# 3. Kreye fichye .env epi ranpli valè yo
cp .env.example .env
# Louvri .env, ajoute omwen: DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY (oswa OPENAI_API_KEY)

# 4. Kreye tab yo nan baz done a
npx prisma migrate dev --name init

# 5. Popile done demarraj (kou Akademi, zouti biznis)
npm run seed

# 6. Lanse sèvè an mòd devlopman (rechaje otomatik)
npm run dev
```

Sèvè a ap disponib sou `http://localhost:3000`. Tcheke `GET /health` pou konfime li ap fonksyone.

## 🚀 Deplwaman Pwodiksyon (rekòmandasyon: Railway oswa Render)

1. Push kòd la sou yon repo GitHub (**san** `.env` — `.gitignore` deja pwoteje l)
2. Sou Railway/Render, kreye yon nouvo pwojè ki konekte ak repo a
3. Ajoute yon baz done PostgreSQL (yo ofri sa entegre — `DATABASE_URL` konfigire otomatikman)
4. Ajoute varyab anviwònman yo nan panèl la (menm lis ak `.env.example`)
5. Konfigire "Build Command": `npm install && npx prisma generate && npm run build`
6. Konfigire "Start Command": `npx prisma migrate deploy && npm start`
7. Deplwaye — ou ap resevwa yon URL tankou `https://cheryai-backend.up.railway.app`

## 📱 Konekte Backend la ak Aplikasyon Android la

1. Kopye URL backend ou (lokal oswa deplwaye) — ex: `https://cheryai-backend.up.railway.app/`
2. Nan pwojè Android la, kreye/modifye fichye `local.properties` (rasin pwojè a):
   ```
   API_BASE_URL=https://cheryai-backend.up.railway.app/
   ```
   ⚠️ URL la DWE fini ak yon `/` (Retrofit mande sa pou baseUrl)
3. **Si w ap teste ak yon emulateur Android sou menm òdinatè a** epi backend la ap tounen lokalman
   (`npm run dev` sou `localhost:3000`), itilize `http://10.0.2.2:3000/` olye `localhost` —
   `10.0.2.2` se jan emulateur Android la wè "localhost" òdinatè ou.
   - **Enpòtan:** `network_security_config.xml` nan app Android la bloke HTTP san chifreman.
     Pou tès lokal sèlman, ou ka ajoute yon eksepsyon tanporè pou `10.0.2.2` nan
     `network_security_config.xml` (domain-config ak `cleartextTrafficPermitted="true"`
     sèlman pou domain sa a) — pa janm fè sa an pwodiksyon.
4. Nan Android Studio, Sync Gradle ankò pou `BuildConfig.API_BASE_URL` mete ajou
5. Kreye yon kont tès (Register) nan app la, epi tcheke Chat AI — si Claude/ChatGPT
   reponn, koneksyon an ap fonksyone

## 📄 Lòt Dokiman

- `TECHNICAL_DOC.md` — achitekti detaye, AI Gateway, sekirite
- `API_DOCUMENTATION.md` — tout endpoint yo ak egzanp rekèt/repons
