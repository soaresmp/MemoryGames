export interface CategoryItem {
  itemKey: string
  emoji: string
  categoryKey: string
}

export const CATEGORY_SETS: { categoryKeys: string[]; items: CategoryItem[] }[] = [
  {
    categoryKeys: ['fruit', 'tools'],
    items: [
      { itemKey: 'apple', emoji: '🍎', categoryKey: 'fruit' },
      { itemKey: 'banana', emoji: '🍌', categoryKey: 'fruit' },
      { itemKey: 'orange', emoji: '🍊', categoryKey: 'fruit' },
      { itemKey: 'grapes', emoji: '🍇', categoryKey: 'fruit' },
      { itemKey: 'hammer', emoji: '🔨', categoryKey: 'tools' },
      { itemKey: 'wrench', emoji: '🔧', categoryKey: 'tools' },
      { itemKey: 'scissors', emoji: '✂️', categoryKey: 'tools' },
      { itemKey: 'screwdriver', emoji: '🪛', categoryKey: 'tools' },
    ],
  },
  {
    categoryKeys: ['animals', 'kitchen'],
    items: [
      { itemKey: 'dog', emoji: '🐶', categoryKey: 'animals' },
      { itemKey: 'cat', emoji: '🐱', categoryKey: 'animals' },
      { itemKey: 'bird', emoji: '🐦', categoryKey: 'animals' },
      { itemKey: 'rabbit', emoji: '🐰', categoryKey: 'animals' },
      { itemKey: 'kettle', emoji: '🫖', categoryKey: 'kitchen' },
      { itemKey: 'cup', emoji: '☕', categoryKey: 'kitchen' },
      { itemKey: 'spoon', emoji: '🥄', categoryKey: 'kitchen' },
      { itemKey: 'plate', emoji: '🍽️', categoryKey: 'kitchen' },
    ],
  },
]

export interface RoutineStep {
  emoji: string
}

export interface RoutineSet {
  setKey: string
  steps: RoutineStep[]
}

export const ROUTINE_SETS: RoutineSet[] = [
  {
    setKey: 'tea',
    steps: [{ emoji: '🚰' }, { emoji: '🫖' }, { emoji: '☕' }, { emoji: '🥛' }],
  },
  {
    setKey: 'bedtime',
    steps: [{ emoji: '👘' }, { emoji: '🪥' }, { emoji: '💡' }, { emoji: '🛏️' }],
  },
  {
    setKey: 'toast',
    steps: [{ emoji: '🍞' }, { emoji: '🔌' }, { emoji: '🧈' }, { emoji: '😋' }],
  },
]

export interface ReminiscencePrompt {
  themeKey: string
  emoji: string
}

export const REMINISCENCE_PROMPTS: ReminiscencePrompt[] = [
  { themeKey: 'music60s', emoji: '🎶' },
  { themeKey: 'childhoodGames', emoji: '🪀' },
  { themeKey: 'familyHolidays', emoji: '🏖️' },
  { themeKey: 'oldRecipes', emoji: '🍲' },
  { themeKey: 'firstJob', emoji: '💼' },
  { themeKey: 'pets', emoji: '🐕' },
]

export const MATCH_PAIR_EMOJIS = ['🌻', '🐝', '🍀', '🌈', '⭐', '🍎', '🎈', '🌙', '☀️', '🦋', '🐟', '🍓']

export interface NamingItem {
  itemKey: string
  emoji: string
}

export const NAMING_ITEMS: NamingItem[] = [
  { itemKey: 'sun', emoji: '☀️' },
  { itemKey: 'moon', emoji: '🌙' },
  { itemKey: 'star', emoji: '⭐' },
  { itemKey: 'tree', emoji: '🌳' },
  { itemKey: 'house', emoji: '🏠' },
  { itemKey: 'car', emoji: '🚗' },
  { itemKey: 'chair', emoji: '🪑' },
  { itemKey: 'shoe', emoji: '👞' },
  { itemKey: 'hat', emoji: '🎩' },
  { itemKey: 'book', emoji: '📖' },
  { itemKey: 'telephone', emoji: '☎️' },
  { itemKey: 'clock', emoji: '🕐' },
]

/** Translation keys only — prompt/options text lives in trivia.questions.<key> per locale. */
export const TRIVIA_QUESTION_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8']

export interface PatternPad {
  key: string
  emoji: string
}

export const PATTERN_PADS: PatternPad[] = [
  { key: 'sun', emoji: '☀️' },
  { key: 'clover', emoji: '🍀' },
  { key: 'blossom', emoji: '🌸' },
  { key: 'star', emoji: '⭐' },
]
