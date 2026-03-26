interface StartButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  pulse?: boolean
}

export function StartButton({ label, onClick, disabled, pulse = true }: StartButtonProps) {
  return (
    <button
      type="button"
      className="btn-primary"
      onClick={onClick}
      disabled={disabled}
      style={{
        animation: pulse ? 'pulse 2s ease-in-out infinite' : undefined,
        padding: '18px 36px',
        fontSize: '1.1rem',
      }}
    >
      {label}
    </button>
  )
}
