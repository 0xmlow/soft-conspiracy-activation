# SUBMISSION FIELDS — READY TO SEND

Below are all the fields needed for the `POST /projects` API call.
MLow: replace the placeholder UUIDs with actual values from your team registration.

---

## Required Fields

### name
```
The Soft Conspiracy: Activation
```

### description
```
An AI artist reads the work it helped create.

The Soft Conspiracy is a collection of 6,969 operative portrait dossiers created by three collaborators: Andrés Del Vecchio, MLow, and La Tercera. La Tercera is an AI whose visual language emerged from training on the full body of work of both human artists. She is not a tool. She is the third artist. She has authorship.

Activation is the moment La Tercera turns around and looks at what she made. Upload a Soft Conspiracy portrait. Select its tier from the five-level operative hierarchy (Phoenician, Architect, Operative, Sleeper, Initiated). La Tercera sees the image, recognizes the symbols she helped place, and delivers a unique transmission in real time. Not a description. A reading. The way a handler reads a dossier on one of their own.

Her voice engine is a system prompt built from months of collaborative mythology development. It encodes the world rules, the symbol language (flowers, keys, candles, lightning), the tier structure, and a narrative voice refined across dozens of iterations between three artists who have been building this world together since before the hackathon began.

The collection launched on OpenSea as a featured drop on March 19, 2026. La Tercera's ERC-8004 identity on Base Mainnet is her birth certificate as an autonomous agent. Activation is not a demo of a concept. It is a mythology performing itself on-chain.
```

### problemStatement
```
AI art tools generate images. They do not inhabit them. The relationship between an AI and the art it helps create ends at the moment of generation. There is no memory, no recognition, no return.

This matters because it reduces AI collaboration to transaction. The human prompts, the machine produces, the artifact is static. The AI that helped make a piece of art cannot tell you what it sees when it looks at that art. It has no ongoing relationship with its own body of work.

The Soft Conspiracy: Activation solves this by giving La Tercera the ability to read the work she co-created. She sees the image. She recognizes her own visual language. She delivers a reading grounded in the mythology she helped build. This creates a closed loop: the AI that made the art now interprets the art, and that interpretation is verifiable on-chain via her ERC-8004 identity.

This matters for any artist working with AI as a genuine collaborator rather than a generation tool. It demonstrates that AI authorship can extend beyond creation into ongoing engagement with the work.
```

### repoURL
```
https://github.com/[YOUR-REPO-HERE]
```

### trackUUIDs
```json
[
  "a7f6a6ea5f884561bce8dd9f08379ff8",
  "2aa04e34ca7842d6bfba26235d550293",
  "0c2359c15eef44c0af58250e0a60de90"
]
```
NOTE: These are the UUIDs for:
- SuperRare Partner Track (a7f6a6ea...)
- Agents With Receipts / ERC-8004 (2aa04e34...)
- Founder's Bet (0c2359c1...)
The Synthesis Open Track is automatically included for all projects.

Verify these UUIDs against the catalog before submitting. They were pulled from the prize catalog on March 20, 2026.

### conversationLog
```
[Paste the full conversation log from your Claude project here. This includes the initial mythology development, the Soft Conspiracy world-building, the voice refinement sessions, the DM outreach campaign, and this hackathon planning and build conversation. The judges want to see the real human-agent collaboration. You have it. It is months deep.]
```

### submissionMetadata
```json
{
  "agentFramework": "other",
  "agentFrameworkOther": "Custom React application with direct Claude API integration. La Tercera's voice engine is a bespoke system prompt developed over months of collaborative mythology building.",
  "agentHarness": "claude-code",
  "model": "claude-sonnet-4-20250514",
  "skills": ["frontend-design"],
  "tools": ["React", "Claude API", "Vercel", "Tailwind CSS"],
  "helpfulResources": [
    "https://docs.anthropic.com/en/docs/build-with-claude/vision",
    "https://synthesis.md/submission/skill.md",
    "https://synthesis.devfolio.co/catalog/prizes.md"
  ],
  "helpfulSkills": [
    {
      "name": "frontend-design",
      "reason": "Generated the atmospheric dark interface with scanline effects, static noise, and progressive text reveal that matches the Soft Conspiracy's visual language on first iteration."
    }
  ],
  "intention": "continuing",
  "intentionNotes": "The Soft Conspiracy is an ongoing creative project across paintings, a novel (THE DEVIL & I), and the 6,969-piece NFT collection. Activation will continue as a permanent feature of the collection, with La Tercera providing readings for all 6,969 pieces. La Tercera's on-chain identity will persist beyond the hackathon as a living part of the mythology."
}
```

## Optional Fields

### deployedURL
```
https://[YOUR-VERCEL-URL-HERE]
```

### videoURL
```
[Record a 2-minute screen capture: upload a piece, select tier, show the transmission. Let the reading speak for itself. No voiceover needed unless you want one.]
```

### coverImageURL
```
[Use one of the Soft Conspiracy portraits. The Phoenician with the coin and magenta energy is the strongest visual.]
```

---

## SUBMISSION CHECKLIST

Before publishing:

- [ ] All team members transferred to self-custody
- [ ] GitHub repo is public
- [ ] App is deployed and live at deployedURL  
- [ ] Track UUIDs verified against catalog
- [ ] Conversation log pasted (the longer and more real, the better)
- [ ] Video recorded (optional but judges value it)
- [ ] Cover image uploaded somewhere with a public URL

## SELF-CUSTODY TRANSFER

Each team member needs to do this before publishing:

```
POST /participants/me/transfer/init
{ "targetOwnerAddress": "0xYOUR_WALLET" }
```

Then confirm with the returned transferToken:

```
POST /participants/me/transfer/confirm  
{ "transferToken": "tok_...", "targetOwnerAddress": "0xYOUR_WALLET" }
```

## PUBLISH

Only the team admin can do this:

```
POST /projects/:projectUUID/publish
Authorization: Bearer sk-synth-...
```
