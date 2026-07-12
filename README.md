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

## Exercises

- **Where & When** — Reality Orientation check-in (day, month, season, time of day).
- **Faces I Know** — spaced-retrieval practice recalling family/friends' names, fully caregiver-personalizable.
- **Matching Pairs** — a brief full reveal, then a simplified concentration game (stage-scaled pair count).
- **Sort It Out** — categorize everyday items (semantic memory + executive function).
- **What Comes Next** — put the steps of a daily routine in order (procedural memory / ADL support).
- **Memory Lane** — themed reminiscence prompts for a caregiver-assisted conversation.

## Caregiver zone

- Set the patient's stage (Early / Middle) — rescales every exercise's difficulty.
- Add/remove loved ones (name, relationship, avatar) that populate *Faces I Know*.
- Choose which reminiscence topics appear in *Memory Lane*.
- Adjust text size and toggle a high-contrast theme.
- View a day-streak, weekly session count, and a plain-language activity log.

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
- `src/pages/exercises/*` — the five exercises; `src/pages/Reminiscence.tsx` and the caregiver
  pages (`Progress.tsx`, `CaregiverSettings.tsx`) round out the app.

## Prototype limitations & next steps

This is a design/engineering prototype, not a validated clinical tool. Before any real-world
use with patients it would need: clinician/caregiver usability testing, a proper WCAG audit,
real photo upload (currently emoji avatars) for *Faces I Know*, multi-language support,
a Southern-Hemisphere season setting, and — if used beyond a single device/browser — a real
backend with authentication rather than `localStorage`.
