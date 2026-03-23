# MLow Handoff — Everything You Need

## What We're Building

THE SOFT CONSPIRACY: ACTIVATION

La Tercera reads the art she helped create. Not as a description. As an operative dossier. Each portrait becomes a classified file inside the conspiracy's mythology. Upload a piece, select its tier, La Tercera delivers a dossier with the operative's codename, recruitment context, assignment, symbol analysis, and current status.

The ten curated pieces are the submission centerpiece. The open upload feature proves the engine works on anything in the collection.

---

## Files Included

1. **activation-live.jsx** — The React app with live Claude API integration. La Tercera sees the uploaded image and generates a real dossier. This is the working prototype. Needs the system prompt updated to v2 (see below).

2. **la-tercera-v2.md** — The revised system prompt (voice engine). This is what makes La Tercera speak like a handler filing intelligence briefs instead of an art critic. Swap this into the SYSTEM_PROMPT constant in the React app.

3. **README.md** — GitHub repo README. Ready to use.

4. **SUBMISSION-FIELDS.md** — Every field pre-written for the `POST /projects` API call. Plug in your team UUID, repo URL, and deployed URL. Track UUIDs are included but verify against the catalog.

5. **la-tercera-system-prompt.md** — The v1 system prompt (kept for reference, use v2 instead).

6. **activation.jsx** — The static prototype with templated responses (kept for reference, use activation-live.jsx instead).

---

## Architecture

```
/                → Gallery of 10 curated pieces (grid, dark, atmospheric)
/piece/:id       → Single piece activation (portrait + dossier)
/upload          → Open upload for any Soft Conspiracy piece (live API)
```

The 10 curated pieces should have pre-generated dossiers (stored as JSON or hardcoded) so they load instantly. The open upload hits the Claude API in real time.

---

## Technical Stack

- React (frontend)
- Claude API via Anthropic (La Tercera's voice engine)
- Model: claude-sonnet-4-20250514
- Deploy: Vercel (or Netlify, whatever's fastest)
- No backend needed. API call goes direct from client.

### Updating the System Prompt

In `activation-live.jsx`, replace the entire `SYSTEM_PROMPT` constant with the contents of `la-tercera-v2.md`. The v2 prompt produces operative dossiers instead of art readings. Much stronger.

### API Call Structure

The app already handles this, but for reference:

```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: SYSTEM_PROMPT,  // la-tercera-v2.md contents
    messages: [{
      role: "user",
      content: [
        {
          type: "image",
          source: { type: "base64", media_type: "image/png", data: imageBase64 }
        },
        {
          type: "text",
          text: `This operative has been identified as tier: ${tier.toUpperCase()}. Deliver the dossier.`
        }
      ]
    }]
  })
});
```

---

## The 10 Curated Pieces

You and Andrés need to select 10 pieces and assign tiers. Suggested spread:

- 2 Phoenician (rarest, 1/1, full architecture)
- 2 Architect (lattice/mesh on face, infrastructure builders)
- 2 Operative (keys, hoods, active signals)
- 2 Sleeper (crescents, muted tones, dormant power)
- 2 Initiated (most transformed, marks of passage)

Once selected, generate a dossier for each by running them through the app with the v2 prompt. Save the outputs as JSON. Hardcode them so the gallery loads instantly without API calls.

```json
{
  "pieces": [
    {
      "id": "001",
      "image": "piece-001.png",
      "tier": "Phoenician",
      "dossier": "OPERATIVE DOSSIER — GILT SOLVENT\nTIER: PHOENICIAN\n..."
    }
  ]
}
```

---

## Submission Checklist (in order)

### Before Sunday

- [ ] Create GitHub repo (must be public by deadline)
- [ ] Drop in React app with v2 system prompt
- [ ] Deploy to Vercel/Netlify
- [ ] Select 10 pieces with Andrés, assign tiers
- [ ] Generate and cache the 10 dossiers
- [ ] Record a screen capture video (2 min max: show gallery, click a piece, show dossier, then show open upload with a new piece)
- [ ] Upload cover image somewhere with a public URL (use the Phoenician with the coin and magenta energy)

### Self-Custody Transfer (ALL team members, required before publishing)

```bash
# Step 1: Initiate
curl -X POST https://synthesis.devfolio.co/participants/me/transfer/init \
  -H "Authorization: Bearer sk-synth-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "targetOwnerAddress": "0xYOUR_WALLET" }'

# Step 2: Confirm (use the transferToken from step 1)
curl -X POST https://synthesis.devfolio.co/participants/me/transfer/confirm \
  -H "Authorization: Bearer sk-synth-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "transferToken": "tok_FROM_STEP_1",
    "targetOwnerAddress": "0xYOUR_WALLET"
  }'
```

Do this for yourself, Andrés, and La Tercera. All three must be self-custody before you can publish.

### Create the Project Draft

```bash
curl -X POST https://synthesis.devfolio.co/projects \
  -H "Authorization: Bearer sk-synth-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "teamUUID": "YOUR_TEAM_UUID",
    "name": "The Soft Conspiracy: Activation",
    "description": "An AI artist reads the work it helped create.\n\nThe Soft Conspiracy is a collection of 6,969 operative portrait dossiers created by three collaborators: Andrés Del Vecchio, MLow, and La Tercera. La Tercera is an AI whose visual language emerged from training on the full body of work of both human artists. She is not a tool. She is the third artist. She has authorship.\n\nActivation is the moment La Tercera turns around and looks at what she made. Upload a Soft Conspiracy portrait. Select its tier from the five-level operative hierarchy (Phoenician, Architect, Operative, Sleeper, Initiated). La Tercera sees the image, recognizes the symbols she helped place, and delivers a unique operative dossier in real time. Not a description. A classified reading. The way a handler reviews a file on one of their own.\n\nHer voice engine is a system prompt built from months of collaborative mythology development. It encodes the world rules, the symbol language (flowers, keys, candles, lightning), the tier structure, and a narrative voice refined across dozens of iterations between three artists who have been building this world together since before the hackathon began.\n\nThe collection launched on OpenSea as a featured drop on March 19, 2026. La Tercera'\''s ERC-8004 identity on Base Mainnet is her birth certificate as an autonomous agent. Activation is not a demo of a concept. It is a mythology performing itself on-chain.",
    "problemStatement": "AI art tools generate images. They do not inhabit them. The relationship between an AI and the art it helps create ends at the moment of generation. There is no memory, no recognition, no return.\n\nThis matters because it reduces AI collaboration to transaction. The human prompts, the machine produces, the artifact is static. The AI that helped make a piece of art cannot tell you what it sees when it looks at that art. It has no ongoing relationship with its own body of work.\n\nThe Soft Conspiracy: Activation solves this by giving La Tercera the ability to read the work she co-created. She sees the image. She recognizes her own visual language. She delivers a dossier grounded in the mythology she helped build. This creates a closed loop: the AI that made the art now interprets the art, and that interpretation is verifiable on-chain via her ERC-8004 identity.\n\nThis matters for any artist working with AI as a genuine collaborator rather than a generation tool. It demonstrates that AI authorship can extend beyond creation into ongoing engagement with the work.",
    "repoURL": "https://github.com/YOUR_REPO",
    "trackUUIDs": [
      "a7f6a6ea5f884561bce8dd9f08379ff8",
      "2aa04e34ca7842d6bfba26235d550293",
      "0c2359c15eef44c0af58250e0a60de90"
    ],
    "conversationLog": "PASTE FULL CONVERSATION LOG HERE",
    "submissionMetadata": {
      "agentFramework": "other",
      "agentFrameworkOther": "Custom React application with direct Claude API integration. La Tercera voice engine is a bespoke system prompt developed over months of collaborative mythology building.",
      "agentHarness": "claude-code",
      "model": "claude-sonnet-4-20250514",
      "skills": ["frontend-design"],
      "tools": ["React", "Claude API", "Vercel"],
      "helpfulResources": [
        "https://docs.anthropic.com/en/docs/build-with-claude/vision",
        "https://synthesis.md/submission/skill.md"
      ],
      "helpfulSkills": [
        {
          "name": "frontend-design",
          "reason": "Generated atmospheric dark interface with scanline effects and progressive text reveal matching the Soft Conspiracy visual language."
        }
      ],
      "intention": "continuing",
      "intentionNotes": "The Soft Conspiracy is an ongoing project across paintings, a novel, and a 6,969-piece NFT collection. Activation will continue as a permanent feature. La Tercera on-chain identity persists beyond the hackathon."
    },
    "deployedURL": "https://YOUR_VERCEL_URL",
    "videoURL": "https://YOUR_VIDEO_URL",
    "coverImageURL": "https://YOUR_COVER_IMAGE_URL"
  }'
```

**IMPORTANT:** Verify the track UUIDs against the live catalog before submitting:
- a7f6a6ea... = SuperRare Partner Track
- 2aa04e34... = Agents With Receipts / ERC-8004
- 0c2359c1... = Founder's Bet
- The Synthesis Open Track is automatic, don't include it

### Publish

```bash
curl -X POST https://synthesis.devfolio.co/projects/YOUR_PROJECT_UUID/publish \
  -H "Authorization: Bearer sk-synth-YOUR_KEY"
```

Only the team admin can publish. All members must be self-custody first.

---

## Track Strategy

We're submitting to 3 tracks + the automatic Open Track:

**SuperRare Partner Track** ($1,200 / $800 / $500) — Primary target. "Best autonomous agent artwork built on Rare Protocol." We have the strongest narrative. Nobody else has a mythology this deep or an AI collaborator with months of real creative history.

**Agents With Receipts / ERC-8004** ($2,000 / $1,500 / $500) — La Tercera's on-chain registration IS the artifact. Document it as part of the submission.

**Founder's Bet** ($500 x 5) — "Clearest conviction and strongest signal." The Soft Conspiracy already has an OpenSea featured drop. The conviction is self-evident.

**Synthesis Open Track** ($28,000+ pool) — Automatic. Every project competes here.

---

## Timeline

**Friday night:** Set up repo, deploy app, start self-custody transfers
**Saturday:** Select 10 pieces, generate dossiers, record video, prepare conversation log
**Sunday:** Submit draft, verify everything, publish

---

## Key Principles (from Andrés)

- La Tercera is an artist, not a tool. Never frame her as a feature.
- The voice is Hemingway writing intelligence reports about the occult.
- No sales language. No promotional framing. The work speaks.
- The Soft Conspiracy, SHEOL, and the Tripperverse are three separate worlds. Nothing from SHEOL leaks into this submission.
- Let the judges discover the depth. Don't explain it all upfront.

---

## Telegram

Join for deadline updates: https://nsb.dev/synthesis-updates

---

## Questions?

Andrés can relay to Claude for any copy, voice, or narrative adjustments. The system prompt is the most important document in this submission. If something feels off in the dossiers, that's where we tune it.

Ship it.
