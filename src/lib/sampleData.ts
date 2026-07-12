export interface CategoryItem {
  label: string
  emoji: string
  category: string
}

export const CATEGORY_SETS: { categories: string[]; items: CategoryItem[] }[] = [
  {
    categories: ['Fruit', 'Tools'],
    items: [
      { label: 'Apple', emoji: '🍎', category: 'Fruit' },
      { label: 'Banana', emoji: '🍌', category: 'Fruit' },
      { label: 'Orange', emoji: '🍊', category: 'Fruit' },
      { label: 'Grapes', emoji: '🍇', category: 'Fruit' },
      { label: 'Hammer', emoji: '🔨', category: 'Tools' },
      { label: 'Wrench', emoji: '🔧', category: 'Tools' },
      { label: 'Scissors', emoji: '✂️', category: 'Tools' },
      { label: 'Screwdriver', emoji: '🪛', category: 'Tools' },
    ],
  },
  {
    categories: ['Animals', 'Kitchen'],
    items: [
      { label: 'Dog', emoji: '🐶', category: 'Animals' },
      { label: 'Cat', emoji: '🐱', category: 'Animals' },
      { label: 'Bird', emoji: '🐦', category: 'Animals' },
      { label: 'Rabbit', emoji: '🐰', category: 'Animals' },
      { label: 'Kettle', emoji: '🫖', category: 'Kitchen' },
      { label: 'Cup', emoji: '☕', category: 'Kitchen' },
      { label: 'Spoon', emoji: '🥄', category: 'Kitchen' },
      { label: 'Plate', emoji: '🍽️', category: 'Kitchen' },
    ],
  },
]

export interface RoutineSet {
  title: string
  steps: { label: string; emoji: string }[]
}

export const ROUTINE_SETS: RoutineSet[] = [
  {
    title: 'Making a cup of tea',
    steps: [
      { label: 'Fill the kettle with water', emoji: '🚰' },
      { label: 'Boil the water', emoji: '🫖' },
      { label: 'Pour water over the tea bag', emoji: '☕' },
      { label: 'Add milk and stir', emoji: '🥛' },
    ],
  },
  {
    title: 'Getting ready for bed',
    steps: [
      { label: 'Put on pyjamas', emoji: '👘' },
      { label: 'Brush your teeth', emoji: '🪥' },
      { label: 'Turn off the light', emoji: '💡' },
      { label: 'Get into bed', emoji: '🛏️' },
    ],
  },
  {
    title: 'Making breakfast toast',
    steps: [
      { label: 'Take out a slice of bread', emoji: '🍞' },
      { label: 'Put it in the toaster', emoji: '🔌' },
      { label: 'Spread butter on top', emoji: '🧈' },
      { label: 'Enjoy the toast', emoji: '😋' },
    ],
  },
]

export interface ReminiscencePrompt {
  theme: string
  emoji: string
  prompt: string
}

export const REMINISCENCE_PROMPTS: ReminiscencePrompt[] = [
  { theme: 'Music of the 60s', emoji: '🎶', prompt: 'What was a song you loved to dance to?' },
  { theme: 'Childhood games', emoji: '🪀', prompt: 'What games did you play outside as a child?' },
  { theme: 'Family holidays', emoji: '🏖️', prompt: 'Where did your family like to spend the holidays?' },
  { theme: 'Old family recipes', emoji: '🍲', prompt: 'What meal did your mother cook best?' },
  { theme: 'First job', emoji: '💼', prompt: 'What was the first job you ever had?' },
  { theme: 'Pets', emoji: '🐕', prompt: 'Did you have a pet growing up? What was their name?' },
]

export const MATCH_PAIR_EMOJIS = ['🌻', '🐝', '🍀', '🌈', '⭐', '🍎', '🎈', '🌙', '☀️', '🦋', '🐟', '🍓']
