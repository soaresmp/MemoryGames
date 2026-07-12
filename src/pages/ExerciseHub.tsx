import { BigButton, PageShell } from '../components/ui'

export default function ExerciseHub() {
  return (
    <PageShell title="Brain Exercises">
      <p className="mb-6 text-xl opacity-80">Pick one to try. There's no rush and no wrong answers.</p>
      <div className="flex flex-col gap-4">
        <BigButton to="/exercises/orientation" emoji="🗓️" label="Where & When" sublabel="A gentle check-in" />
        <BigButton to="/exercises/faces" emoji="👪" label="Faces I Know" sublabel="Practice familiar names" tone="teal" />
        <BigButton to="/exercises/match" emoji="🃏" label="Matching Pairs" sublabel="Find the matching pictures" />
        <BigButton to="/exercises/sort" emoji="🗂️" label="Sort It Out" sublabel="Group things that go together" tone="teal" />
        <BigButton to="/exercises/routine" emoji="📋" label="What Comes Next" sublabel="Put the steps in order" />
      </div>
    </PageShell>
  )
}
