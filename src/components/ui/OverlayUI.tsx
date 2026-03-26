import { useState, useEffect } from 'react'
import { useGameStore, INPUT_ROUNDS } from '../../store/gameStore'
import { StartButton } from './StartButton'
import { isValidEmail } from '../../flow/roundHandlers'
import { submitContact } from '../../api/submitContact'
import { playSound } from '../../audio/sounds'
import { CATEGORIES } from '../../config/budgetRanges'

export function OverlayUI() {
  const step = useGameStore((s) => s.step)
  const formData = useGameStore((s) => s.formData)
  const setFormField = useGameStore((s) => s.setFormField)
  const nextStep = useGameStore((s) => s.nextStep)
  const resetToRound3 = useGameStore((s) => s.resetToRound3)
  const reset = useGameStore((s) => s.reset)
  const setStep = useGameStore((s) => s.setStep)
  const setSubmitted = useGameStore((s) => s.setSubmitted)
  const submitLoading = useGameStore((s) => s.submitLoading)
  const setSubmitLoading = useGameStore((s) => s.setSubmitLoading)
  const requestSpinWheel = useGameStore((s) => s.requestSpinWheel)
  const spinWheelRequest = useGameStore((s) => s.spinWheelRequest)
  const overlayPhase = useGameStore((s) => s.overlayPhase)
  const setOverlayPhase = useGameStore((s) => s.setOverlayPhase)

  const [nameInput, setNameInput] = useState('')
  const [companyInput, setCompanyInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!INPUT_ROUNDS.includes(step)) return
    const t1 = setTimeout(() => setOverlayPhase('question'), 2500)
    const t2 = setTimeout(() => setOverlayPhase('answer'), 5000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [step, setOverlayPhase])

  const handleStart = () => {
    playSound('whoosh')
    nextStep()
  }

  const handleConfirmName = () => {
    const v = nameInput.trim()
    if (!v) return
    setFormField('name', v)
    playSound('confetti')
    nextStep()
  }

  const handleConfirmCompany = () => {
    const v = companyInput.trim()
    if (!v) return
    setFormField('company', v)
    playSound('applause')
    nextStep()
  }

  const handleConfirmEmail = () => {
    const v = emailInput.trim()
    if (!isValidEmail(v)) {
      setError('Voer een geldig e-mailadres in.')
      return
    }
    setError('')
    setFormField('email', v)
    playSound('drumroll')
    nextStep()
  }

  const handleLaunch = async () => {
    setError('')
    setSubmitLoading(true)
    try {
      await submitContact(formData)
      playSound('confetti')
      setSubmitted(true)
      setStep('submitted')
    } catch (e) {
      setError('Versturen mislukt. Probeer het opnieuw.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleOtherExperience = () => {
    resetToRound3()
  }

  const hostIntro: Record<string, string> = {
    round1_name: 'Presentator: Welkom op het podium!',
    round1_company: 'Presentator: Geweldig dat je er bent.',
    round2_email: formData.name && formData.company ? `Presentator: Applaus voor ${formData.name} van ${formData.company}!` : 'Presentator: Laten we doorgaan.',
    round3_category: 'Presentator: Tijd voor de volgende stap.',
    round4_wheel: 'Presentator: Het moment van de waarheid!',
  }
  const hostQuestion: Record<string, string> = {
    opening: 'Welkom bij LIVEWALL: The Digital Experience Show! Klaar om jouw experience tot leven te brengen?',
    round1_name: 'Presentator: Wie staat er vandaag op het podium?',
    round1_company: 'Presentator: Van welk bedrijf kom je?',
    round2_email: 'Presentator: Wat is jouw e-mailadres?',
    round3_category: 'Presentator: Kies jouw experience – welke past bij jou?',
    round4_wheel: 'Presentator: Draai het rad voor jouw budget!',
    round4_confirm: 'Presentator: Is dit jouw budget? Of kies een andere experience.',
    finale: 'Presentator: Klaar? Bekijk je gegevens en verstuur je aanvraag.',
    review: 'Controleer alles en verstuur.',
  }
  const subtitle = step === 'opening' ? hostQuestion.opening : null
  /* Presentator-tekst altijd onderaan */
  const hostTextBottomStyle = {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: '20px 24px 28px',
    textAlign: 'center' as const,
    color: 'rgba(255,255,255,0.95)',
    fontSize: 'clamp(15px, 2.6vw, 19px)',
    lineHeight: 1.5,
    zIndex: 10,
    maxWidth: '100%',
    background: 'linear-gradient(180deg, transparent 0%, rgba(10,10,18,0.92) 40%)',
  } as const
  /* Zone voor knoppen/invoer: onder het grote scherm (LED), iets lager, boven de presentatortekst */
  const answerLayout = {
    position: 'fixed' as const,
    inset: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    zIndex: 10,
    paddingTop: 'min(34vh, 280px)',
    paddingBottom: 100,
  } as const
  const controlsBlockStyle = {
    flex: 1,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: '24px 20px',
    minHeight: 100,
  }
  /* Bij het rad: knop altijd vooraan (eigen laag), geen overlap met prijzen; boven presentatortekst */
  const wheelAnswerLayout = {
    position: 'fixed' as const,
    inset: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'flex-end' as const,
    zIndex: 10,
    paddingBottom: 100,
    paddingTop: '42vh',
  } as const
  const wheelControlsStyle = {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 16,
    padding: '20px 24px',
    zIndex: 20,
    background: 'linear-gradient(180deg, transparent 0%, rgba(10,10,18,0.97) 12%)',
    width: '100%',
    boxSizing: 'border-box' as const,
  }

  const categoryLabel = formData.category ? CATEGORIES.find((c) => c.id === formData.category)?.label ?? formData.category : ''

  if (step === 'opening') {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          zIndex: 10,
          pointerEvents: 'none',
          padding: '0 24px 28px',
          gap: 20,
          background: 'linear-gradient(180deg, transparent 0%, rgba(10,10,18,0.4) 60%)',
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <StartButton label="START MIJN EXPERIENCE" onClick={handleStart} />
        </div>
        {subtitle && (
          <p style={{ margin: 0, maxWidth: '92%', textAlign: 'center', color: 'rgba(255,255,255,0.95)', fontSize: 'clamp(14px, 2.5vw, 18px)', lineHeight: 1.5, textShadow: '0 0 20px rgba(0,245,255,0.4)' }}>
            {subtitle}
          </p>
        )}
      </div>
    )
  }

  if (step === 'round1_name') {
    if (overlayPhase === 'intro') {
      return <p className="overlay-answer-in" style={hostTextBottomStyle}>{hostIntro.round1_name}</p>
    }
    if (overlayPhase === 'question') {
      return <p className="overlay-answer-in" style={hostTextBottomStyle}>{hostQuestion.round1_name}</p>
    }
    return (
      <div style={answerLayout}>
        <div className="overlay-answer-in" style={controlsBlockStyle}>
          <input
            type="text"
            className="overlay-input"
            placeholder="Jouw naam"
            value={nameInput}
            onChange={(e) => { setNameInput(e.target.value); setFormField('name', e.target.value) }}
            onKeyDown={(e) => e.key === 'Enter' && handleConfirmName()}
          />
          <button type="button" className="btn-primary" onClick={handleConfirmName}>Bevestigen</button>
        </div>
        <p style={hostTextBottomStyle}>{hostQuestion.round1_name}</p>
      </div>
    )
  }

  if (step === 'round1_company') {
    if (overlayPhase === 'intro') {
      return <p className="overlay-answer-in" style={hostTextBottomStyle}>{hostIntro.round1_company}</p>
    }
    if (overlayPhase === 'question') {
      return <p className="overlay-answer-in" style={hostTextBottomStyle}>{hostQuestion.round1_company}</p>
    }
    return (
      <div style={answerLayout}>
        <div className="overlay-answer-in" style={controlsBlockStyle}>
          <input type="text" className="overlay-input" placeholder="Bedrijfsnaam" value={companyInput} onChange={(e) => { setCompanyInput(e.target.value); setFormField('company', e.target.value) }} onKeyDown={(e) => e.key === 'Enter' && handleConfirmCompany()} />
          <button type="button" className="btn-primary" onClick={handleConfirmCompany}>Bevestigen</button>
        </div>
        <p style={hostTextBottomStyle}>{hostQuestion.round1_company}</p>
      </div>
    )
  }

  if (step === 'round2_email') {
    if (overlayPhase === 'intro') {
      return <p className="overlay-answer-in" style={hostTextBottomStyle}>{hostIntro.round2_email}</p>
    }
    if (overlayPhase === 'question') {
      return <p className="overlay-answer-in" style={hostTextBottomStyle}>{hostQuestion.round2_email}</p>
    }
    return (
      <div style={answerLayout}>
        <div className="overlay-answer-in" style={controlsBlockStyle}>
          {error && <p style={{ color: '#f87171', margin: 0 }}>{error}</p>}
          <input type="email" className="overlay-input" placeholder="E-mailadres" value={emailInput} onChange={(e) => { setEmailInput(e.target.value); setFormField('email', e.target.value) }} onKeyDown={(e) => e.key === 'Enter' && handleConfirmEmail()} />
          <button type="button" className="btn-primary" onClick={handleConfirmEmail}>Bevestigen</button>
        </div>
        <p style={hostTextBottomStyle}>{hostQuestion.round2_email}</p>
      </div>
    )
  }

  if (step === 'round3_category') {
    if (overlayPhase === 'intro') {
      return <p className="overlay-answer-in" style={hostTextBottomStyle}>{hostIntro.round3_category}</p>
    }
    if (overlayPhase === 'question') {
      return <p className="overlay-answer-in" style={hostTextBottomStyle}>{hostQuestion.round3_category}</p>
    }
    return (
      <div style={{ ...answerLayout, paddingTop: 'min(32vh, 260px)' }}>
        <div className="overlay-answer-in" style={{ ...controlsBlockStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 480, width: '100%' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => { setFormField('category', cat.id); nextStep() }}
              className="btn-primary"
              style={{ padding: '20px 16px', minHeight: 72, fontSize: 'clamp(13px, 2vw, 15px)', fontWeight: 600, textAlign: 'center', lineHeight: 1.3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {cat.label.replace(' Experience', '').replace(' Digitale', '')}
            </button>
          ))}
        </div>
        <p style={hostTextBottomStyle}>{hostQuestion.round3_category}</p>
      </div>
    )
  }

  if (step === 'round4_wheel') {
    if (overlayPhase === 'intro') {
      return <p className="overlay-answer-in" style={hostTextBottomStyle}>{hostIntro.round4_wheel}</p>
    }
    if (overlayPhase === 'question') {
      return <p className="overlay-answer-in" style={hostTextBottomStyle}>{hostQuestion.round4_wheel}</p>
    }
    const showTrekButton = spinWheelRequest === 0
    return (
      <div style={wheelAnswerLayout}>
        {showTrekButton && (
          <div className="overlay-answer-in" style={wheelControlsStyle}>
            <button
              type="button"
              onClick={() => { playSound('drumroll'); requestSpinWheel() }}
              className="btn-primary"
              style={{
                padding: '20px 48px',
                fontSize: 'clamp(18px, 2.5vw, 22px)',
                fontWeight: 'bold',
                borderRadius: 16,
                border: '3px solid #eab308',
                background: 'linear-gradient(180deg, #dc2626, #b91c1c)',
                color: '#fff',
                boxShadow: '0 0 30px rgba(234,179,8,0.5)',
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              TREK!
            </button>
          </div>
        )}
        <p style={hostTextBottomStyle}>{hostQuestion.round4_wheel}</p>
      </div>
    )
  }

  if (step === 'round4_confirm') {
    return (
      <div style={wheelAnswerLayout}>
        <div className="overlay-answer-in" style={{ ...wheelControlsStyle, gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>Jouw investering</div>
            <div style={{ color: '#00f5ff', fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 'bold' }}>{formData.budget || '–'}</div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <StartButton label="DIT IS PERFECT" onClick={() => nextStep()} pulse={false} />
            <button type="button" className="btn-primary" onClick={handleOtherExperience}>
              KIES ANDERE EXPERIENCE
            </button>
          </div>
        </div>
        <p style={hostTextBottomStyle}>{hostQuestion.round4_confirm}</p>
      </div>
    )
  }

  if (step === 'finale') {
    return (
      <div style={answerLayout}>
        <div style={controlsBlockStyle}>
          <StartButton
            label="BEKIJK JE GEGEVENS"
            onClick={() => nextStep()}
            pulse={true}
          />
        </div>
        <p style={hostTextBottomStyle}>{hostQuestion.finale}</p>
      </div>
    )
  }

  if (step === 'review') {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          background: 'rgba(10,10,18,0.95)',
          paddingBottom: 100,
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 20px' }}>
          <h2 style={{ color: '#00f5ff', fontSize: 'clamp(16px, 2.5vw, 20px)', marginBottom: 16, textAlign: 'center' }}>
            Controleer je gegevens
          </h2>
          <div
            style={{
              width: '100%',
              maxWidth: 340,
              background: 'rgba(30,30,45,0.9)',
              borderRadius: 12,
              border: '2px solid rgba(0,245,255,0.35)',
              padding: '18px 16px',
              marginBottom: 18,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 2 }}>Naam</div>
                <div style={{ color: '#fff', fontSize: 14 }}>{formData.name || '–'}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 2 }}>Bedrijf</div>
                <div style={{ color: '#fff', fontSize: 14 }}>{formData.company || '–'}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 2 }}>E-mail</div>
                <div style={{ color: '#fff', fontSize: 14 }}>{formData.email || '–'}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 2 }}>Experience</div>
                <div style={{ color: '#fff', fontSize: 14 }}>{categoryLabel || '–'}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 2 }}>Budget</div>
                <div style={{ color: '#00f5ff', fontSize: 14, fontWeight: 600 }}>{formData.budget || '–'}</div>
              </div>
            </div>
          </div>
          {error && <p style={{ color: '#f87171', marginBottom: 6, fontSize: 13 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                reset()
                setNameInput('')
                setCompanyInput('')
                setEmailInput('')
                setError('')
              }}
              style={{ padding: '12px 20px', fontSize: 14 }}
            >
              OPNIEUW BEGINNEN
            </button>
            <StartButton
              label="VERSTUUR AANVRAAG"
              onClick={handleLaunch}
              disabled={submitLoading}
              pulse={!submitLoading}
            />
          </div>
        </div>
        <p style={hostTextBottomStyle}>{hostQuestion.review}</p>
      </div>
    )
  }

  if (step === 'submitted') {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(10,10,15,0.9)',
          zIndex: 20,
        }}
      >
        <p style={{ fontSize: '1.5rem', color: '#00f5ff' }}>
          Aanvraag ontvangen. Team LiveWall neemt snel contact op.
        </p>
      </div>
    )
  }

  return null
}
