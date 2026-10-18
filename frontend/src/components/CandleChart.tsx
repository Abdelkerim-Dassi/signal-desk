import { useState } from "react";
import type { PointerEvent } from "react";
import { compactCurrency } from "../lib/format";
import { useI18n } from "../lib/i18n";

/** [open_time_ms, open, high, low, close], one per day (from /api/analyze). */
type Candle = [number, number, number, number, number];

// drawing space; the SVG scales to the card width, so text stays proportional
const W = 320;
const H = 156;
const PAD_T = 10;
const PAD_B = 20;
const PAD_R = 58; // right gutter for price labels

export default function CandleChart({ candles }: { candles?: number[][] }) {
  const { t, lang } = useI18n();
  const [active, setActive] = useState<number | null>(null);
  const data = (candles ?? []).filter(
    (c): c is Candle =>
      c.length >= 5 && c.slice(0, 5).every((v) => Number.isFinite(Number(v))),
  );
  if (data.length < 2) return null;

  const hi = Math.max(...data.map((c) => c[2]));
  const lo = Math.min(...data.map((c) => c[3]));
  const span = hi - lo || Math.abs(hi) * 0.01 || 1;
  const plotW = W - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const y = (v: number) => PAD_T + ((hi - v) / span) * plotH;
  const step = plotW / data.length;
  const bodyW = Math.max(2, step * 0.62);
  const last = data[data.length - 1];
  const shown = data[active ?? data.length - 1];

  const day = (ms: number) =>
    new Date(ms).toLocaleDateString(lang === "ar" ? "ar-TN" : lang, {
      day: "numeric",
      month: "short",
    });
  const isUp = (c: Candle) => c[4] >= c[1];

  const pick = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    if (x < 0 || x > plotW) return setActive(null);
    setActive(Math.min(data.length - 1, Math.max(0, Math.floor(x / step))));
  };

  const priceLine = (v: number, label: string, cls: string) => (
    <g key={label}>
      <line
        x1={0}
        x2={plotW}
        y1={y(v)}
        y2={y(v)}
        className={cls}
        strokeDasharray="3 3"
        strokeWidth={0.6}
      />
      <text
        x={plotW + 4}
        y={y(v) + 3}
        className="fill-current text-muted"
        fontSize={9}
      >
        {compactCurrency(v)}
      </text>
    </g>
  );

  return (
    <div>
      <div
        className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 text-xs"
        aria-live="polite"
      >
        <span className="font-semibold text-text">{day(shown[0])}</span>
        <span className="num text-muted">
          {t("chart.open")} {compactCurrency(shown[1])} · {t("chart.high")}{" "}
          {compactCurrency(shown[2])} · {t("chart.low")}{" "}
          {compactCurrency(shown[3])} ·{" "}
          <span className={isUp(shown) ? "text-up" : "text-down"}>
            {t("chart.close")} {compactCurrency(shown[4])}
          </span>
        </span>
      </div>

      {/* time runs left to right in every language, like any price chart */}
      <div dir="ltr">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full touch-none select-none"
          role="img"
          aria-label={t("chart.title")}
          onPointerMove={pick}
          onPointerDown={pick}
          onPointerLeave={() => setActive(null)}
        >
          {priceLine(hi, "hi", "stroke-border-strong")}
          {priceLine(lo, "lo", "stroke-border-strong")}
          {/* current price, unless it would sit on top of the high/low label */}
          {Math.abs(y(last[4]) - y(hi)) > 10 &&
            Math.abs(y(last[4]) - y(lo)) > 10 &&
            priceLine(
              last[4],
              "last",
              isUp(last) ? "stroke-up" : "stroke-down",
            )}

          {active !== null && (
            <rect
              x={active * step}
              y={PAD_T - 4}
              width={step}
              height={plotH + 8}
              className="fill-subtle"
              rx={2}
            />
          )}

          {data.map((c, i) => {
            const cx = i * step + step / 2;
            const top = y(Math.max(c[1], c[4]));
            const bottom = y(Math.min(c[1], c[4]));
            const color = isUp(c) ? "var(--color-up)" : "var(--color-down)";
            return (
              <g key={c[0]}>
                <line
                  x1={cx}
                  x2={cx}
                  y1={y(c[2])}
                  y2={y(c[3])}
                  stroke={color}
                  strokeWidth={1}
                />
                <rect
                  x={cx - bodyW / 2}
                  y={top}
                  width={bodyW}
                  height={Math.max(1, bottom - top)}
                  fill={color}
                  rx={0.8}
                />
              </g>
            );
          })}

          <text
            x={0}
            y={H - 5}
            className="fill-current text-muted"
            fontSize={9}
          >
            {day(data[0][0])}
          </text>
          <text
            x={plotW}
            y={H - 5}
            className="fill-current text-muted"
            fontSize={9}
            textAnchor="end"
          >
            {day(last[0])}
          </text>
        </svg>
      </div>

      <p className="mt-1 text-[11px] leading-snug text-muted" dir="auto">
        {t("chart.legend")}
      </p>
    </div>
  );
}
