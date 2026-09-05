# API Documentation — CHERY AI Assistant Backend

Baz URL: `https://<ou-domèn>/` (lokal: `http://localhost:3000/`)

Otantifikasyon: pifò wout yo mande header `Authorization: Bearer <token>`.
Token la resevwa apre `/auth/login`, `/auth/register`, oswa `/auth/google`.

Fòma repons erè estanda:
```json
{ "success": false, "message": "Deskripsyon erè a an Kreyòl" }
```

---

## 🔐 Otantifikasyon (`/auth`)

### `POST /auth/register`
**Bezwen otantifikasyon:** Non

| Chan | Tip | Obligatwa |
|---|---|---|
| name | string | wi |
| email | string | wi |
| password | string (min 8 karaktè) | wi |

```json
// Rekèt
{ "name": "Jean Batiste", "email": "jean@example.com", "password": "modpas12345" }

// Repons 201
{ "token": "eyJhbGc...", "user": { "id": "uuid", "name": "Jean Batiste", "email": "jean@example.com", "plan": "FREE" } }
```

### `POST /auth/login`
```json
// Rekèt
{ "email": "jean@example.com", "password": "modpas12345" }
// Repons 200 — menm fòma ak register
```

### `POST /auth/forgot-password`
```json
{ "email": "jean@example.com" }
// Repons 200
{ "success": true, "message": "Si yon kont egziste ak imèl sa a, yon lyen pou reyajiste modpas te voye" }
```
⚠️ Voye imèl reyèl pa konekte ankò — se yon `TODO` (gade TODO.md).

### `POST /auth/google`
```json
{ "idToken": "eyJhbGc..." } // idToken Google resevwa nan app Android la
// Repons 200 — menm fòma ak login
// Repons 501 si GOOGLE_CLIENT_ID pa konfigire
```

### `GET /user/me` 🔒
```json
// Repons 200
{ "id": "uuid", "name": "Jean Batiste", "email": "jean@example.com", "plan": "FREE" }
```

---

## 💬 Chat AI (`/chat`) 🔒

### `POST /chat/message`
```json
// Rekèt
{ "message": "Bonjou, kijan ou ye?", "language": "ht" }

// Repons 200
{ "reply": "Bonjou! Mwen byen, mèsi. Kijan mwen ka ede w jodi a?", "messageId": "uuid" }
```
Repons lan jenere pa Claude oswa ChatGPT (selon `AI_PROVIDER` nan `.env`). Istwa konvèsasyon an
(20 dènye mesaj) enkli otomatikman kòm kontèks.

### `GET /chat/history`
```json
[
  { "id": "uuid", "content": "Bonjou", "sender": "USER", "timestamp": 1732000000000 },
  { "id": "uuid", "content": "Bonjou! Kijan...", "sender": "AI", "timestamp": 1732000005000 }
]
```

### `POST /chat/message/image` — 🚧 501 (TODO — mande entegrasyon vizyon)
### `POST /chat/message/voice` — 🚧 501 (TODO — mande STT)

---

## ✍️ Kreye Tèks / 🖼️ Imaj / 🎬 Videyo (`/create`) 🔒

### `POST /create/text` ✅ Fonksyonèl
```json
{ "prompt": "Ekri yon imel pou envite yon kliyan nan yon reyinyon", "tone": "pwofesyonèl" }
// Repons: { "generatedText": "..." }
```

### `POST /create/image` — 🚧 501 (TODO — mande OPENAI_API_KEY oswa STABILITY_API_KEY)
```json
{ "prompt": "Yon peyizaj mòn Ayiti", "style": "realistic" }
```

### `GET /create/image/history` ✅
```json
[{ "id": "uuid", "prompt": "...", "imageUrl": "...", "createdAt": 1732000000000 }]
```

### `POST /create/video` — Kreye anrejistreman "pending" (jenerasyon reyèl se TODO)
```json
{ "prompt": "Yon dwòn sou plaj", "durationSeconds": 10 }
// Repons: { "jobId": "uuid", "status": "pending" }
```

### `GET /create/video/status/:jobId`
```json
{ "jobId": "uuid", "status": "pending", "videoUrl": null }
```

---

## 🎙️ Vwa AI (`/voice`) 🔒 — 🚧 Estrikti pare, TODO konekte founisè

### `POST /voice/text-to-speech` — 501 (TODO — ELEVENLABS_API_KEY)
### `POST /voice/speech-to-text` — 501 (TODO — Whisper API)

---

## 🌐 Tradiksyon (`/translate`) 🔒 ✅ Fonksyonèl

```json
{ "text": "Kijan ou ye?", "sourceLang": "ht", "targetLang": "fr" }
// Repons: { "translatedText": "Comment vas-tu ?" }
```
Lang sipòte: `ht` (Kreyòl), `fr` (Franse), `en` (Angle), `es` (Espayòl).

---

## 🎓 Akademi CHERY (`/academy`) 🔒

### `GET /academy/courses`
```json
[{ "id": "uuid", "title": "Entwodiksyon nan AI", "description": "...", "level": "debutan", "progressPercent": 30 }]
```

### `GET /academy/courses/:courseId`
```json
{ "id": "uuid", "title": "...", "lessons": [{ "id": "uuid", "title": "...", "contentUrl": "...", "isCompleted": false }] }
```

### `POST /academy/progress`
```json
{ "courseId": "uuid", "lessonId": "uuid", "completed": true }
// Repons: { "success": true, "message": "Pwogrè mete ajou" }
```

---

## 💼 Biznis & Inovasyon (`/business`) 🔒 ✅ Fonksyonèl

### `GET /business/tools`
```json
[{ "id": "uuid", "name": "Analiz Mache", "description": "..." }]
```

### `POST /business/plan`
```json
{ "businessIdea": "Yon sèvis livrezon manje lokal", "targetMarket": "Jèn pwofesyonèl Pòtoprens" }
// Repons: { "planText": "1. Rezime...\n2. Pwoblèm/Solisyon...\n..." }
```

---

## Kòd Estati HTTP itilize

| Kòd | Siyifikasyon |
|---|---|
| 200 | Siksè |
| 201 | Kreye ak siksè (register) |
| 400 | Done rekèt la envalid (validasyon Zod echwe) |
| 401 | Pa otantifye / token envalid oswa ekspire |
| 404 | Resous pa jwenn |
| 409 | Konfli (ex: imèl deja itilize) |
| 429 | Twòp rekèt (rate limit) |
| 501 | Fonksyonalite poko konekte (mande konfigirasyon founisè AI siplemantè) |
| 502 | Founisè AI a echwe reponn |
| 500 | Erè entèn sèvè |

## Rate Limiting

| Zòn | Limit |
|---|---|
| Jeneral (tout wout) | 300 rekèt / 15 min / IP |
| `/auth/*` | 20 rekèt / 15 min / IP |
| `/chat`, `/create`, `/voice`, `/translate`, `/business` | 20 rekèt / minit / IP |
