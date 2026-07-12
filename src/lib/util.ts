export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function pickDistractors<T>(all: T[], correct: T, count: number): T[] {
  const pool = all.filter((v) => v !== correct)
  return shuffle(pool).slice(0, count)
}
