# MindTrail — Brain Training Portal for Dementia Care

A prototype web portal of short, low-pressure cognitive exercises for people living with
**early-to-middle-stage dementia**, with a lightweight caregiver zone for personalization
and progress tracking. Client-side only (data lives in the browser's `localStorage`) — no
backend, accounts, or PHI leave the device.

## Why these features (evidence base)

Every design and gameplay decision maps to a specific, replicated finding in the dementia
cognitive-rehabilitation literature, not a generic "brain game":

| Feature | Evidence base |
| --- | --- |
| **Where & When** (date/season/time-of-day check-in) | **Reality Orientation Therapy (ROT)** — repeated orientation to time/place/person improves cognition and reduces confusion in dementia (Spector, Orrell, Davies & Woods, *Cochrane Database of Systematic Reviews*, 2000). |
| **Faces I Know** (study → recall of family names) | **Spaced Retrieval Training (SRT)** — Camp's expanding-interval rehearsal technique (Camp, 1996) is one of the most consistently replicated memory interventions for dementia, especially for face–name association. Implemented here as a real expanding schedule (1→2→4→7→14→30 days) that resets to a short interval instead of "failing." |
| Every exercise's answer handling | **Errorless learning** — dementia patients retain more and experience less frustration when never left on a wrong answer; the correct answer is always revealed gently rather than marked with a red ✗ (Clare & Jones, *Neuropsychology Review*, 2008). |
| **Matching Pairs**, **Sort It Out**, **What Comes Next** | Adapted concentration/semantic-categorization/sequencing tasks used in **Cognitive Stimulation Therapy (CST)** group programs, the only cognitive intervention NICE recommends for mild-to-moderate dementia (Spector et al., *British Journal of Psychiatry*, 2003; Woods et al., *Cochrane*, 2012). "What Comes Next" doubles as light rehearsal of ADL sequences (making tea, bedtime routine). |
| **Memory Lane** (reminiscence prompts) | **Reminiscence therapy** — Cochrane review found modest, consistent benefits for mood, quality of life, and communication in dementia (Woods et al., *Cochrane*, 2018). Framed as a conversation starter for the person and a family member, not a quiz. |
| Large touch targets, warm high-contrast palette, ≤3 choices per screen, one-tap way back to Home | **Dementia-friendly design guidelines** from the University of Stirling Dementia Services Development Centre (DSDC): minimal navigation depth, strong contrast, no ambiguous blue/green/purple hue confusion, no visual clutter. |
| Stage toggle (Early / Middle) that scales item counts, choice counts, and pacing everywhere | Middle-stage dementia needs fewer decisions per screen and slower pacing than early-stage — difficulty is tied to **disease stage**, never framed as a "level" the person must earn. |
| Personalized loved ones & reminiscence topics (caregiver-editable) | **Person-centered care** (Kitwood) — content that reflects the individual's real relationships and history drives engagement far more than generic stimuli. |
| Progress page framed as "engagement," not test scores | Avoids the shame/anxiety response common when dementia patients are shown numeric failure; caregivers see streaks and activity, not grades. |
| **Pattern Repeat** (watch a sequence, tap it back) | Sequential-recall span tasks are a standard working-memory / sustained-attention format in cognitive stimulation programs; color **and** symbol coding on every pad (not color alone) follows accessible-design practice for users with low vision or color-vision deficiency. |
| **Name This** (picture naming) | Confrontation naming is one of the earliest and most closely tracked language changes in dementia (assessed in essentially every clinical cognitive battery); practicing it in a low-pressure, errorless format supports language function without the stakes of a test. |
| **Odd One Out** | A single-decision-per-screen variant of semantic categorization — gentler than sorting a full set (as in *Sort It Out*) while still exercising the same categorical-reasoning skill. |
| **Blast From the Past** (nostalgia trivia) | Leverages the **reminiscence bump** — autobiographical memories from adolescence/early adulthood stay disproportionately accessible in dementia — with always-gettable, positively-framed multiple-choice questions about pre-digital daily life, as a lighter-touch counterpart to *Memory Lane*'s open-ended prompts. |
| **Word Puzzle** (crossword-inspired spelling) | A randomized-controlled trial found crossword puzzles held cognitive performance in amnestic MCI as well as or better than a computerized cognitive-training app, with less brain atrophy on MRI over 78 weeks (Devanand et al., *NEJM Evidence*, 2022). Adapted here as tap-tile letter spelling (no free typing): early stage solves a real multi-word crossword grid, one word at a time, where letters already solved in earlier crossing words are pre-filled; middle stage keeps a single word with no crossing, to limit decisions per screen. |
| **Cognitive Check-in** (clock-setting, delayed word recall, attention task, caregiver questionnaire) | Inspired by the cognitive domains real screening tools assess — the **Clock Drawing Test** / Mini-Cog (visuospatial/executive function), **MMSE/MoCA**-style delayed recall and serial-subtraction attention tasks, and the caregiver-interview domains behind staging tools like the **GDS** and **CDR** — without reproducing any of those copyrighted instruments verbatim. Deliberately outputs *no numeric score or stage claim*, only banded plain-language observations ("no / some / considerable difficulty observed") explicitly framed as a doctor-visit conversation starter, never a diagnosis. |

## Exercises

- **Where & When** — Reality Orientation check-in (day, month, season, time of day).
- **Faces I Know** — spaced-retrieval practice recalling family/friends' names, fully caregiver-personalizable.
- **Matching Pairs** — a brief full reveal, then a simplified concentration game (stage-scaled pair count).
- **Sort It Out** — categorize everyday items (semantic memory + executive function).
- **What Comes Next** — put the steps of a daily routine in order (procedural memory / ADL support).
- **Pattern Repeat** — watch a short color-and-symbol sequence, then tap it back (working memory / attention).
- **Name This** — picture-naming task with multiple-choice answers (language / confrontation naming).
- **Odd One Out** — one wrong-category item among four; tap the one that doesn't belong (categorical reasoning).
- **Blast From the Past** — always-answerable nostalgia trivia about pre-digital daily life (reminiscence bump).
- **Word Puzzle** — spell clued words one at a time by tapping letter tiles, building up a real multi-word crossword grid where later words reuse letters already solved (crossword-inspired, no free typing); middle stage stays a single word with no crossing.
- **Memory Lane** — themed reminiscence prompts for a caregiver-assisted conversation.

## Cognitive Check-in

A separate, clearly-disclaimed section (not one of the daily practice exercises above) for an
occasional, informal observation session ahead of a doctor's visit:

1. **Word recall** — shown 3–4 simple words, asked to recall them later.
2. **Attention task** — a short serial-subtraction sequence (multiple choice).
3. **Clock-setting task** — an interactive SVG clock: place the numbers 1–12 (skipped at the
   middle stage — numbers are pre-filled), then drag the hour/minute hands to a requested time.
4. **Delayed word recall** — free-text entry, checked against the words shown in step 1.
5. **Caregiver questionnaire** — six yes/no/not-sure questions about functional changes noticed
   over recent months (managing money, repeating questions, personal care, hobbies, etc.).

The result screen shows each domain's plain-language observation and band, a strong
non-diagnostic disclaimer repeated top and bottom, and a "Copy summary" button so it can be
pasted into an email or message ahead of an appointment. Every check-in is timestamped and
kept (`profile.checkins`) so trends are visible across repeated check-ins over time. See
`src/lib/checkin.ts` for the scoring/banding logic and `src/pages/checkin/ClockTask.tsx` for
the interactive clock.

## Caregiver zone

- Set the patient's stage (Early / Middle) — rescales every exercise's difficulty.
- Choose the app language: English, Português (Brasil), Español, or Français.
- Add/remove loved ones (name, relationship, avatar) that populate *Faces I Know*.
- Choose which reminiscence topics appear in *Memory Lane*.
- Adjust text size and toggle a high-contrast theme.
- View a day-streak, weekly session count, and a plain-language activity log.

## Language support

The whole app — orientation questions, exercise content, caregiver settings — is translated,
not just the chrome. Built on `i18next` / `react-i18next`, language auto-detects from the
browser on first run and is otherwise a caregiver setting (`src/i18n/`). The **Where & When**
exercise also flips its season logic for Southern-Hemisphere locales (Português/Brasil ships
as Southern; the season question would otherwise be wrong for six months of the year).

## Running it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build to dist/
```

## Architecture

- **React + TypeScript + Vite**, styled with **Tailwind CSS v4**.
- `src/lib/types.ts` — shared domain types.
- `src/lib/storage.ts` — `localStorage`-backed profile persistence.
- `src/lib/spacedRetrieval.ts` — expanding-interval scheduling for *Faces I Know*.
- `src/lib/difficulty.ts` — per-stage difficulty table consumed by every exercise.
- `src/pages/exercises/*` — the ten exercises; `src/pages/Reminiscence.tsx` and the caregiver
  pages (`Progress.tsx`, `CaregiverSettings.tsx`) round out the app.
- `src/i18n/` — `i18next` config plus `locales/{en,pt-BR,es,fr}.json`. All exercise content
  (categories, routine steps, reminiscence themes) is keyed, not hardcoded English, so it
  translates along with the UI chrome.

## Prototype limitations & next steps

This is a design/engineering prototype, not a validated clinical tool. Before any real-world
use with patients it would need: clinician/caregiver usability testing, a proper WCAG audit,
real photo upload (currently emoji avatars) for *Faces I Know*, and — if used beyond a single
device/browser — a real backend with authentication rather than `localStorage`.
