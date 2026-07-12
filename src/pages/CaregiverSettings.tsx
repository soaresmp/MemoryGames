import { useState } from 'react'
import { PageShell } from '../components/ui'
import { useProfile } from '../lib/ProfileContext'
import { STAGE_LABEL, type LovedOne, type Stage } from '../lib/types'
import { REMINISCENCE_PROMPTS } from '../lib/sampleData'

const ALL_THEMES = Array.from(new Set(REMINISCENCE_PROMPTS.map((p) => p.theme)))
const AVATAR_EMOJIS = ['👩', '👨', '👵', '👴', '🧑', '👧', '👦', '🐶', '🐱']

export default function CaregiverSettings() {
  const { profile, setProfile } = useProfile()
  const [newName, setNewName] = useState('')
  const [newRelationship, setNewRelationship] = useState('')
  const [newEmoji, setNewEmoji] = useState(AVATAR_EMOJIS[0])

  const setStage = (stage: Stage) => setProfile((p) => ({ ...p, stage }))

  const addLovedOne = () => {
    if (!newName.trim()) return
    const person: LovedOne = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      relationship: newRelationship.trim() || 'Family',
      emoji: newEmoji,
      intervalStep: 0,
      dueAt: 0,
    }
    setProfile((p) => ({ ...p, lovedOnes: [...p.lovedOnes, person] }))
    setNewName('')
    setNewRelationship('')
  }

  const removeLovedOne = (id: string) => {
    setProfile((p) => ({ ...p, lovedOnes: p.lovedOnes.filter((lo) => lo.id !== id) }))
  }

  const toggleTheme = (theme: string) => {
    setProfile((p) => ({
      ...p,
      reminiscenceThemes: p.reminiscenceThemes.includes(theme)
        ? p.reminiscenceThemes.filter((t) => t !== theme)
        : [...p.reminiscenceThemes, theme],
    }))
  }

  return (
    <PageShell title="Settings">
      <section className="surface mb-6 rounded-2xl border-2 border-ink/20 bg-white p-5">
        <h2 className="mb-3 text-xl font-bold">Patient name</h2>
        <input
          value={profile.name}
          onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
          className="w-full rounded-xl border-2 border-ink/20 p-3 text-lg"
        />
      </section>

      <section className="surface mb-6 rounded-2xl border-2 border-ink/20 bg-white p-5">
        <h2 className="mb-3 text-xl font-bold">Dementia stage</h2>
        <p className="mb-3 text-base opacity-70">
          Adjusts item counts, choices, and pacing across every exercise — fewer distractors and more time for
          middle stage.
        </p>
        <div className="flex gap-3">
          {(['initial', 'medium'] as Stage[]).map((stage) => (
            <button
              key={stage}
              onClick={() => setStage(stage)}
              className={`flex-1 rounded-xl border-4 p-4 text-lg font-bold ${
                profile.stage === stage ? 'border-teal bg-teal text-white' : 'border-ink/20 bg-cream-dark'
              }`}
            >
              {STAGE_LABEL[stage]}
            </button>
          ))}
        </div>
      </section>

      <section className="surface mb-6 rounded-2xl border-2 border-ink/20 bg-white p-5">
        <h2 className="mb-3 text-xl font-bold">Accessibility</h2>
        <div className="mb-4">
          <label className="mb-2 block text-lg font-semibold" htmlFor="fontScale">
            Text size ({Math.round(profile.fontScale * 100)}%)
          </label>
          <input
            id="fontScale"
            type="range"
            min={1}
            max={1.5}
            step={0.1}
            value={profile.fontScale}
            onChange={(e) => setProfile((p) => ({ ...p, fontScale: Number(e.target.value) }))}
            className="w-full"
          />
        </div>
        <label className="flex items-center gap-3 text-lg font-semibold">
          <input
            type="checkbox"
            checked={profile.highContrast}
            onChange={(e) => setProfile((p) => ({ ...p, highContrast: e.target.checked }))}
            className="h-6 w-6"
          />
          High-contrast mode
        </label>
      </section>

      <section className="surface mb-6 rounded-2xl border-2 border-ink/20 bg-white p-5">
        <h2 className="mb-1 text-xl font-bold">Faces I Know — loved ones</h2>
        <p className="mb-4 text-base opacity-70">
          Personalize with real family &amp; friends so the "Faces I Know" exercise practices names that matter.
        </p>
        <ul className="mb-4 flex flex-col gap-2">
          {profile.lovedOnes.map((lo) => (
            <li key={lo.id} className="flex items-center justify-between gap-2 rounded-xl bg-cream-dark p-3">
              <span className="text-lg">
                <span className="mr-2 text-2xl" aria-hidden="true">
                  {lo.emoji}
                </span>
                {lo.name} — {lo.relationship}
              </span>
              <button
                onClick={() => removeLovedOne(lo.id)}
                aria-label={`Remove ${lo.name}`}
                className="rounded-lg px-3 py-1 text-lg font-bold text-amber-dark hover:bg-soft-amber"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-ink/20 p-4">
          <div className="flex gap-2">
            {AVATAR_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setNewEmoji(emoji)}
                aria-label={`Choose avatar ${emoji}`}
                className={`rounded-lg p-2 text-2xl ${newEmoji === emoji ? 'bg-soft-teal' : ''}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name"
            className="rounded-xl border-2 border-ink/20 p-3 text-lg"
          />
          <input
            value={newRelationship}
            onChange={(e) => setNewRelationship(e.target.value)}
            placeholder="Relationship (e.g. Granddaughter)"
            className="rounded-xl border-2 border-ink/20 p-3 text-lg"
          />
          <button
            onClick={addLovedOne}
            className="rounded-xl bg-teal p-3 text-lg font-bold text-white hover:bg-teal-dark"
          >
            Add person
          </button>
        </div>
      </section>

      <section className="surface rounded-2xl border-2 border-ink/20 bg-white p-5">
        <h2 className="mb-1 text-xl font-bold">Memory Lane topics</h2>
        <p className="mb-4 text-base opacity-70">Choose which reminiscence topics appear in Memory Lane.</p>
        <div className="flex flex-wrap gap-2">
          {ALL_THEMES.map((theme) => (
            <button
              key={theme}
              onClick={() => toggleTheme(theme)}
              className={`rounded-full border-2 px-4 py-2 text-base font-semibold ${
                profile.reminiscenceThemes.includes(theme)
                  ? 'border-teal bg-soft-teal'
                  : 'border-ink/20 bg-cream-dark opacity-60'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
