import { Howl } from 'howler'
import { useGameStore } from '../store/gameStore'

let sounds: Record<string, Howl> = {}

function playFallbackTone(type: 'whoosh' | 'confirm' | 'drum' | 'applause') {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    if (type === 'whoosh') {
      osc.frequency.setValueAtTime(200, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15)
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4)
    } else if (type === 'confirm' || type === 'applause') {
      osc.frequency.setValueAtTime(523, ctx.currentTime)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
    } else {
      osc.frequency.setValueAtTime(150, ctx.currentTime)
      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)
    }
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + (type === 'whoosh' ? 0.4 : 0.25))
  } catch {
    // ignore
  }
}

export function initSounds() {
  try {
    sounds.applause = new Howl({ src: ['/audio/applause.mp3'], volume: 0.6, onloaderror: () => {} })
    sounds.drumroll = new Howl({ src: ['/audio/drumroll.mp3'], volume: 0.5, onloaderror: () => {} })
    sounds.confetti = new Howl({ src: ['/audio/confetti.mp3'], volume: 0.5, onloaderror: () => {} })
    sounds.whoosh = new Howl({ src: ['/audio/whoosh.mp3'], volume: 0.5, onloaderror: () => {} })
    sounds.intro = new Howl({ src: ['/audio/intro.mp3'], volume: 0.4, onloaderror: () => {} })
  } catch {
    // Missing files or Howl not available
  }
}

export function playSound(id: keyof typeof sounds) {
  const enabled = useGameStore.getState().soundEnabled
  if (!enabled) return
  const s = sounds[id]
  const loaded = s && (s as { state?: () => string }).state?.() === 'loaded'
  if (loaded) {
    try {
      s.play()
    } catch {
      fallback(id)
    }
  } else {
    fallback(id)
  }
}

function fallback(id: string) {
  if (id === 'whoosh') playFallbackTone('whoosh')
  else if (id === 'confetti' || id === 'applause') playFallbackTone('confirm')
  else if (id === 'drumroll') playFallbackTone('drum')
}

export function stopSound(id: keyof typeof sounds) {
  const s = sounds[id]
  if (s) s.stop()
}
