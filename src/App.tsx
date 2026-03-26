import { Canvas } from '@react-three/fiber'
import { StudioScene } from './scenes/StudioScene'
import { CameraRig } from './components/CameraRig'
import { OverlayUI } from './components/ui/OverlayUI'
import { SoundToggle } from './components/ui/SoundToggle'
import { initSounds } from './audio/sounds'

initSounds()

function Scene() {
  return (
    <>
      <CameraRig />
      <StudioScene />
    </>
  )
}

export default function App() {
  return (
    <>
      <Canvas
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 4, 18], fov: 50, near: 0.1, far: 1000 }}
        shadows
        dpr={[1, Math.min(2, window.devicePixelRatio)]}
      >
        <Scene />
      </Canvas>
      <OverlayUI />
      <SoundToggle />
    </>
  )
}
