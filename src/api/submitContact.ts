import type { FormData } from '../store/gameStore'

const API_URL = import.meta.env.VITE_LIVEWALL_API_URL || ''

export async function submitContact(data: FormData): Promise<void> {
  const url = API_URL || '/api/contact'
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      company: data.company,
      email: data.email,
      category: data.category,
      budget: data.budget,
    }),
  })
  if (!res.ok) {
    throw new Error(res.statusText || 'Request failed')
  }
}
