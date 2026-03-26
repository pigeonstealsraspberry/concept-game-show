import { useMemo, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'
import type { GameStep } from '../../flow/steps'

const W = 1024
const H = 320

function getLEDContent(step: GameStep, formData: { name: string; company: string; email: string; category: string; budget: string }): string {
  switch (step) {
    case 'opening':
      return 'LIVEWALL\nTHE DIGITAL EXPERIENCE SHOW'
    case 'round1_name':
      return formData.name ? formData.name.toUpperCase() : 'WIE STAAT ER OP HET PODIUM?'
    case 'round1_company':
      return formData.company ? `${formData.name.toUpperCase()} – ${formData.company.toUpperCase()}` : 'VAN WELK BEDRIJF?'
    case 'round2_email':
      return formData.email ? formData.email : 'WAT IS JOUW E-MAIL?'
    case 'round3_category':
      return 'KIES JOUW EXPERIENCE'
    case 'round4_wheel':
    case 'round4_confirm':
      return formData.budget ? `JOUW INVESTERING: ${formData.budget}` : 'CONTACT CHALLENGE'
    case 'finale':
      return 'KLAAR OM TE VERSTUREN?'
    case 'review':
      return 'CONTROLEER JOUW GEGEVENS'
    case 'submitted':
      return 'AANVRAAG ONTVANGEN\nTEAM LIVEWALL NEEMT SNEL CONTACT OP'
    default:
      return 'LIVEWALL'
  }
}

export function LEDWall() {
  const step = useGameStore((s) => s.step)
  const formData = useGameStore((s) => s.formData)
  const content = getLEDContent(step, formData)
  const prevContentRef = useRef('')

  const { texture, canvas } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    return { texture, canvas }
  }, [])

  useEffect(() => {
    if (content === prevContentRef.current) return
    prevContentRef.current = content
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#050510'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#00f5ff'
    ctx.font = 'bold 48px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const lines = content.split('\n')
    const lineHeight = 58
    const startY = H / 2 - ((lines.length - 1) * lineHeight) / 2
    lines.forEach((line, i) => {
      ctx.fillText(line, W / 2, startY + i * lineHeight)
    })
    texture.needsUpdate = true
  }, [content, canvas, texture])

  const totalWidth = 56
  const height = 18

  return (
    <group position={[0, 7, -27.4]}>
      <mesh>
        <planeGeometry args={[totalWidth, height]} />
        <meshBasicMaterial map={texture} transparent opacity={0.98} toneMapped={false} />
      </mesh>
    </group>
  )
}
