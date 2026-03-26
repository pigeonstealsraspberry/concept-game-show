export type GameStep =
  | 'opening'
  | 'round1_name'
  | 'round1_company'
  | 'round2_email'
  | 'round3_category'
  | 'round4_wheel'
  | 'round4_confirm'
  | 'finale'
  | 'review'
  | 'submitted'

export const STEP_ORDER: GameStep[] = [
  'opening',
  'round1_name',
  'round1_company',
  'round2_email',
  'round3_category',
  'round4_wheel',
  'round4_confirm',
  'finale',
  'review',
  'submitted',
]

export function getNextStep(step: GameStep): GameStep | null {
  const i = STEP_ORDER.indexOf(step)
  if (i < 0 || i >= STEP_ORDER.length - 1) return null
  return STEP_ORDER[i + 1]
}

export function getStepIndex(step: GameStep): number {
  return STEP_ORDER.indexOf(step)
}
