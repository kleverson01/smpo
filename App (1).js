import React, { useState, useMemo } from "react";

// ─── Utilitários de Data ──────────────────────────────────────────────────────
function toISO(d) {
  if (!d) return "";
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fromISO(s) {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}
function formatarDataBr(strIso) {
  if (!strIso) return "";
  const [y, m, d] = strIso.split("-");
  return `${d}/${m}/${y}`;
}
function addDias(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function diffDias(a, b) {
  return Math.round((b - a) / 86400000);
}

// ─── Dados Iniciais ───────────────────────────────────────────────────────────
const BASE = new Date(2026, 5, 1, 0, 0, 0, 0);
const DEMANDAS_INICIAIS = [
  {
    id: "1",
    tarefa: "Atividade 01",
    agente: "Equipe Demolição e Civil",
    dataInicio: toISO(addDias(BASE, 0)),
    dataFim: toISO(addDias(BASE, 5)),
    progresso: 100,
    ativo: true,
  },
  {
    id: "2",
    tarefa: "Atividade 02",
    agente: "Equipe Civil",
    dataInicio: toISO(addDias(BASE, 0)),
    dataFim: toISO(addDias(BASE, 6)),
    progresso: 90,
    ativo: true,
  },
  {
    id: "3",
    tarefa: "Atividade 03",
    agente: "Encanador / Oficial",
    dataInicio: toISO(addDias(BASE, 7)),
    dataFim: toISO(addDias(BASE, 11)),
    progresso: 50,
    ativo: true,
  },
  {
    id: "4",
    tarefa: "Atividade 04",
    agente: "Eletricista / Oficial",
    dataInicio: toISO(addDias(BASE, 7)),
    dataFim: toISO(addDias(BASE, 13)),
    progresso: 30,
    ativo: true,
  },
  {
    id: "5",
    tarefa: "Atividade 05",
    agente: "Técnico de TI / Telecom",
    dataInicio: toISO(addDias(BASE, 14)),
    dataFim: toISO(addDias(BASE, 17)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "6",
    tarefa: "Atividade 06",
    agente: "Pintor / Ajudante",
    dataInicio: toISO(addDias(BASE, 14)),
    dataFim: toISO(addDias(BASE, 21)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "7",
    tarefa: "Atividade 07",
    agente: "Eletricista",
    dataInicio: toISO(addDias(BASE, 22)),
    dataFim: toISO(addDias(BASE, 25)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "8",
    tarefa: "Atividade 08",
    agente: "Marceneiro / Montador",
    dataInicio: toISO(addDias(BASE, 22)),
    dataFim: toISO(addDias(BASE, 30)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "9",
    tarefa: "Atividade 09",
    agente: "Equipe de Apoio",
    dataInicio: toISO(addDias(BASE, 31)),
    dataFim: toISO(addDias(BASE, 34)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "10",
    tarefa: "Atividade 10",
    agente: "Engenheiro Responsável",
    dataInicio: toISO(addDias(BASE, 35)),
    dataFim: toISO(addDias(BASE, 37)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "11",
    tarefa: "Atividade 11",
    agente: "Equipe Civil",
    dataInicio: toISO(addDias(BASE, 3)),
    dataFim: toISO(addDias(BASE, 7)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "12",
    tarefa: "Atividade 12",
    agente: "Pedreiro / Azulejista",
    dataInicio: toISO(addDias(BASE, 8)),
    dataFim: toISO(addDias(BASE, 16)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "13",
    tarefa: "Atividade 13",
    agente: "Encanador Especializado",
    dataInicio: toISO(addDias(BASE, 17)),
    dataFim: toISO(addDias(BASE, 21)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "14",
    tarefa: "Atividade 14",
    agente: "Técnico HVAC",
    dataInicio: toISO(addDias(BASE, 10)),
    dataFim: toISO(addDias(BASE, 15)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "15",
    tarefa: "Atividade 15",
    agente: "Carpinteiro / Marceneiro",
    dataInicio: toISO(addDias(BASE, 12)),
    dataFim: toISO(addDias(BASE, 18)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "16",
    tarefa: "Atividade 16",
    agente: "Serralheiro / Vidraceiro",
    dataInicio: toISO(addDias(BASE, 5)),
    dataFim: toISO(addDias(BASE, 11)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "17",
    tarefa: "Atividade 17",
    agente: "Gesseiro Especializado",
    dataInicio: toISO(addDias(BASE, 14)),
    dataFim: toISO(addDias(BASE, 20)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "18",
    tarefa: "Atividade 18",
    agente: "Paisagista / Jardineiro",
    dataInicio: toISO(addDias(BASE, 28)),
    dataFim: toISO(addDias(BASE, 33)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "19",
    tarefa: "Atividade 19",
    agente: "Engenheiro Eletricista",
    dataInicio: toISO(addDias(BASE, 26)),
    dataFim: toISO(addDias(BASE, 28)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "20",
    tarefa: "Atividade 20",
    agente: "Engenheiro Hidráulico",
    dataInicio: toISO(addDias(BASE, 26)),
    dataFim: toISO(addDias(BASE, 28)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "21",
    tarefa: "Atividade 21",
    agente: "Técnico de Segurança",
    dataInicio: toISO(addDias(BASE, 20)),
    dataFim: toISO(addDias(BASE, 24)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "22",
    tarefa: "Atividade 22",
    agente: "Técnico de Telecom",
    dataInicio: toISO(addDias(BASE, 22)),
    dataFim: toISO(addDias(BASE, 25)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "23",
    tarefa: "Atividade 23",
    agente: "Equipe Especializada",
    dataInicio: toISO(addDias(BASE, 15)),
    dataFim: toISO(addDias(BASE, 23)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "24",
    tarefa: "Atividade 24",
    agente: "Empresa Especializada",
    dataInicio: toISO(addDias(BASE, 18)),
    dataFim: toISO(addDias(BASE, 27)),
    progresso: 0,
    ativo: true,
  },
  {
    id: "25",
    tarefa: "Atividade 25",
    agente: "Despachante / Engenheiro",
    dataInicio: toISO(addDias(BASE, 33)),
    dataFim: toISO(addDias(BASE, 40)),
    progresso: 0,
    ativo: true,
  },
];

// ─── Constantes de layout ─────────────────────────────────────────────────────
const TRACK_H = 38;
const HDR_H = 48;
const BAR_H = 20;
const BAR_R = 4;
const LABEL_W = 240;

// ─── Helpers de cor ───────────────────────────────────────────────────────────
function corBarra(p) {
  if (p >= 100) return { bg: "#10b981", light: "#d1fae5", border: "#6ee7b7" };
  if (p > 0) return { bg: "#3b82f6", light: "#dbeafe", border: "#93c5fd" };
  return { bg: "#94a3b8", light: "#f1f5f9", border: "#cbd5e1" };
}
function corBadge(p) {
  if (p >= 100) return "#10b981";
  if (p > 0) return "#3b82f6";
  return "#94a3b8";
}

function calcEtapa(demandas) {
  const em = demandas.find((t) => t.progresso > 0 && t.progresso < 100);
  if (em) return `ID ${em.id} – ${em.tarefa.substring(0, 28)}`;
  const prox = demandas.find((t) => t.progresso === 0);
  if (prox) return `ID ${prox.id} – ${prox.tarefa.substring(0, 28)}`;
  return "Obra Concluída! 🎉";
}

// ─── CSS injetado globalmente ─────────────────────────────────────────────────
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #e2e8f0; font-family: Inter, system-ui, -apple-system, sans-serif; color: #0f172a; }
  input, textarea, button { font-family: inherit; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #f1f5f9; }
  ::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 3px; }
  .inp-base {
    background: transparent;
    border: none;
    border-bottom: 1.5px dashed #475569;
    outline: none;
    color: #f1f5f9;
    font-weight: 600;
    font-size: 14px;
    padding: 2px 4px;
    width: 100%;
    transition: border-color 0.15s;
  }
  .inp-base:hover  { border-bottom-color: #94a3b8; }
  .inp-base:focus  { border-bottom-color: #60a5fa; border-bottom-style: solid; }
  .inp-light {
    background: transparent;
    border: none;
    border-bottom: 1.5px dashed #cbd5e1;
    outline: none;
    color: #1e293b;
    font-weight: 500;
    font-size: 13px;
    padding: 2px 4px;
    width: 100%;
    transition: border-color 0.15s;
  }
  .inp-light:hover { border-bottom-color: #94a3b8; }
  .inp-light:focus { border-bottom-color: #3b82f6; border-bottom-style: solid; }
  .inp-date {
    background: #fff;
    border: 1.5px solid #bfdbfe;
    border-radius: 8px;
    outline: none;
    color: #1e293b;
    font-size: 12px;
    padding: 4px 8px;
    transition: border-color 0.15s;
    cursor: pointer;
  }
  .inp-date:hover  { border-color: #93c5fd; }
  .inp-date:focus  { border-color: #3b82f6; }
  .inp-num {
    width: 48px;
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    background: #f1f5f9;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    outline: none;
    padding: 3px 4px;
    transition: border-color 0.15s;
  }
  .inp-num:focus { border-color: #3b82f6; }
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 10px; border: none;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: filter 0.15s, transform 0.1s;
  }
  .btn:hover  { filter: brightness(1.1); }
  .btn:active { transform: scale(0.97); }
  .btn-blue  { background: #2563eb; color: #fff; }
  .btn-green { background: #059669; color: #fff; }
  .card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,.06);
  }
  .card-label {
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .08em;
    color: #94a3b8;
  }
  .card-value {
    font-size: 22px; font-weight: 800; margin-top: 6px;
  }
  .section {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0,0,0,.06);
    overflow: hidden;
  }
  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid #f1f5f9;
    background: #f8fafc;
  }
  .section-title { font-size: 15px; font-weight: 700; color: #1e293b; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead tr { background: #1e293b; color: #fff; }
  th { padding: 10px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; }
  td { padding: 7px 12px; }
  tbody tr:nth-child(even) { background: #f8fafc; }
  tbody tr:hover { background: #eff6ff; }
  tbody tr { border-bottom: 1px solid #f1f5f9; transition: background 0.12s; }
  .td-inp-name {
    background: transparent; border: none;
    border-bottom: 1.5px solid transparent;
    outline: none; width: 100%;
    font-size: 13px; font-weight: 500; color: #1e293b;
    padding: 2px 4px; transition: border-color 0.15s;
  }
  .td-inp-name:hover { border-bottom-color: #cbd5e1; }
  .td-inp-name:focus { border-bottom-color: #3b82f6; }
  .td-inp-agent {
    background: transparent; border: none;
    border-bottom: 1.5px solid transparent;
    outline: none; width: 100%;
    font-size: 12px; font-weight: 600; color: #4338ca;
    padding: 2px 4px; transition: border-color 0.15s;
  }
  .td-inp-agent:hover { border-bottom-color: #a5b4fc; }
  .td-inp-agent:focus { border-bottom-color: #6366f1; }
  .badge {
    width: 20px; height: 20px; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    color: #fff; font-size: 9px; font-weight: 700; flex-shrink: 0;
  }
  .legend-dot { width:12px; height:12px; border-radius:3px; display:inline-block; }
  .tag-rose {
    display:inline-flex; align-items:center; gap:4px;
    font-size:11px; color:#e11d48; font-weight:600;
  }
  .tag-slate {
    display:inline-flex; align-items:center; gap:4px;
    font-size:11px; color:#64748b;
  }
  .chk {
    width:16px; height:16px; cursor:pointer; accent-color:#3b82f6;
    flex-shrink:0;
  }
  .row-inativo td { opacity: 0.42; }
  .row-inativo { background: #f8fafc !important; }
`;

// ─── Gantt SVG ────────────────────────────────────────────────────────────────
function GanttSVG({ demandas, dataAnalise }) {
  const datas = useMemo(
    () =>
      demandas
        .flatMap((t) => [fromISO(t.dataInicio), fromISO(t.dataFim)])
        .filter(Boolean),
    [demandas]
  );
  if (!datas.length) return null;

  const dataMin = new Date(Math.min(...datas));
  const dataMaxRaw = new Date(Math.max(...datas));
  const dataMax = addDias(dataMaxRaw, 1);
  const totalDias = diffDias(dataMin, dataMax);
  const PX_PER_DAY = 24;
  const svgW = Math.max(700, totalDias * PX_PER_DAY);
  const svgH = HDR_H + demandas.length * TRACK_H;

  function xFor(d) {
    return (diffDias(dataMin, d) / totalDias) * svgW;
  }

  // Gerar ticks
  const ticks = [];
  const cur = new Date(dataMin);
  while (cur <= dataMax) {
    const dow = cur.getDay();
    ticks.push({
      x: xFor(cur),
      dia: String(cur.getDate()).padStart(2, "0"),
      mes: cur.getMonth(),
      ano: cur.getFullYear(),
      isWeekend: dow === 0 || dow === 6,
      isFirst: cur.getDate() === 1,
      date: new Date(cur),
    });
    cur.setDate(cur.getDate() + 1);
  }

  const MESES = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];

  const analiseDate = fromISO(dataAnalise);
  const showLinha =
    analiseDate && analiseDate >= dataMin && analiseDate <= dataMax;
  const xAnalise = showLinha ? xFor(analiseDate) : null;

  return (
    <div style={{ overflowX: "auto" }}>
      <svg
        width={svgW}
        height={svgH}
        style={{ display: "block", fontFamily: "Inter,system-ui,sans-serif" }}
      >
        {/* Zebra de linhas */}
        {demandas.map((_, i) => (
          <rect
            key={i}
            x={0}
            y={HDR_H + i * TRACK_H}
            width={svgW}
            height={TRACK_H}
            fill={i % 2 === 0 ? "#f8fafc" : "#ffffff"}
          />
        ))}
        {/* Fins de semana */}
        {ticks
          .filter((t) => t.isWeekend)
          .map((t, i) => (
            <rect
              key={i}
              x={t.x}
              y={0}
              width={PX_PER_DAY}
              height={svgH}
              fill="rgba(100,116,139,0.07)"
            />
          ))}
        {/* Linhas verticais */}
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x}
            x2={t.x}
            y1={HDR_H}
            y2={svgH}
            stroke="rgba(203,213,225,0.5)"
            strokeWidth="1"
          />
        ))}
        {/* Header */}
        <rect x={0} y={0} width={svgW} height={HDR_H} fill="#1e293b" />
        {ticks.map((t, i) => (
          <g key={i}>
            {t.isFirst && (
              <>
                <line
                  x1={t.x}
                  x2={t.x}
                  y1={0}
                  y2={HDR_H}
                  stroke="#475569"
                  strokeWidth="1.5"
                />
                <text
                  x={t.x + 4}
                  y={14}
                  fill="#94a3b8"
                  fontSize={10}
                  fontWeight="600"
                >
                  {MESES[t.mes].toUpperCase()} {t.ano}
                </text>
              </>
            )}
            <text
              x={t.x + PX_PER_DAY / 2}
              y={HDR_H - 7}
              fill={t.isWeekend ? "#475569" : "#e2e8f0"}
              fontSize={9}
              fontWeight={t.isWeekend ? "400" : "600"}
              textAnchor="middle"
            >
              {t.dia}
            </text>
          </g>
        ))}
        {/* Barras */}
        {demandas.map((t, i) => {
          const ini = fromISO(t.dataInicio);
          const fim = fromISO(t.dataFim);
          if (!ini || !fim) return null;
          const x1 = xFor(ini);
          const x2 = xFor(addDias(fim, 1));
          const barW = Math.max(x2 - x1, 4);
          const barY = HDR_H + i * TRACK_H + (TRACK_H - BAR_H) / 2;
          const p = parseInt(t.progresso) || 0;
          const { bg, light, border } = corBarra(p);
          const progW = (p / 100) * barW;
          return (
            <g key={t.id}>
              {/* Sombra */}
              <rect
                x={x1 + 1}
                y={barY + 2}
                width={barW}
                height={BAR_H}
                rx={BAR_R}
                fill="rgba(0,0,0,0.07)"
              />
              {/* Trilho */}
              <rect
                x={x1}
                y={barY}
                width={barW}
                height={BAR_H}
                rx={BAR_R}
                fill={light}
                stroke={border}
                strokeWidth="1"
              />
              {/* Progresso */}
              {progW > 0 && (
                <rect
                  x={x1}
                  y={barY}
                  width={progW}
                  height={BAR_H}
                  rx={BAR_R}
                  fill={bg}
                />
              )}
              {/* % dentro da barra */}
              {barW > 38 && p > 0 && (
                <text
                  x={x1 + Math.min(progW, barW) / 2}
                  y={barY + BAR_H / 2 + 3.5}
                  fill="#fff"
                  fontSize={9}
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {p}%
                </text>
              )}
            </g>
          );
        })}
        {/* Divisores de linha */}
        {demandas.map((_, i) => (
          <line
            key={i}
            x1={0}
            x2={svgW}
            y1={HDR_H + (i + 1) * TRACK_H}
            y2={HDR_H + (i + 1) * TRACK_H}
            stroke="rgba(203,213,225,0.4)"
            strokeWidth="1"
          />
        ))}
        {/* Linha de análise */}
        {showLinha && (
          <g>
            <line
              x1={xAnalise}
              x2={xAnalise}
              y1={0}
              y2={svgH}
              stroke="#e11d48"
              strokeWidth="2.5"
              strokeDasharray="6,4"
            />
            <circle cx={xAnalise} cy={HDR_H / 2} r={5} fill="#e11d48" />
            <text
              x={xAnalise + 7}
              y={HDR_H / 2 + 4}
              fill="#e11d48"
              fontSize={10}
              fontWeight="700"
            >
              {formatarDataBr(dataAnalise)}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

// ─── Gráfico de Rosca SVG ─────────────────────────────────────────────────────
function GraficoRosca({ demandas }) {
  const [hover, setHover] = useState(null);
  const CX = 100,
    CY = 100,
    R = 72,
    r = 46;
  const total = demandas.length;

  const fatias = useMemo(() => {
    let ang = -Math.PI / 2;
    return demandas.map((t, i) => {
      const arc = (1 / total) * 2 * Math.PI;
      const cor =
        t.progresso >= 100
          ? "#10b981"
          : t.progresso > 0
          ? "#3b82f6"
          : "#cbd5e1";
      const x1 = CX + R * Math.cos(ang),
        y1 = CY + R * Math.sin(ang);
      const x2 = CX + R * Math.cos(ang + arc),
        y2 = CY + R * Math.sin(ang + arc);
      const xi1 = CX + r * Math.cos(ang),
        yi1 = CY + r * Math.sin(ang);
      const xi2 = CX + r * Math.cos(ang + arc),
        yi2 = CY + r * Math.sin(ang + arc);
      const la = arc > Math.PI ? 1 : 0;
      const path = `M${x1},${y1} A${R},${R} 0 ${la} 1 ${x2},${y2} L${xi2},${yi2} A${r},${r} 0 ${la} 0 ${xi1},${yi1} Z`;
      ang += arc;
      return { t, cor, path, i };
    });
  }, [demandas]);

  const hd = hover !== null ? demandas[hover] : null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 24,
        alignItems: "flex-start",
      }}
    >
      {/* Rosca */}
      <div style={{ flexShrink: 0 }}>
        <svg width={200} height={200}>
          {fatias.map(({ t, cor, path, i }) => (
            <path
              key={t.id}
              d={path}
              fill={cor}
              stroke="#fff"
              strokeWidth="2"
              opacity={hover === null || hover === i ? 1 : 0.35}
              style={{ cursor: "pointer", transition: "opacity 0.15s" }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
          {hd ? (
            <>
              <text
                x={CX}
                y={CY - 7}
                textAnchor="middle"
                fontSize={11}
                fontWeight="700"
                fill="#0f172a"
              >
                #{hd.id}
              </text>
              <text
                x={CX}
                y={CY + 12}
                textAnchor="middle"
                fontSize={20}
                fontWeight="800"
                fill={
                  hd.progresso >= 100
                    ? "#10b981"
                    : hd.progresso > 0
                    ? "#3b82f6"
                    : "#94a3b8"
                }
              >
                {hd.progresso}%
              </text>
            </>
          ) : (
            <>
              <text
                x={CX}
                y={CY - 3}
                textAnchor="middle"
                fontSize={11}
                fill="#64748b"
              >
                Atividades
              </text>
              <text
                x={CX}
                y={CY + 16}
                textAnchor="middle"
                fontSize={22}
                fontWeight="800"
                fill="#0f172a"
              >
                {total}
              </text>
            </>
          )}
        </svg>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 8,
            flexWrap: "wrap",
          }}
        >
          {[
            ["#10b981", "Concluído"],
            ["#3b82f6", "Em andamento"],
            ["#cbd5e1", "Não iniciado"],
          ].map(([cor, label]) => (
            <span
              key={label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "#64748b",
              }}
            >
              <span className="legend-dot" style={{ background: cor }}></span>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Lista lateral */}
      <div
        style={{ flex: 1, minWidth: 180, maxHeight: 260, overflowY: "auto" }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".08em",
            color: "#94a3b8",
            marginBottom: 8,
          }}
        >
          Etapas
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {demandas.map((t, i) => {
            const cor =
              t.progresso >= 100
                ? "#10b981"
                : t.progresso > 0
                ? "#3b82f6"
                : "#94a3b8";
            const bg =
              t.progresso >= 100
                ? "#f0fdf4"
                : t.progresso > 0
                ? "#eff6ff"
                : "#f8fafc";
            const brd =
              t.progresso >= 100
                ? "#bbf7d0"
                : t.progresso > 0
                ? "#bfdbfe"
                : "#e2e8f0";
            return (
              <div
                key={t.id}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 10px",
                  borderRadius: 10,
                  border: `1.5px solid ${brd}`,
                  background: hover === i ? bg : "#fff",
                  cursor: "default",
                  transition: "background 0.12s",
                }}
              >
                <span className="badge" style={{ background: cor }}>
                  {t.id}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#334155",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.tarefa}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: cor,
                    flexShrink: 0,
                  }}
                >
                  {t.progresso}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── App Principal ────────────────────────────────────────────────────────────
export default function App() {
  const [nomeProjeto, setNomeProjeto] = useState("Nome do Projeto");
  const [observacoes, setObservacoes] = useState(
    "Manter foco no alinhamento das equipes de elétrica e hidráulica para evitar ociosidade."
  );
  const [diretoria, setDiretoria] = useState("Solicitação DI");
  const [setor, setSetor] = useState("SMPO");
  const [engenheiro, setEngenheiro] = useState("Eng. XXX");
  const [dataAnalise, setDataAnalise] = useState("2026-06-11");
  const [demandas, setDemandas] = useState(DEMANDAS_INICIAIS);

  const cards = useMemo(() => {
    const datas = demandas
      .flatMap((t) => [fromISO(t.dataInicio), fromISO(t.dataFim)])
      .filter(Boolean);
    const dMin = datas.length ? new Date(Math.min(...datas)) : new Date();
    const dMax = datas.length ? new Date(Math.max(...datas)) : new Date();
    const dur = Math.round((dMax - dMin) / 86400000);
    // Evolução Geral: média apenas das atividades marcadas (ativo=true)
    const ativas = demandas.filter((t) => t.ativo);
    const media = ativas.length
      ? Math.round(
          ativas.reduce((a, t) => a + (parseInt(t.progresso) || 0), 0) /
            ativas.length
        )
      : 0;
    return {
      duracao: `${dur} dias`,
      inicio: dMin.toLocaleDateString("pt-BR"),
      fim: dMax.toLocaleDateString("pt-BR"),
      progresso: `${media}%`,
      mediaNum: media,
      etapa: calcEtapa(demandas),
      nAtivas: ativas.length,
      nTotal: demandas.length,
    };
  }, [demandas]);

  function handleChange(id, campo, valor) {
    setDemandas((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (campo === "progresso")
          return {
            ...item,
            progresso: Math.min(100, Math.max(0, parseInt(valor) || 0)),
          };
        return { ...item, [campo]: valor };
      })
    );
  }

  function toggleAtivo(id) {
    setDemandas((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ativo: !item.ativo } : item
      )
    );
  }

  const todosAtivos = demandas.every((t) => t.ativo);
  const algunsAtivos = demandas.some((t) => t.ativo);

  function toggleTodos() {
    const novoEstado = !todosAtivos;
    setDemandas((prev) => prev.map((item) => ({ ...item, ativo: novoEstado })));
  }

  function baixarCSV() {
    let csv = "\uFEFFNOME DO PROJETO:;" + nomeProjeto + "\n";
    csv += "DIRETORIA:;" + diretoria + "\n";
    csv += "SETOR:;" + setor + "\n";
    csv += "ENGENHEIRO:;" + engenheiro + "\n";
    csv += "DATA_ANALISE:;" + dataAnalise + "\n";
    csv += "OBSERVACOES:;" + observacoes.replace(/\n/g, " ") + "\n\n";
    csv += "ID;Tarefa;Agente;DataInicio;DataFim;Progresso;Ativo\n";
    demandas.forEach((t) => {
      csv += `${t.id};${t.tarefa};${t.agente};${t.dataInicio};${t.dataFim};${
        t.progresso
      };${t.ativo ? 1 : 0}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nomeProjeto.replace(/\s+/g, "_")}_cronograma.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importarCSV(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const linhas = evt.target.result.split("\n");
      let novos = [],
        nome = "",
        obs = "",
        dir = "",
        set = "",
        eng = "",
        dtA = "";
      for (const linha of linhas) {
        const l = linha.trim();
        if (!l) continue;
        if (l.startsWith("NOME DO PROJETO:")) {
          nome = l.split(";")[1]?.trim() || "";
          continue;
        }
        if (l.startsWith("DIRETORIA:")) {
          dir = l.split(";")[1]?.trim() || "";
          continue;
        }
        if (l.startsWith("SETOR:")) {
          set = l.split(";")[1]?.trim() || "";
          continue;
        }
        if (l.startsWith("ENGENHEIRO:")) {
          eng = l.split(";")[1]?.trim() || "";
          continue;
        }
        if (l.startsWith("DATA_ANALISE:")) {
          dtA = l.split(";")[1]?.trim() || "";
          continue;
        }
        if (l.startsWith("OBSERVACOES:")) {
          obs = l.split(";")[1]?.trim() || "";
          continue;
        }
        if (l.startsWith("ID;")) continue;
        const c = l.split(";");
        if (c.length >= 6)
          novos.push({
            id: c[0].trim(),
            tarefa: c[1].trim(),
            agente: c[2].trim(),
            dataInicio: c[3].trim(),
            dataFim: c[4].trim(),
            progresso: parseInt(c[5].trim(), 10) || 0,
            ativo: c[6] ? c[6].trim() !== "0" : true,
          });
      }
      if (nome) setNomeProjeto(nome);
      if (obs) setObservacoes(obs);
      if (dir) setDiretoria(dir);
      if (set) setSetor(set);
      if (eng) setEngenheiro(eng);
      if (dtA) setDataAnalise(dtA);
      if (novos.length) setDemandas(novos);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* CSS global injetado */}
      <style>{GLOBAL_CSS}</style>

      <div
        style={{
          padding: "24px",
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* ── HEADER ── */}
        <header
          style={{
            background: "#0f172a",
            borderRadius: 18,
            padding: "20px 24px",
            boxShadow: "0 4px 20px rgba(0,0,0,.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1 1 280px" }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".1em",
                  color: "#64748b",
                  marginBottom: 4,
                }}
              >
                Projeto
              </div>
              <input
                className="inp-base"
                style={{ fontSize: 22, fontWeight: 800 }}
                value={nomeProjeto}
                onChange={(e) => setNomeProjeto(e.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <label className="btn btn-blue" style={{ cursor: "pointer" }}>
                📁 Importar CSV
                <input
                  type="file"
                  accept=".csv"
                  style={{ display: "none" }}
                  onChange={importarCSV}
                />
              </label>
              <button className="btn btn-green" onClick={baixarCSV}>
                💾 Exportar CSV
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
              gap: 16,
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid #1e293b",
            }}
          >
            {[
              ["🏛️ Diretoria", diretoria, setDiretoria],
              ["🏢 Setor", setor, setSetor],
              ["👷 Engenheiro", engenheiro, setEngenheiro],
            ].map(([label, val, setter]) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                    color: "#475569",
                    marginBottom: 4,
                  }}
                >
                  {label}
                </div>
                <input
                  className="inp-base"
                  value={val}
                  onChange={(e) => setter(e.target.value)}
                />
              </div>
            ))}
            <div
              style={{
                background: "#1e293b",
                borderRadius: 10,
                padding: "10px 14px",
                border: "1px solid #334155",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  color: "#f43f5e",
                  marginBottom: 6,
                }}
              >
                📅 Data de Análise
              </div>
              <input
                type="date"
                value={dataAnalise}
                onChange={(e) => setDataAnalise(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  width: "100%",
                  colorScheme: "dark",
                }}
              />
            </div>
          </div>
        </header>

        {/* ── OBSERVAÇÕES ── */}
        <div
          style={{
            background: "#fffbeb",
            borderRadius: 16,
            padding: "14px 18px",
            border: "1px solid #fde68a",
            boxShadow: "0 1px 3px rgba(0,0,0,.05)",
          }}
        >
          <label
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".07em",
              color: "#92400e",
            }}
          >
            📝 Notas Técnicas
          </label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={2}
            style={{
              display: "block",
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "vertical",
              fontSize: 13,
              color: "#44403c",
              marginTop: 6,
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* ── KPI CARDS ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
            gap: 14,
          }}
        >
          {[
            { label: "Duração Total", value: cards.duracao, color: "#1e293b" },
            {
              label: "Início Programado",
              value: cards.inicio,
              color: "#2563eb",
            },
            { label: "Fim Programado", value: cards.fim, color: "#4f46e5" },
            {
              label: "Evolução Geral",
              value: cards.progresso,
              color: "#059669",
              bar: true,
              sub: `${cards.nAtivas} de ${cards.nTotal} atividades`,
            },
          ].map((c, i) => (
            <div key={i} className="card">
              <div className="card-label">{c.label}</div>
              <div className="card-value" style={{ color: c.color }}>
                {c.value}
              </div>
              {c.bar && (
                <>
                  <div
                    style={{
                      marginTop: 8,
                      height: 6,
                      background: "#f1f5f9",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: c.value,
                        background: "#10b981",
                        borderRadius: 999,
                        transition: "width .4s",
                      }}
                    />
                  </div>
                  {c.sub && (
                    <div
                      style={{ fontSize: 10, color: "#94a3b8", marginTop: 5 }}
                    >
                      {c.sub}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          <div
            style={{
              background: "#fff1f2",
              borderRadius: 16,
              padding: 16,
              border: "1px solid #fecdd3",
              boxShadow: "0 1px 3px rgba(0,0,0,.06)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "#f43f5e",
              }}
            >
              ⚠️ Etapa Atual
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#1e293b",
                marginTop: 8,
                lineHeight: 1.4,
              }}
              title={cards.etapa}
            >
              {cards.etapa}
            </div>
          </div>
        </div>

        {/* ── ROSCA ── */}
        <div className="section">
          <div className="section-header">
            <span className="section-title">Gráfico Analítico de Execução</span>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <GraficoRosca demandas={demandas} />
          </div>
        </div>

        {/* ── GANTT ── */}
        <div className="section">
          <div className="section-header">
            <span className="section-title">Gráfico de Gantt</span>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span className="tag-rose">
                <svg width={24} height={2}>
                  <line
                    x1={0}
                    x2={24}
                    y1={1}
                    y2={1}
                    stroke="#e11d48"
                    strokeWidth="2"
                    strokeDasharray="5,3"
                  />
                </svg>
                Linha de Análise
              </span>
              <span className="tag-slate">
                <span
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 12,
                    background: "rgba(100,116,139,0.1)",
                    border: "1px solid #cbd5e1",
                  }}
                ></span>
                Fim de semana
              </span>
            </div>
          </div>

          <div style={{ display: "flex", overflowX: "auto" }}>
            {/* Coluna fixa */}
            <div
              style={{
                flexShrink: 0,
                width: LABEL_W,
                minWidth: LABEL_W,
                borderRight: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  height: HDR_H,
                  background: "#1e293b",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "0 12px 10px",
                  borderBottom: "1px solid #334155",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                    color: "#64748b",
                  }}
                >
                  ID / Demanda
                </span>
              </div>
              {demandas.map((t, i) => (
                <div
                  key={t.id}
                  style={{
                    height: TRACK_H,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "0 12px",
                    background: i % 2 === 0 ? "#f8fafc" : "#fff",
                    borderBottom: "1px solid #f1f5f9",
                    transition: "background .12s",
                  }}
                >
                  <span
                    className="badge"
                    style={{ background: corBadge(t.progresso) }}
                  >
                    {t.id}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#334155",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={t.tarefa}
                  >
                    {t.tarefa}
                  </span>
                </div>
              ))}
            </div>
            {/* SVG */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <GanttSVG demandas={demandas} dataAnalise={dataAnalise} />
            </div>
          </div>
        </div>

        {/* ── TABELA ── */}
        <div className="section">
          <div className="section-header">
            <span className="section-title">
              Painel de Controle de Demandas
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th
                    style={{
                      width: 44,
                      textAlign: "center",
                      borderRadius: "12px 0 0 0",
                    }}
                  >
                    ID
                  </th>
                  <th style={{ width: 44, textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <input
                        type="checkbox"
                        className="chk"
                        checked={todosAtivos}
                        ref={(el) => {
                          if (el)
                            el.indeterminate = !todosAtivos && algunsAtivos;
                        }}
                        onChange={toggleTodos}
                        title="Marcar / desmarcar todas"
                      />
                      <span
                        style={{
                          fontSize: 9,
                          color: "#94a3b8",
                          fontWeight: 500,
                        }}
                      >
                        SOMA
                      </span>
                    </div>
                  </th>
                  <th>Nome da Demanda / Etapa</th>
                  <th style={{ color: "#a5b4fc" }}>Agente Responsável</th>
                  <th
                    style={{
                      width: 150,
                      textAlign: "center",
                      color: "#7dd3fc",
                    }}
                  >
                    Data Início
                  </th>
                  <th
                    style={{
                      width: 150,
                      textAlign: "center",
                      color: "#7dd3fc",
                    }}
                  >
                    Data Fim
                  </th>
                  <th
                    style={{
                      width: 180,
                      textAlign: "center",
                      borderRadius: "0 12px 0 0",
                    }}
                  >
                    Progresso (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {demandas.map((t) => (
                  <tr key={t.id} className={!t.ativo ? "row-inativo" : ""}>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: 700,
                        color: "#64748b",
                        fontSize: 12,
                      }}
                    >
                      {t.id}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        className="chk"
                        checked={!!t.ativo}
                        onChange={() => toggleAtivo(t.id)}
                        title="Incluir na Evolução Geral"
                      />
                    </td>
                    <td>
                      <input
                        className="td-inp-name"
                        value={t.tarefa}
                        onChange={(e) =>
                          handleChange(t.id, "tarefa", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="td-inp-agent"
                        value={t.agente}
                        onChange={(e) =>
                          handleChange(t.id, "agente", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="date"
                        className="inp-date"
                        value={t.dataInicio}
                        onChange={(e) =>
                          handleChange(t.id, "dataInicio", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="date"
                        className="inp-date"
                        value={t.dataFim}
                        onChange={(e) =>
                          handleChange(t.id, "dataFim", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <input
                          type="number"
                          className="inp-num"
                          min={0}
                          max={100}
                          value={t.progresso}
                          onChange={(e) =>
                            handleChange(t.id, "progresso", e.target.value)
                          }
                        />
                        <div
                          style={{
                            flex: 1,
                            height: 8,
                            background: "#e2e8f0",
                            borderRadius: 999,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              borderRadius: 999,
                              width: `${t.progresso}%`,
                              background:
                                t.progresso >= 100
                                  ? "#10b981"
                                  : t.progresso > 0
                                  ? "#3b82f6"
                                  : "#94a3b8",
                              transition: "width .3s",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
