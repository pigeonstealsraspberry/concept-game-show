import { create } from 'zustand'
import type { GameStep } from '../flow/steps'
import { getNextStep } from '../flow/steps'

export interface FormData {
  name: string
  company: string
  email: string
  category: string
  budget: string
}

export type OverlayPhase = 'intro' | 'question' | 'answer'

export const INPUT_ROUNDS: GameStep[] = ['round1_name', 'round1_company', 'round2_email', 'round3_category', 'round4_wheel']

interface GameState {
  step: GameStep
  formData: FormData
  wheelSpun: boolean
  submitted: boolean
  soundEnabled: boolean
  submitLoading: boolean
  spinWheelRequest: number
  overlayPhase: OverlayPhase
  setFormField: <K extends keyof FormData>(key: K, value: FormData[K]) => void
  nextStep: () => void
  setStep: (step: GameStep) => void
  setOverlayPhase: (p: OverlayPhase) => void
  resetToRound3: () => void
  setWheelSpun: (v: boolean) => void
  setSubmitted: (v: boolean) => void
  setSoundEnabled: (v: boolean) => void
  setSubmitLoading: (v: boolean) => void
  requestSpinWheel: () => void
  reset: () => void
}

const initialFormData: FormData = {
  name: '',
  company: '',
  email: '',
  category: '',
  budget: '',
}

export const useGameStore = create<GameState>((set) => ({
  step: 'opening',
  formData: initialFormData,
  wheelSpun: false,
  submitted: false,
  soundEnabled: false,
  submitLoading: false,
  spinWheelRequest: 0,
  overlayPhase: 'answer',
  setFormField: (key, value) =>
    set((s) => ({ formData: { ...s.formData, [key]: value } })),
  nextStep: () =>
    set((s) => {
      const next = getNextStep(s.step)
      return next ? { step: next, overlayPhase: INPUT_ROUNDS.includes(next) ? 'intro' : 'answer' } : {}
    }),
  setStep: (step) => set({ step, overlayPhase: INPUT_ROUNDS.includes(step) ? 'intro' : 'answer' }),
  setOverlayPhase: (overlayPhase) => set({ overlayPhase }),
  resetToRound3: () =>
    set((s) => ({
      step: 'round3_category',
      wheelSpun: false,
      spinWheelRequest: 0,
      overlayPhase: 'intro',
      formData: { ...s.formData, category: '', budget: '' },
    })),
  setWheelSpun: (v) => set({ wheelSpun: v }),
  setSubmitted: (v) => set({ submitted: v }),
  setSoundEnabled: (v) => set({ soundEnabled: v }),
  setSubmitLoading: (v) => set({ submitLoading: v }),
  requestSpinWheel: () => set({ spinWheelRequest: Date.now() }),
  reset: () =>
    set({
      step: 'opening',
      formData: initialFormData,
      wheelSpun: false,
      submitted: false,
      spinWheelRequest: 0,
      overlayPhase: 'answer',
    }),
}))
