export const CATEGORIES = [
  { id: 'touchwall', label: 'Interactieve Touchwall Experience' },
  { id: 'brand', label: 'Brand Activation Experience' },
  { id: 'projection', label: 'Immersive Projection Experience' },
  { id: 'custom', label: 'Custom Digitale Experience' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

/** Vaste budgetrange per categorie (gebruikt na het draaien). Custom = 50k+ */
export const FIXED_BUDGET: Record<CategoryId, string> = {
  touchwall: '€5.000 – €10.000',
  brand: '€10.000 – €25.000',
  projection: '€25.000 – €50.000',
  custom: '€50.000+',
}

/** Labels op het rad: 8 segmenten. Even index = categorie-budget, oneven = opvulling. Pijl stopt altijd op de range van de gekozen categorie. */
export const WHEEL_LABELS: string[] = [
  '€5k – €10k',
  '€15k – €20k',
  '€10k – €25k',
  '€30k – €40k',
  '€25k – €50k',
  '€60k – €80k',
  '€50k+',
  '€100k+',
]

/** Welk segmentindex hoort bij welke categorie (pijl landt altijd hier) */
export const SEGMENT_INDEX_BY_CATEGORY: Record<CategoryId, number> = {
  touchwall: 0,
  brand: 2,
  projection: 4,
  custom: 6,
}
