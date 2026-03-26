import { useGameStore } from '../../store/gameStore'

export function SoundToggle() {
  const soundEnabled = useGameStore((s) => s.soundEnabled)
  const setSoundEnabled = useGameStore((s) => s.setSoundEnabled)

  return (
    <button
      type="button"
      className="sound-toggle"
      onClick={() => setSoundEnabled(!soundEnabled)}
      aria-label={soundEnabled ? 'Geluid uit' : 'Geluid aan'}
    >
      {soundEnabled ? '🔊' : '🔇'}
    </button>
  )
}
