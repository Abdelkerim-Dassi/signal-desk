import { useRef, useState } from 'react'
import { useI18n } from '../lib/i18n'
import type { Lang } from '../lib/i18n'
import { INVITE } from '../lib/invite'
import { detectKind, isEvmAddress, scamCheck } from '../lib/scamcheck'
import type { InputKind, Level, ScamResult, Severity } from '../lib/scamcheck'
import { track } from '../lib/source'
import Caption from './brand/Caption'
import MascotSays from './MascotSays'
import Ticket from './Ticket'

// Strings live here (not in lib/i18n.ts) so this view stays self-contained.
const S = {
  // The caption: the word inside [[double brackets]] sits on the gold marker.
  title: { en: 'Is this a [[scam]]?', fr: 'Est-ce une [[arnaque]] ?', ar: 'هل هذا [[احتيال]]؟' },
  // What a check gives, and what it never gives. What to paste is shown by the
  // box's own hint and the three examples under the button.
  intro: {
    en: 'Qirat lists the warning signs and what to check. It never says something is safe.',
    fr: 'Qirat montre les signaux d’alerte et ce qu’il faut vérifier. Il ne dit jamais qu’une chose est sûre.',
    ar: 'قيراط يعرض لك علامات الخطر وما يجب أن تتحقق منه، ولا يقول لك أبدًا إن شيئًا ما «آمن».',
  },
  placeholder: {
    en: 'e.g. “Guaranteed 5% a day, send USDT to this wallet…” or binance-support.com',
    fr: 'ex. « Gain garanti de 5 % par jour, envoyez vos USDT à cette adresse… » ou binance-support.com',
    ar: 'مثلًا: «ربح مضمون 5% يوميًا، أرسل USDT إلى هذه المحفظة…» أو binance-support.com',
  },
  check: { en: 'Check it', fr: 'Vérifier', ar: 'تحقّق' },
  checking: { en: 'Checking…', fr: 'Vérification…', ar: 'جارٍ التحقق…' },
  detected: { en: 'Looks like', fr: 'On dirait', ar: 'على الأرجح:' },
  'kind.message': { en: 'a message', fr: 'un message', ar: 'رسالة' },
  'kind.link': { en: 'a link', fr: 'un lien', ar: 'رابط' },
  'kind.address': { en: 'a coin or wallet address', fr: 'une adresse de crypto ou de portefeuille', ar: 'عنوان عملة أو محفظة' },
  'kind.platform': { en: 'a platform or company name', fr: 'un nom de plateforme ou de société', ar: 'اسم منصة أو شركة' },
  chain: { en: 'Network', fr: 'Réseau', ar: 'الشبكة' },
  chainAuto: { en: 'Try the main ones', fr: 'Essayer les principaux', ar: 'جرّب الشبكات الرئيسية' },
  tryOne: { en: 'Try an example:', fr: 'Essayez un exemple :', ar: 'جرّب مثالًا:' },
  ex1: { en: 'Guaranteed 3% a day', fr: 'Gain garanti 3 % par jour', ar: 'ربح مضمون 3% يوميًا' },
  ex1Text: {
    en: 'Join our VIP group! Our AI bot gives a guaranteed 3% a day. Minimum deposit 100 USDT, invite 2 friends to unlock withdrawals. Only 10 places left!',
    fr: 'Rejoignez notre groupe VIP ! Notre robot IA donne 3 % par jour garanti. Dépôt minimum 100 USDT, invitez 2 amis pour débloquer les retraits. Plus que 10 places !',
    ar: 'انضم إلى مجموعتنا VIP! البوت الخاص بنا يعطيك ربحًا مضمونًا 3% يوميًا. أقل إيداع 100 USDT، وادعُ 2 من أصدقائك لتتمكن من السحب. بقيت 10 أماكن فقط!',
  },
  inPlainWords: { en: 'In plain words', fr: 'En clair', ar: 'بكلمات بسيطة' },
  explaining: { en: 'Writing a short explanation…', fr: 'Rédaction d’une courte explication…', ar: 'جارٍ كتابة شرح قصير…' },
  flags: { en: 'Warning signs', fr: 'Signaux d’alerte', ar: 'علامات الخطر' },
  checks: { en: 'Before you trust it', fr: 'Avant de faire confiance', ar: 'قبل أن تثق به' },
  sources: { en: 'Checked with', fr: 'Vérifié avec', ar: 'تم التحقق عبر' },
  unavailable: { en: 'unavailable right now', fr: 'indisponible pour le moment', ar: 'غير متوفر حاليًا' },
  references: { en: 'Warnings behind these signs', fr: 'Mises en garde derrière ces signaux', ar: 'التحذيرات وراء هذه العلامات' },
  share: { en: 'Share this result', fr: 'Partager ce résultat', ar: 'شارك النتيجة' },
  copied: { en: 'Copied, paste it in your chat', fr: 'Copié, collez-le dans votre discussion', ar: 'تم النسخ، الصقه في المحادثة' },
  again: { en: 'Check something else', fr: 'Vérifier autre chose', ar: 'تحقّق من شيء آخر' },
  shareHead: { en: 'Qirat scam check', fr: 'Vérif arnaque Qirat', ar: 'فحص الاحتيال من قيراط' },
  shareFoot: { en: 'Check yours for free', fr: 'Vérifiez gratuitement', ar: 'تحقّق من رسالتك مجانًا' },
  tooMany: { en: 'Too many checks in a short time. Try again in a minute.', fr: 'Trop de vérifications d’un coup. Réessayez dans une minute.', ar: 'عمليات تحقق كثيرة في وقت قصير. حاول مرة أخرى بعد دقيقة.' },
  failed: { en: 'The check failed. Please try again.', fr: 'La vérification a échoué. Réessayez.', ar: 'فشل الفحص. حاول مرة أخرى.' },
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

// A level is a dot of colour beside the verdict: red and amber mean what they
// say, and "none" is never green, because no check can prove something is safe.
const LEVEL_DOT: Record<Level, string> = {
  high: 'bg-down',
  medium: 'bg-warn',
  low: 'bg-gold-bright',
  none: 'bg-gold-bright',
  unsure: 'bg-neutral',
}

const SEV_DOT: Record<Severity, string> = {
  high: 'bg-down',
  medium: 'bg-warn',
  low: 'bg-gold-bright',
  info: 'bg-neutral',
}

/** A caption string without its marker brackets, for labels read aloud. */
const plain = (text: string) => text.replace(/\[\[|\]\]/g, '')

function shareText(r: ScamResult, s: (k: Key) => string): string {
  const lines = [`🛡 ${s('shareHead')}: ${r.verdict}`]
  for (const f of r.flags.filter((f) => f.severity === 'high' || f.severity === 'medium').slice(0, 4)) {
    lines.push(`• ${f.title}`)
  }
  lines.push('', r.disclaimer, `${s('shareFoot')}: https://qirat.tn/w`)
  return lines.join('\n')
}

const linkClass = 'underline underline-offset-2'

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
    track('share', 'scam')
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

  const checked = result?.sources.filter((x) => x.status !== 'reference') ?? []
  const refs = result?.sources.filter((x) => x.status === 'reference') ?? []

  return (
    <div>
      <section className="grid gap-y-4 md:grid-cols-2 md:gap-x-12 md:pt-6">
        <div className="md:col-start-1 md:row-start-1">
          <Caption
            as="h1"
            text={s('title')}
            className="pt-1 text-[clamp(2.75rem,13.5vw,4rem)] md:text-[4.5rem] ltr:text-[clamp(2.4rem,11vw,3.4rem)] ltr:md:text-[4rem]"
          />
          <p className="mt-3 max-w-md text-[15px] text-muted">{s('intro')}</p>
        </div>

        <form
          className="md:col-start-2 md:row-span-2 md:row-start-1 md:pt-3"
          onSubmit={(e) => {
            e.preventDefault()
            // nothing pasted yet: the button points at the box
            if (!input.trim()) inputRef.current?.focus()
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
            // empty, the box follows the page so its hint reads the right way round
            dir={input ? 'auto' : undefined}
            rows={4}
            maxLength={4000}
            placeholder={s('placeholder')}
            aria-label={plain(s('title'))}
            className="block w-full resize-y rounded-[18px] border-2 border-text/15 bg-card px-4 py-3 text-[15px] outline-none transition placeholder:text-muted/80 focus:border-text/60"
          />
          {kind && (
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted">
              <p>
                {s('detected')} <span className="font-semibold text-text">{s(`kind.${kind}` as Key)}</span>
              </p>
              {kind === 'address' && isEvmAddress(input) && (
                <label className="flex items-center gap-2">
                  {s('chain')}
                  <select
                    value={chain}
                    onChange={(e) => setChain(e.target.value)}
                    className="cursor-pointer rounded-[10px] border-2 border-text/15 bg-card px-2 py-1 text-[13px] text-text"
                  >
                    {CHAINS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id ? c.label : s('chainAuto')}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          )}
          <button type="submit" disabled={loading} className="go mt-4 w-full disabled:cursor-default disabled:opacity-60">
            {loading ? s('checking') : s('check')}
          </button>
          {error && <p className="mt-4 text-sm text-warn">{error}</p>}
        </form>

        <div className="md:col-start-1 md:row-start-2">
          {!result && (
            <div className="pt-2 text-[15px]">
              <p className="text-[13px] text-muted">{s('tryOne')}</p>
              <ul>
                {[s('ex1'), ...EXAMPLES].map((label, i) => (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => {
                        const text = i === 0 ? s('ex1Text') : label
                        setInput(text)
                        run(text)
                      }}
                      className="alt py-1.5 text-start"
                      dir="auto"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-4 max-w-md text-[13px] text-muted">{INVITE.trust[lang]}</p>
        </div>
      </section>

      {result && (
        <section ref={resultRef} className="mx-auto mt-10 max-w-xl scroll-mt-20" aria-live="polite">
          {/* the record of this check; it can be very long, so it leans only a little and stays inside the page's margin */}
          <Ticket tilt={-0.4} className="mx-1">
            <p className="poster pb-3 text-[20px] text-muted">{s('shareHead')}</p>
            <div className="ticket-rule pt-4">
              <h2 className="poster flex items-baseline gap-2.5 text-[28px]">
                <span className={`size-3.5 shrink-0 rounded-full ${LEVEL_DOT[result.level]}`} aria-hidden />
                {result.verdict}
              </h2>
              <p className="mt-2 text-sm text-muted">{result.disclaimer}</p>
            </div>

            {result.flags.length > 0 && (
              <div className="ticket-rule mt-4 pt-4">
                <h3 className="text-[13px] font-semibold text-muted">{s('flags')}</h3>
                <ul>
                  {result.flags.map((f, i) => (
                    <li key={`${f.id}-${i}`} className="flex gap-3 py-2.5">
                      <span className={`mt-2 size-2.5 shrink-0 rounded-full ${SEV_DOT[f.severity]}`} aria-hidden />
                      <div className="min-w-0">
                        <p className="leading-snug font-semibold">
                          {f.title}
                          <span className="ms-2 text-xs font-normal text-muted">{s(`sev.${f.severity}` as Key)}</span>
                        </p>
                        <p className="mt-1 text-sm text-muted">{f.detail}</p>
                        {f.source?.url && (
                          <a href={f.source.url} target="_blank" rel="noreferrer" className={`mt-1 inline-block text-[13px] ${linkClass}`}>
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
              <div className="ticket-rule mt-4 pt-4">
                <h3 className="text-[13px] font-semibold text-muted">{s('checks')}</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {result.checks.map((c) => (
                    <li key={c} className="flex gap-2.5">
                      <span className="font-semibold" aria-hidden>
                        ✓
                      </span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(checked.length > 0 || refs.length > 0) && (
              <div className="ticket-rule mt-4 space-y-1.5 pt-4 text-xs text-muted">
                {checked.length > 0 && (
                  <p>
                    {s('sources')}:{' '}
                    {checked.map((x, i) => (
                      <span key={x.id}>
                        {i > 0 && ', '}
                        {x.url ? (
                          <a href={x.url} target="_blank" rel="noreferrer" className={linkClass}>
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
                        {i > 0 && ', '}
                        <a href={x.url} target="_blank" rel="noreferrer" className={linkClass}>
                          {x.name}
                        </a>
                      </span>
                    ))}
                  </p>
                )}
              </div>
            )}
          </Ticket>

          {/* Qirat reads the record out in plain words */}
          {(result.explanation || explaining) && (
            <MascotSays mood={result.level === 'high' ? 'worried' : 'thinking'} className="mt-9">
              <span className="block text-[13px] font-semibold opacity-70">{s('inPlainWords')}</span>
              {result.explanation ? (
                <span className="mt-0.5 block whitespace-pre-line" dir="auto">
                  {result.explanation}
                </span>
              ) : (
                <span className="mt-0.5 block">
                  {s('explaining')}
                  <span className="caret">▋</span>
                </span>
              )}
            </MascotSays>
          )}

          <button type="button" onClick={share} className="go mt-8 w-full">
            {s('share')}
          </button>
          {copied && <p className="mt-4 text-center text-[13px] text-muted">{s('copied')}</p>}
          <p className="mt-5 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[15px]">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText(result, s))}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('share', 'scam')}
              className="alt"
            >
              WhatsApp
            </a>
            <button type="button" onClick={reset} className="alt">
              {s('again')}
            </button>
          </p>
          {manualShare && (
            <textarea
              readOnly
              value={manualShare}
              rows={5}
              dir="auto"
              onFocus={(e) => e.currentTarget.select()}
              aria-label={s('share')}
              className="mt-5 block w-full rounded-[18px] border-2 border-text/15 bg-card p-3 text-sm"
            />
          )}
        </section>
      )}
    </div>
  )
}
