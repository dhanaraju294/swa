/**
 * Small dependency-free SVG charts. Adding a charting library for six charts
 * would have meant ~150kB of extra bundle on a site that otherwise ships one
 * page, so these are hand-rolled and responsive via viewBox.
 */
import type { NameCount } from '@/lib/supabase-admin';

const INK = '#1c1917';
const GOLD = '#d4a537';
const LEAF = '#7c9a72';
const MUTED = '#a8a29e';

export function LineChart({
  data,
  height = 220,
}: {
  data: Array<{ date: string; count: number }>;
  height?: number;
}) {
  const w = 720;
  const h = height;
  const pad = { top: 16, right: 16, bottom: 28, left: 32 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;

  const max = Math.max(1, ...data.map((d) => d.count));
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;
  const x = (i: number) => pad.left + i * stepX;
  const y = (v: number) => pad.top + innerH - (v / max) * innerH;

  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.count)}`).join(' ');
  const area =
    data.length > 0
      ? `${line} L ${x(data.length - 1)} ${pad.top + innerH} L ${x(0)} ${pad.top + innerH} Z`
      : '';

  const ticks = [0, Math.round(max / 2), max];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label="Signups per day">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.left} x2={w - pad.right} y1={y(t)} y2={y(t)} stroke="#e7e5e4" strokeWidth={1} />
          <text x={pad.left - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill={MUTED}>
            {t}
          </text>
        </g>
      ))}
      {area && <path d={area} fill={GOLD} opacity={0.14} />}
      <path d={line} fill="none" stroke={GOLD} strokeWidth={2.5} strokeLinejoin="round" />
      {data.map((d, i) => (
        <circle key={d.date} cx={x(i)} cy={y(d.count)} r={2.5} fill={GOLD}>
          <title>{`${d.date}: ${d.count}`}</title>
        </circle>
      ))}
      {data
        .filter((_, i) => i % 7 === 0 || i === data.length - 1)
        .map((d) => {
          const i = data.indexOf(d);
          return (
            <text key={d.date} x={x(i)} y={h - 8} textAnchor="middle" fontSize={10} fill={MUTED}>
              {d.date.slice(5)}
            </text>
          );
        })}
    </svg>
  );
}

export function BarChart({ data, color = LEAF }: { data: NameCount[]; color?: string }) {
  if (data.length === 0) return <Empty />;
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.name} className="flex items-center gap-3">
          <span className="w-36 shrink-0 truncate text-xs" style={{ color: INK }} title={d.name}>
            {d.name}
          </span>
          <div className="h-5 flex-1 rounded-sm bg-stone-100">
            <div
              className="h-5 rounded-sm transition-all"
              style={{ width: `${Math.max(2, (d.count / max) * 100)}%`, background: color }}
            />
          </div>
          <span className="w-8 shrink-0 text-right text-xs tabular-nums" style={{ color: MUTED }}>
            {d.count}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({ data }: { data: NameCount[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0) return <Empty />;

  const palette = [GOLD, LEAF, '#b08968', '#8da9c4', '#c9ada7', '#a5a58d'];
  const r = 60;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0" role="img" aria-label="Distribution">
        <g transform="translate(80,80) rotate(-90)">
          {data.map((d, i) => {
            const frac = d.count / total;
            const dash = `${frac * c} ${c - frac * c}`;
            const el = (
              <circle
                key={d.name}
                r={r}
                fill="none"
                stroke={palette[i % palette.length]}
                strokeWidth={22}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
              >
                <title>{`${d.name}: ${d.count}`}</title>
              </circle>
            );
            offset += frac * c;
            return el;
          })}
        </g>
        <text x="80" y="76" textAnchor="middle" fontSize={22} fontWeight={600} fill={INK}>
          {total}
        </text>
        <text x="80" y="94" textAnchor="middle" fontSize={10} fill={MUTED}>
          total
        </text>
      </svg>
      <ul className="space-y-1.5 text-xs">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: palette[i % palette.length] }}
            />
            <span style={{ color: INK }}>{d.name}</span>
            <span style={{ color: MUTED }}>
              {d.count} · {Math.round((d.count / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Empty() {
  return <p className="py-6 text-center text-xs text-stone-400">No data yet.</p>;
}
