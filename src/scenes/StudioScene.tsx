import { StudioEnvironment } from '../components/studio/StudioEnvironment'
import { LightsRig } from '../components/studio/LightsRig'
import { Podium } from '../components/studio/Podium'
import { GameShowDesks } from '../components/studio/GameShowDesks'
import { LEDWall } from '../components/studio/LEDWall'
import { AudienceCircle } from '../components/studio/AudienceCircle'
import { Host } from '../components/characters/Host'
import { PlayerAvatar } from '../components/characters/PlayerAvatar'
import { CategoryPlatforms } from '../components/props/CategoryPlatforms'
import { BudgetWheel } from '../components/props/BudgetWheel'
import { useGameStore } from '../store/gameStore'

export function StudioScene() {
  const step = useGameStore((s) => s.step)

  return (
    <>
      <StudioEnvironment />
      <LightsRig />
      <Podium />
      <GameShowDesks />
      <LEDWall />
      <AudienceCircle />
      <Host />
      <PlayerAvatar />
      {step === 'round3_category' && <CategoryPlatforms />}
      {step === 'round4_wheel' && <BudgetWheel />}
    </>
  )
}
