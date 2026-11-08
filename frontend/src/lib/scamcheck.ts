// Scam check API client and input-type detection. Mirrors server/scamcheck.py.

export type Severity = 'high' | 'medium' | 'low' | 'info'
export type Level = 'high' | 'medium' | 'low' | 'none'
export type InputKind = 'message' | 'link' | 'address' | 'platform'

export interface ScamFlag {
  id: string
  severity: Severity
  title: string
  detail: string
  evidence?: string | null
  source?: { name: string; url: string } | null
}

export interface ScamSource {
  id: string
  name: string
  url: string
  status: 'checked' | 'match' | 'unavailable' | 'reference'
}

export interface ScamResult {
  ok: true
  language: string
  kinds: string[]
  level: Level
  verdict: string
  flags: ScamFlag[]
  checks: string[]
  sources: ScamSource[]
  disclaimer: string
  explanation?: string | null
  links: string[]
  addresses: string[]
}

const EVM = /^0x[a-fA-F0-9]{40}$/
const TRON = /^T[1-9A-HJ-NP-Za-km-z]{33}$/
const SOL = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
const LINK = /^(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,24}(?:[/?#]\S*)?$/i

/** What the user pasted, guessed locally so the UI can label it as they type. */
export function detectKind(raw: string): InputKind | null {
  const s = raw.trim()
  if (!s) return null
  if (EVM.test(s) || TRON.test(s) || (SOL.test(s) && /\d/.test(s) && /[a-z]/.test(s) && /[A-Z]/.test(s))) return 'address'
  if (!/\s/.test(s) && LINK.test(s)) return 'link'
  if (s.length <= 40 && s.split(/\s+/).length <= 4 && !/[.!?؟]$/.test(s)) return 'platform'
  return 'message'
}

export const isEvmAddress = (s: string) => EVM.test(s.trim())

export async function scamCheck(
  text: string,
  language: string,
  chain?: string,
  signal?: AbortSignal,
  explain = false,
): Promise<ScamResult> {
  const res = await fetch('/api/scamcheck', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language, chain: chain || undefined, explain }),
    signal,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok) {
    const err = new Error(data?.error || `Check failed (${res.status})`) as Error & { status?: number }
    err.status = res.status
    throw err
  }
  return data as ScamResult
}
