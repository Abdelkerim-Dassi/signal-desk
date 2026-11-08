import { useRef, useState } from 'react'
import { useI18n } from '../lib/i18n'
import type { Lang } from '../lib/i18n'
import { detectKind, isEvmAddress, scamCheck } from '../lib/scamcheck'
import type { InputKind, Level, ScamResult, Severity } from '../lib/scamcheck'
import { IconShield } from './Icons'

// Strings live here (not in lib/i18n.ts) so this view stays self-contained.
const S = {
  title: { en: 'Is this a scam?', fr: 'Est-ce une arnaque ?', ar: 'هذا تحيّل؟' },
  intro: {
    en: 'Paste a WhatsApp or Telegram message, a link, a platform name or a token address. Qirat lists the warning signs and what to check. It never says something is safe.',
    fr: 'Collez un message WhatsApp ou Telegram, un lien, un nom de plateforme ou une adresse de token. Qirat liste les signaux d’alerte et quoi vérifier. Il ne dit jamais qu’une chose est sûre.',
    ar: 'الصق ميساج WhatsApp ولا Telegram، لينك، اسم منصّة ولا عنوان coin. قيراط يورّيك علامات الخطر وشنوّة لازمك تثبّت، وعمرو ما يقلّك حاجة «مضمونة».',
  },
  placeholder: {
    en: 'e.g. “Guaranteed 5% a day, send USDT to this wallet…” or binance-support.com',
    fr: 'ex. « Gain garanti de 5 % par jour, envoyez vos USDT à cette adresse… » ou binance-support.com',
    ar: 'مثلاً: «ربح مضمون 5% كل نهار، ابعث USDT للـ wallet هذا…» ولا binance-support.com',
  },
  check: { en: 'Check it', fr: 'Vérifier', ar: 'فركس' },
  checking: { en: 'Checking…', fr: 'Vérification…', ar: 'نفركسو…' },
  detected: { en: 'Looks like', fr: 'On dirait', ar: 'يظهر إنّو' },
  'kind.message': { en: 'a message', fr: 'un message', ar: 'ميساج' },
  'kind.link': { en: 'a link', fr: 'un lien', ar: 'لينك' },
  'kind.address': { en: 'a token or wallet address', fr: 'une adresse de token ou de wallet', ar: 'عنوان coin ولا wallet' },
  'kind.platform': { en: 'a platform or company name', fr: 'un nom de plateforme ou de société', ar: 'اسم منصّة ولا شركة' },
  chain: { en: 'Network', fr: 'Réseau', ar: 'الـ network' },
  chainAuto: { en: 'Try the main ones', fr: 'Essayer les principaux', ar: 'جرّب الـ networks الكبار' },
  tryOne: { en: 'Try an example:', fr: 'Essayez un exemple :', ar: 'جرّب مثال:' },
  ex1: { en: 'Guaranteed 3% a day', fr: 'Gain garanti 3 % par jour', ar: 'ربح مضمون 3% كل نهار' },
  ex1Text: {
    en: 'Join our VIP group! Our AI bot gives a guaranteed 3% a day. Minimum deposit 100 USDT, invite 2 friends to unlock withdrawals. Only 10 places left!',
    fr: 'Rejoignez notre groupe VIP ! Notre robot IA donne 3 % par jour garanti. Dépôt minimum 100 USDT, invitez 2 amis pour débloquer les retraits. Plus que 10 places !',
    ar: 'ادخل لمجموعتنا VIP! البوت متاعنا يعطيك ربح مضمون 3% يومياً. أقل إيداع 100 USDT، وجيب 2 من صحابك باش تنجم تسحب. بقات 10 بلايص برك!',
  },
  inPlainWords: { en: 'In plain words', fr: 'En clair', ar: 'بالكلام الساهل' },
  explaining: { en: 'Writing a short explanation…', fr: 'Rédaction d’une courte explication…', ar: 'نكتبو شرح قصير…' },
  flags: { en: 'Warning signs', fr: 'Signaux d’alerte', ar: 'علامات الخطر' },
  checks: { en: 'Before you trust it', fr: 'Avant de faire confiance', ar: 'قبل ما تثق' },
  sources: { en: 'Checked with', fr: 'Vérifié avec', ar: 'فركسنا في' },
  unavailable: { en: 'unavailable right now', fr: 'indisponible pour le moment', ar: 'موش متوفّر توّا' },
  references: { en: 'Warnings behind these flags', fr: 'Mises en garde derrière ces signaux', ar: 'التحذيرات اللي وراء العلامات هاذي' },
  share: { en: 'Share this result', fr: 'Partager ce résultat', ar: 'شارك النتيجة' },
  copied: { en: 'Copied, paste it in your chat', fr: 'Copié, collez-le dans votre discussion', ar: 'تنسخت، الصقها في الـ chat' },
  again: { en: 'Check something else', fr: 'Vérifier autre chose', ar: 'فركس حاجة أخرى' },
  shareHead: { en: 'Qirat scam check', fr: 'Vérif arnaque Qirat', ar: 'فحص الاحتيال متاع قيراط' },
  shareFoot: { en: 'Check yours for free', fr: 'Vérifiez gratuitement', ar: 'فركس متاعك بلاش' },
  tooMany: { en: 'Too many checks in a short time. Try again in a minute.', fr: 'Trop de vérifications d’un coup. Réessayez dans une minute.', ar: 'فركست برشا في وقت قصير. عاود بعد دقيقة.' },
  failed: { en: 'The check failed. Please try again.', fr: 'La vérification a échoué. Réessayez.', ar: 'الفحص ما نجحش. عاود مرّة أخرى.' },
  'sev.high': { en: 'Serious', fr: 'Grave', ar: 'خطير' },
  'sev.medium': { en: 'Warning', fr: 'Attention', ar: 'انتبه' },
  'sev.low': { en: 'Minor', fr: 'Mineur', ar: 'خفيف' },
  'sev.info': { en: 'Note', fr: 'Note', ar: 'ملاحظة' },
} satisfies Record<string, Record<Lang, string>>

type Key = keyof typeof S

const CHAINS: { id: string; label: string }[] = [
  { id: '', label: '' },
  { id: 'eth', label: 'Ethereum' },
  { id: 'bsc', label: 'BNB Chain' },
  { id: 'base', label: 'Base' },
  { id: 'polygon', label: 'Polygon' },
  { id: 'arbitrum', label: 'Arbitrum' },
]

const EXAMPLES = ['binance-support.com', 'ELINOJA PATRIMOINE']

const LEVEL_STYLE: Record<Level, { band: string; icon: string; tint: string }> = {
  high: { band: 'bg-down', icon: 'text-down', tint: 'bg-down/8' },
  medium: { band: 'bg-warn', icon: 'text-warn', tint: 'bg-warn/8' },
  low: { band: 'bg-gold-bright', icon: 'text-gold', tint: 'bg-gold-soft' },
  none: { band: 'bg-gold-bright', icon: 'text-gold', tint: 'bg-gold-soft' },
}

const SEV_DOT: Record<Severity, string> = {
  high: 'bg-down',
  medium: 'bg-warn',
  low: 'bg-gold-bright',
  info: 'bg-neutral',
}

function shareText(r: ScamResult, s: (k: Key) => string): string {
  const lines = [`🛡 ${s('shareHead')}: ${r.verdict}`]
  for (const f of r.flags.filter((f) => f.severity === 'high' || f.severity === 'medium').slice(0, 4)) {
    lines.push(`• ${f.title}`)
  }
  lines.push('', r.disclaimer, `${s('shareFoot')}: https://qirat.tn/#scamcheck`)
  return lines.join('\n')
}

export default function ScamCheckView() {
  const { lang } = useI18n()
  const s = (k: Key) => S[k][lang]
  const [input, setInput] = useState('')
  const [chain, setChain] = useState('')
  const [result, setResult] = useState<ScamResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [explaining, setExplaining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [manualShare, setManualShare] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const resultRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const kind: InputKind | null = detectKind(input)

  const run = async (text = input) => {
    const value = text.trim()
    if (!value || loading) return
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setLoading(true)
    setError(null)
    setCopied(false)
    setManualShare(null)
    setExplaining(false)
    const net = isEvmAddress(value) ? chain : undefined
    try {
      // Rules and lookups first (fast), then the plain-words explanation.
      const r = await scamCheck(value, lang, net, ctrl.signal)
      setResult(r)
      window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
      if (r.level === 'high' || r.level === 'medium') {
        setExplaining(true)
        scamCheck(value, lang, net, ctrl.signal, true)
          .then((full) => {
            if (!ctrl.signal.aborted && full.explanation) setResult((prev) => (prev ? { ...prev, explanation: full.explanation } : prev))
          })
          .catch(() => {})
          .finally(() => {
            if (!ctrl.signal.aborted) setExplaining(false)
          })
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      const status = (e as { status?: number }).status
      setError(status === 429 ? s('tooMany') : s('failed'))
    } finally {
      setLoading(false)
    }
  }

  const share = async () => {
    if (!result) return
    const text = shareText(result, s)
    try {
      if (navigator.share) {
        await navigator.share({ text })
        return
      }
    } catch {
      return // the user closed the share sheet
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setManualShare(text) // clipboard blocked: show the text to copy by hand
    }
  }

  const reset = () => {
    abortRef.current?.abort()
    setExplaining(false)
    setManualShare(null)
    setCopied(false)
    setResult(null)
    setInput('')
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    inputRef.current?.focus()
  }

  const style = result ? LEVEL_STYLE[result.level] : LEVEL_STYLE.none
  const checked = result?.sources.filter((x) => x.status !== 'reference') ?? []
  const refs = result?.sources.filter((x) => x.status === 'reference') ?? []

  return (
    <div className="space-y-5">
      <section className="card hero-wash rise p-5">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <IconShield className="text-gold" /> {s('title')}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{s('intro')}</p>

        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            run()
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) run()
            }}
            dir="auto"
            rows={4}
            maxLength={4000}
            placeholder={s('placeholder')}
            aria-label={s('title')}
            className="w-full resize-y rounded-2xl border border-border bg-card px-4 py-3 text-[15px] outline-none transition placeholder:text-muted/70 focus:border-border-strong focus:ring-2 focus:ring-gold-soft"
          />
          <div className="flex flex-wrap items-center gap-2">
            {kind && (
              <span className="rounded-full bg-subtle px-3 py-1 text-xs text-muted">
                {s('detected')} <span className="font-medium text-text">{s(`kind.${kind}` as Key)}</span>
              </span>
            )}
            {kind === 'address' && isEvmAddress(input) && (
              <label className="flex items-center gap-1.5 text-xs text-muted">
                {s('chain')}
                <select
                  value={chain}
                  onChange={(e) => setChain(e.target.value)}
                  className="cursor-pointer rounded-full border border-border bg-card px-2 py-1 text-xs text-text"
                >
                  {CHAINS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id ? c.label : s('chainAuto')}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="ms-auto cursor-pointer rounded-full bg-text px-5 py-2 text-sm font-medium text-bg transition hover:opacity-90 disabled:cursor-default disabled:opacity-40"
            >
              {loading ? s('checking') : s('check')}
            </button>
          </div>
        </form>

        {!result && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>{s('tryOne')}</span>
            {[s('ex1'), ...EXAMPLES].map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  const text = i === 0 ? s('ex1Text') : label
                  setInput(text)
                  run(text)
                }}
                className="cursor-pointer rounded-full border border-border px-3 py-1 text-text transition hover:border-border-strong hover:bg-gold-soft"
                dir="auto"
              >
                {label}
              </button>
            ))}
          </div>
        )}
        {error && <p className="mt-3 text-sm text-warn">{error}</p>}
      </section>

      {result && (
        <section ref={resultRef} className="card rise scroll-mt-20 overflow-hidden" aria-live="polite">
          <div className={`h-1.5 ${style.band}`} />
          <div className="space-y-5 p-5">
            <div className="flex items-start gap-3">
              <span className={`grid size-11 shrink-0 place-items-center rounded-full text-2xl ${style.tint} ${style.icon}`}>
                <IconShield />
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold">{result.verdict}</h2>
                <p className="text-sm text-muted">{result.disclaimer}</p>
              </div>
            </div>

            {(result.explanation || explaining) && (
              <div className="rounded-2xl bg-subtle p-4">
                <p className="tick-label">{s('inPlainWords')}</p>
                {result.explanation ? (
                  <p className="mt-1 text-[15px] whitespace-pre-line" dir="auto">
                    {result.explanation}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-muted">
                    {s('explaining')}
                    <span className="caret">▋</span>
                  </p>
                )}
              </div>
            )}

            {result.flags.length > 0 && (
              <div>
                <h3 className="tick-label">{s('flags')}</h3>
                <ul className="mt-2 divide-y divide-border">
                  {result.flags.map((f, i) => (
                    <li key={`${f.id}-${i}`} className="flex gap-3 py-3">
                      <span className={`mt-2 size-2.5 shrink-0 rounded-full ${SEV_DOT[f.severity]}`} aria-hidden />
                      <div className="min-w-0">
                        <p className="font-medium">
                          {f.title}
                          <span className="ms-2 align-middle text-[11px] font-normal text-muted">{s(`sev.${f.severity}` as Key)}</span>
                        </p>
                        <p className="mt-0.5 text-sm text-muted">{f.detail}</p>
                        {f.source?.url && (
                          <a
                            href={f.source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-block text-xs text-gold underline underline-offset-2"
                          >
                            {f.source.name}
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.checks.length > 0 && (
              <div className="rounded-2xl border border-border-strong bg-gold-soft/60 p-4">
                <h3 className="tick-label">{s('checks')}</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {result.checks.map((c) => (
                    <li key={c} className="flex gap-2">
                      <span className="mt-0.5 text-gold" aria-hidden>
                        ✓
                      </span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-1 text-xs text-muted">
              {checked.length > 0 && (
                <p>
                  {s('sources')}:{' '}
                  {checked.map((x, i) => (
                    <span key={x.id}>
                      {i > 0 && ' · '}
                      {x.url ? (
                        <a href={x.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-gold">
                          {x.name}
                        </a>
                      ) : (
                        x.name
                      )}
                      {x.status === 'unavailable' && ` (${s('unavailable')})`}
                    </span>
                  ))}
                </p>
              )}
              {refs.length > 0 && (
                <p>
                  {s('references')}:{' '}
                  {refs.map((x, i) => (
                    <span key={x.url}>
                      {i > 0 && ' · '}
                      <a href={x.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-gold">
                        {x.name}
                      </a>
                    </span>
                  ))}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <button
                onClick={share}
                className="cursor-pointer rounded-full bg-text px-4 py-2 text-sm font-medium text-bg transition hover:opacity-90"
              >
                {s('share')}
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText(result, s))}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:border-border-strong"
              >
                WhatsApp
              </a>
              <button
                onClick={reset}
                className="cursor-pointer rounded-full border border-border-strong px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold-soft"
              >
                {s('again')}
              </button>
              {copied && <span className="text-xs text-muted">{s('copied')}</span>}
            </div>
            {manualShare && (
              <textarea
                readOnly
                value={manualShare}
                rows={5}
                dir="auto"
                onFocus={(e) => e.currentTarget.select()}
                aria-label={s('share')}
                className="w-full rounded-2xl border border-border bg-subtle p-3 text-sm"
              />
            )}
          </div>
        </section>
      )}
    </div>
  )
}
