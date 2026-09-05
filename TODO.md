# TODO — CHERY AI Backend

## ✅ Fèt (vèsyon aktyèl)

- [x] Estrikti Express + TypeScript + Prisma konplè
- [x] Enskripsyon/Koneksyon ak JWT
- [x] Google Sign-In (kòd konplè, mande GOOGLE_CLIENT_ID pou aktive)
- [x] AI Gateway ak sipò Claude + ChatGPT (swiche via `.env`)
- [x] Chat AI fonksyonèl (istwa konvèsasyon, kontèks)
- [x] Kreye Tèks, Tradiksyon, Plan Biznis — fonksyonèl (itilize AI Gateway a)
- [x] Akademi CHERY (lis kou, pwogrè) + seed done demarraj
- [x] Rate limiting 3 nivo, validasyon Zod, Helmet, CORS
- [x] Estrikti Imaj/Videyo/Vwa AI pare (mank sèlman kle founisè)

## 🔴 Priyorite 1 — Pou MVP fonksyonèl total

- [ ] Konfigire yon vrè `DATABASE_URL` (PostgreSQL — lokal oswa Railway/Render/Supabase)
- [ ] Ajoute `ANTHROPIC_API_KEY` (oswa `OPENAI_API_KEY`) reyèl nan `.env`
- [ ] Lanse `npx prisma migrate dev` epi `npm run seed`
- [ ] Teste `/auth/register` → `/chat/message` ak Postman/Insomnia anvan konekte Android

## 🟠 Priyorite 2 — Konplete sèvis ki rete yo

- [ ] **Imaj AI**: konekte OpenAI DALL-E 3 oswa Stability AI (kòd egzanp deja kòmante nan `create.routes.ts`)
- [ ] **Videyo AI**: chwazi founisè (Runway ML, Pika Labs, Luma AI), enplemante apèl + webhook/polling
- [ ] **Vwa AI**: ElevenLabs (TTS) + OpenAI Whisper (STT) — kòd egzanp kòmante nan `voice.routes.ts`
- [ ] **Chat ak imaj/vwa**: itilize `multer` pou resevwa fichye multipart, pase bay modèl vizyon/STT
- [ ] Voye imèl reyèl pou "modpas bliye" (Resend, SendGrid, oswa Nodemailer + SMTP)
- [ ] Telechaje imaj/videyo jenere yo sou yon depo (AWS S3, Cloudflare R2) olye URL tanporè founisè a

## 🟡 Priyorite 3 — Kalite ak Operasyon

- [ ] Tès otomatik (Jest/Vitest) pou wout yo, espesyalman auth ak AI Gateway
- [ ] Logging strikti (Pino/Winston) olye `console.log`/`console.error`
- [ ] Sentry (oswa ekivalan) pou swivi erè an pwodiksyon
- [ ] Cache Redis pou repons AI ki repete souvan
- [ ] File d'attente (BullMQ) pou jenerasyon videyo (olye rekèt HTTP senkwòn)
- [ ] Endpoint refresh token (kounye a token JWT senp ekspire apre 30 jou san refresh)
- [ ] Detekte ak jere 401 otomatikman sou app Android la (dekonekte itilizatè si token ekspire)

## 🟢 Priyorite 4 — Pwodiksyon ak Echèl

- [ ] Deplwaye sou Railway/Render/AWS ak baz done manaje
- [ ] Konfigire CI/CD (GitHub Actions) — tès otomatik + deplwaman sou push
- [ ] Migrasyon `subscriptions` ak Google Play Billing / Stripe pou peman reyèl
- [ ] Monitoring (uptime, latans, itilizasyon AI pa itilizatè pou detekte abi)
- [ ] Politik konfidansyalite/Kondisyon Sèvis ki dekri kolèkt done (obligatwa legal)

## 🔵 Amelyorasyon Fiti

- [ ] Backend Web (React/Next.js) ki itilize menm API sa a
- [ ] Sipò plizyè konvèsasyon pa itilizatè (kounye a se yon sèl fil kontinyèl pa itilizatè)
- [ ] Notifikasyon push (Firebase Cloud Messaging) pou videyo/imaj ki fini jenere an background
