export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 9 && digits.length <= 15
}

export function formatBudgetDisplay(budget: string): string {
  if (!budget) return '—'
  if (budget.includes('–') || budget.includes('-')) return budget
  return `€${budget}`
}
