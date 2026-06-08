import React, { useEffect, useState, useCallback, useRef } from "react";

// Converte um objeto Date para string no formato ISO (AAAA-MM-DD)
function toISO(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toISOString().split("T")[0];
}

// Converte string ISO (AAAA-MM-DD) de forma segura para Date à meia-noite local (evita problemas de fuso)
function fromISO(s) {
  if (!s) return null;
  const parts = s.split("-");
  return new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10),
    0,
    0,
    0,
    0
  );
}

// Formata uma string ISO (AAAA-MM-DD) para exibição brasileira (DD/MM/AAAA)
function formatarDataBr(strIso) {
  if (!strIso) return "";
  const parts = strIso.split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function addDias(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

// Força o início do projeto exatamente no dia 01/06/2026
const dataBaseInicial = new Date(2026, 5, 1, 0, 0, 0, 0); // 01 de Junho de 2026

const DEMANDAS_INICIAIS = [
  {
    id: "1",
    tarefa: "Atividade 01",
    agente: "Equipe Demolição e Civil",
    dataInicio: toISO(dataBaseInicial),
    dataFim: toISO(addDias(dataBaseInicial, 5)),
    progresso: 100,
  },
  {
    id: "2",
    tarefa: "Atividade 02",
    agente: "Equipe Civil",
    dataInicio: toISO(addDias(dataBaseInicial, 0)),
    dataFim: toISO(addDias(dataBaseInicial, 6)),
    progresso: 90,
  },
  {
    id: "3",
    tarefa: "Atividade 03",
    agente: "Encanador / Oficial",
    dataInicio: toISO(addDias(dataBaseInicial, 7)),
    dataFim: toISO(addDias(dataBaseInicial, 11)),
    progresso: 50,
  },
  {
    id: "4",
    tarefa: "Atividade 04",
    agente: "Eletricista / Oficial",
    dataInicio: toISO(addDias(dataBaseInicial, 7)),
    dataFim: toISO(addDias(dataBaseInicial, 13)),
    progresso: 30,
  },
  {
    id: "5",
    tarefa: "Atividade 05",
    agente: "Técnico de TI / Telecom",
    dataInicio: toISO(addDias(dataBaseInicial, 14)),
    dataFim: toISO(addDias(dataBaseInicial, 17)),
    progresso: 0,
  },
  {
    id: "6",
    tarefa: "Atividade 06",
    agente: "Pintor / Ajudante",
    dataInicio: toISO(addDias(dataBaseInicial, 14)),
    dataFim: toISO(addDias(dataBaseInicial, 21)),
    progresso: 0,
  },
  {
    id: "7",
    tarefa: "Atividade 07",
    agente: "Eletricista",
    dataInicio: toISO(addDias(dataBaseInicial, 22)),
    dataFim: toISO(addDias(dataBaseInicial, 25)),
    progresso: 0,
  },
  {
    id: "8",
    tarefa: "Atividade 08",
    agente: "Marceneiro / Montador",
    dataInicio: toISO(addDias(dataBaseInicial, 22)),
    dataFim: toISO(addDias(dataBaseInicial, 30)),
    progresso: 0,
  },
  {
    id: "9",
    tarefa: "Atividade 09",
    agente: "Equipe de Apoio",
    dataInicio: toISO(addDias(dataBaseInicial, 31)),
    dataFim: toISO(addDias(dataBaseInicial, 34)),
    progresso: 0,
  },
  {
    id: "10",
    tarefa: "Atividade 10",
    agente: "Engenheiro Responsável",
    dataInicio: toISO(addDias(dataBaseInicial, 35)),
    dataFim: toISO(addDias(dataBaseInicial, 37)),
    progresso: 0,
  },
  {
    id: "11",
    tarefa: "Atividade 11",
    agente: "Equipe Civil",
    dataInicio: toISO(addDias(dataBaseInicial, 3)),
    dataFim: toISO(addDias(dataBaseInicial, 7)),
    progresso: 0,
  },
  {
    id: "12",
    tarefa: "Atividade 12",
    agente: "Pedreiro / Azulejista",
    dataInicio: toISO(addDias(dataBaseInicial, 8)),
    dataFim: toISO(addDias(dataBaseInicial, 16)),
    progresso: 0,
  },
  {
    id: "13",
    tarefa: "Atividade 13",
    agente: "Encanador Especializado",
    dataInicio: toISO(addDias(dataBaseInicial, 17)),
    dataFim: toISO(addDias(dataBaseInicial, 21)),
    progresso: 0,
  },
  {
    id: "14",
    tarefa: "Atividade 14",
    agente: "Técnico HVAC",
    dataInicio: toISO(addDias(dataBaseInicial, 10)),
    dataFim: toISO(addDias(dataBaseInicial, 15)),
    progresso: 0,
  },
  {
    id: "15",
    tarefa: "Atividade 15",
    agente: "Carpinteiro / Marceneiro",
    dataInicio: toISO(addDias(dataBaseInicial, 12)),
    dataFim: toISO(addDias(dataBaseInicial, 18)),
    progresso: 0,
  },
  {
    id: "16",
    tarefa: "Atividade 16",
    agente: "Serralheiro / Vidraceiro",
    dataInicio: toISO(addDias(dataBaseInicial, 5)),
    dataFim: toISO(addDias(dataBaseInicial, 11)),
    progresso: 0,
  },
  {
    id: "17",
    tarefa: "Atividade 17",
    agente: "Gesseiro Especializado",
    dataInicio: toISO(addDias(dataBaseInicial, 14)),
    dataFim: toISO(addDias(dataBaseInicial, 20)),
    progresso: 0,
  },
  {
    id: "18",
    tarefa: "Atividade 18",
    agente: "Paisagista / Jardineiro",
    dataInicio: toISO(addDias(dataBaseInicial, 28)),
    dataFim: toISO(addDias(dataBaseInicial, 33)),
    progresso: 0,
  },
  {
    id: "19",
    tarefa: "Atividade 19",
    agente: "Engenheiro Eletricista",
    dataInicio: toISO(addDias(dataBaseInicial, 26)),
    dataFim: toISO(addDias(dataBaseInicial, 28)),
    progresso: 0,
  },
  {
    id: "20",
    tarefa: "Atividade 20",
    agente: "Engenheiro Hidráulico",
    dataInicio: toISO(addDias(dataBaseInicial, 26)),
    dataFim: toISO(addDias(dataBaseInicial, 28)),
    progresso: 0,
  },
  {
    id: "21",
    tarefa: "Atividade 21",
    agente: "Técnico de Segurança",
    dataInicio: toISO(addDias(dataBaseInicial, 20)),
    dataFim: toISO(addDias(dataBaseInicial, 24)),
    progresso: 0,
  },
  {
    id: "22",
    tarefa: "Atividade 22",
    agente: "Técnico de Telecom",
    dataInicio: toISO(addDias(dataBaseInicial, 22)),
    dataFim: toISO(addDias(dataBaseInicial, 25)),
    progresso: 0,
  },
  {
    id: "23",
    tarefa: "Atividade 23",
    agente: "Equipe Especializada",
    dataInicio: toISO(addDias(dataBaseInicial, 15)),
    dataFim: toISO(addDias(dataBaseInicial, 23)),
    progresso: 0,
  },
  {
    id: "24",
    tarefa: "Atividade 24",
    agente: "Empresa Especializada",
    dataInicio: toISO(addDias(dataBaseInicial, 18)),
    dataFim: toISO(addDias(dataBaseInicial, 27)),
    progresso: 0,
  },
  {
    id: "25",
    tarefa: "Atividade 25",
    agente: "Despachante / Engenheiro",
    dataInicio: toISO(addDias(dataBaseInicial, 33)),
    dataFim: toISO(addDias(dataBaseInicial, 40)),
    progresso: 0,
  },
];

function calcularEtapaAtual(demandas) {
  const emAndamento = demandas.filter(
    (t) => parseInt(t.progresso) > 0 && parseInt(t.progresso) < 100
  );
  if (emAndamento.length > 0)
    return `ID ${emAndamento[0].id} – ${emAndamento[0].tarefa.substring(
      0,
      28
    )}`;
  const proxima = demandas.find((t) => parseInt(t.progresso) === 0);
  if (proxima) return `ID ${proxima.id} – ${proxima.tarefa.substring(0, 28)}`;
  return "Obra Concluída! 🎉";
}

const TRACK_HEIGHT = 36;

export default function App() {
  const [nomeProjeto, setNomeProjeto] = useState("Nome do Projeto");
  const [observacoes, setObservacoes] = useState(
    "Manter foco no alinhamento das equipes de elétrica e hidráulica para evitar ociosidade."
  );
  const [diretoria, setDiretoria] = useState("Solicitação DI");
  const [setor, setSetor] = useState("SMPO");
  const [engenheiro, setEngenheiro] = useState("Eng. XXX");

  // Define dinamicamente o valor inicial da análise para 11/06/2026 conforme imagem
  const [dataAnalise, setDataAnalise] = useState("2026-06-11");
  const [demandas, setDemandas] = useState(DEMANDAS_INICIAIS);
  const [cards, setCards] = useState({
    duracao: "–",
    inicio: "–",
    fim: "–",
    progresso: "0%",
    etapaAtual: "–",
  });
  const [googleCarregado, setGoogleCarregado] = useState(false);
  const [tooltipRosca, setTooltipRosca] = useState(null);
  const graficoRoscaRef = useRef(null);

  const handleChange = (id, campo, valor) => {
    setDemandas((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (campo === "progresso") {
          const v = Math.min(100, Math.max(0, parseInt(valor) || 0));
          return { ...item, progresso: v };
        }
        return { ...item, [campo]: valor };
      })
    );
  };

  useEffect(() => {
    const carregarScript = (src, cb) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        cb();
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = cb;
      document.body.appendChild(s);
    };
    carregarScript(
      "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4",
      () => {}
    );
    carregarScript("https://cdn.jsdelivr.net/npm/chart.js", () => {});
    carregarScript("https://www.gstatic.com/charts/loader.js", () => {
      if (window.google && window.google.charts) {
        window.google.charts.load("current", {
          packages: ["gantt"],
          language: "pt-br",
        });
        window.google.charts.setOnLoadCallback(() => setGoogleCarregado(true));
      }
    });
  }, []);

  const calcularCards = useCallback(() => {
    const datas = demandas
      .flatMap((t) => [fromISO(t.dataInicio), fromISO(t.dataFim)])
      .filter(Boolean);
    const dataMin = datas.length ? new Date(Math.min(...datas)) : new Date();
    const dataMax = datas.length ? new Date(Math.max(...datas)) : new Date();
    const duracaoDias = Math.round((dataMax - dataMin) / 86400000);
    const mediaProgresso = Math.round(
      demandas.reduce((a, t) => a + (parseInt(t.progresso) || 0), 0) /
        demandas.length
    );

    setCards({
      duracao: `${duracaoDias} dias`,
      inicio: dataMin.toLocaleDateString("pt-BR"),
      fim: dataMax.toLocaleDateString("pt-BR"),
      progresso: `${mediaProgresso}%`,
      etapaAtual: calcularEtapaAtual(demandas),
    });
  }, [demandas]);

  const desenharGantt = useCallback(() => {
    const container = document.getElementById("gantt_chart_bars");
    if (!container || !window.google?.visualization?.Gantt) return;

    const dataTable = new window.google.visualization.DataTable();
    dataTable.addColumn("string", "Task ID");
    dataTable.addColumn("string", "Task Name");
    dataTable.addColumn("string", "Resource");
    dataTable.addColumn("date", "Start Date");
    dataTable.addColumn("date", "End Date");
    dataTable.addColumn("number", "Duration");
    dataTable.addColumn("number", "Percent Complete");
    dataTable.addColumn("string", "Dependencies");

    demandas.forEach((t) => {
      const ini = fromISO(t.dataInicio);
      const fim = fromISO(t.dataFim);
      if (!ini || !fim) return;

      // SOLICITAÇÃO ATENDIDA: Passamos uma string vazia no Name para ocultar a legenda padrão colada na barra
      dataTable.addRow([
        t.id,
        "",
        t.agente,
        ini,
        fim,
        null,
        parseInt(t.progresso) || 0,
        null,
      ]);
    });

    const chart = new window.google.visualization.Gantt(container);
    const chartHeight = Math.max(420, demandas.length * TRACK_HEIGHT + 60);

    chart.draw(dataTable, {
      height: chartHeight,
      gantt: {
        trackHeight: TRACK_HEIGHT,
        criticalPathEnabled: false,
        barHeight: 22,
        shadowEnabled: false,
        innerGridTrack: { fill: "#ffffff" },
        innerGridDarkTrack: { fill: "#f8fafc" },
      },
    });

    // Injeção geométrica precisa e desenho das linhas de marcação temporal
    setTimeout(() => {
      const svg = container.querySelector("svg");
      if (!svg) return;

      // Remove marcações injetadas em renders anteriores para evitar fantasmas visuais
      svg
        .querySelectorAll(".custom-gantt-overlay")
        .forEach((el) => el.remove());

      const allRects = svg.querySelectorAll("rect");
      let minX = Infinity,
        maxX = -Infinity;
      let yInicio = Infinity,
        yFim = -Infinity;

      // Captura o grid interno limitador construído nativamente pelo Google Charts
      allRects.forEach((r) => {
        const w = parseFloat(r.getAttribute("width") || 0);
        const h = parseFloat(r.getAttribute("height") || 0);
        const x = parseFloat(r.getAttribute("x") || 0);
        const y = parseFloat(r.getAttribute("y") || 0);

        if (h > 20 && w > 10 && x > 0) {
          if (x < minX) minX = x;
          if (x + w > maxX) maxX = x + w;
          if (y < yInicio) yInicio = y;
          if (y + h > yFim) yFim = y + h;
        }
      });

      if (minX === Infinity || maxX === -Infinity) return;

      const datas = demandas
        .flatMap((t) => [fromISO(t.dataInicio), fromISO(t.dataFim)])
        .filter(Boolean);
      const dataMin = new Date(Math.min(...datas));
      const dataMax = new Date(Math.max(...datas));
      const totalMs = dataMax - dataMin;
      const totalPx = maxX - minX;
      const svgNS = "http://www.w3.org/2000/svg";

      // Finais de semana estilizados
      const cur = new Date(dataMin);
      while (cur <= dataMax) {
        const dow = cur.getDay();
        if (dow === 6 || dow === 0) {
          const xPos = minX + ((cur - dataMin) / totalMs) * totalPx;
          const dayW = totalPx / (totalMs / 86400000);
          const rect = document.createElementNS(svgNS, "rect");
          rect.setAttribute("class", "custom-gantt-overlay");
          rect.setAttribute("x", xPos);
          rect.setAttribute("y", yInicio);
          rect.setAttribute("width", dayW);
          rect.setAttribute("height", yFim - yInicio);
          rect.setAttribute("fill", "rgba(100,116,139,0.07)");
          rect.setAttribute("pointer-events", "none");
          svg.appendChild(rect);
        }
        cur.setDate(cur.getDate() + 1);
      }

      // Linhas finas verticais limitadoras de dia
      const cur2 = new Date(dataMin);
      while (cur2 <= dataMax) {
        const xPos = minX + ((cur2 - dataMin) / totalMs) * totalPx;
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("class", "custom-gantt-overlay");
        line.setAttribute("x1", xPos);
        line.setAttribute("x2", xPos);
        line.setAttribute("y1", yInicio);
        line.setAttribute("y2", yFim);
        line.setAttribute("stroke", "rgba(148,163,184,0.2)");
        line.setAttribute("stroke-width", "1");
        line.setAttribute("pointer-events", "none");
        svg.appendChild(line);
        cur2.setDate(cur2.getDate() + 1);
      }

      // CORREÇÃO MATEMÁTICA DA LINHA DE ANÁLISE: Alinhamento perfeito dinâmico
      const alvoAnalise = fromISO(dataAnalise);
      if (alvoAnalise) {
        const analiseMs = alvoAnalise - dataMin;
        if (analiseMs >= 0 && analiseMs <= totalMs) {
          const xHoje = minX + (analiseMs / totalMs) * totalPx;

          const line = document.createElementNS(svgNS, "line");
          line.setAttribute("class", "custom-gantt-overlay");
          line.setAttribute("x1", xHoje);
          line.setAttribute("x2", xHoje);
          line.setAttribute("y1", yInicio - 10);
          line.setAttribute("y2", yFim + 5);
          line.setAttribute("stroke", "#e11d48");
          line.setAttribute("stroke-width", "2.5");
          line.setAttribute("stroke-dasharray", "6,4");
          line.setAttribute("pointer-events", "none");
          svg.appendChild(line);

          const circle = document.createElementNS(svgNS, "circle");
          circle.setAttribute("class", "custom-gantt-overlay");
          circle.setAttribute("cx", xHoje);
          circle.setAttribute("cy", yInicio - 10);
          circle.setAttribute("r", "5");
          circle.setAttribute("fill", "#e11d48");
          circle.setAttribute("pointer-events", "none");
          svg.appendChild(circle);

          const label = document.createElementNS(svgNS, "text");
          label.setAttribute("class", "custom-gantt-overlay");
          label.setAttribute("x", xHoje + 8);
          label.setAttribute("y", yInicio - 6);
          label.setAttribute("fill", "#e11d48");
          label.setAttribute("font-size", "11");
          label.setAttribute("font-weight", "bold");
          label.setAttribute("font-family", "sans-serif");
          label.textContent = `Análise (${formatarDataBr(dataAnalise)})`;
          svg.appendChild(label);
        }
      }
    }, 350);
  }, [demandas, dataAnalise]);

  const desenharGrafico = useCallback(() => {
    const ctx = document.getElementById("percentChart");
    if (!ctx || !window.Chart) return;
    if (graficoRoscaRef.current) graficoRoscaRef.current.destroy();

    const chart = new window.Chart(ctx.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: demandas.map((t) => `#${t.id} – ${t.tarefa}`),
        datasets: [
          {
            data: demandas.map((t) => Math.max(parseInt(t.progresso) || 0, 1)),
            backgroundColor: demandas.map((t) =>
              t.progresso >= 100
                ? "#10b981"
                : t.progresso > 0
                ? "#3b82f6"
                : "#cbd5e1"
            ),
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        onHover: (event, elements) => {
          if (elements.length > 0) {
            const idx = elements[0].index;
            const d = demandas[idx];
            const cor =
              d.progresso >= 100
                ? "#10b981"
                : d.progresso > 0
                ? "#3b82f6"
                : "#94a3b8";
            setTooltipRosca({
              id: d.id,
              tarefa: d.tarefa,
              progresso: d.progresso,
              cor,
            });
          } else {
            setTooltipRosca(null);
          }
        },
      },
    });
    graficoRoscaRef.current = chart;
  }, [demandas]);

  useEffect(() => {
    calcularCards();
    desenharGrafico();
    if (googleCarregado || window.google?.visualization?.Gantt) {
      desenharGantt();
    }
  }, [
    demandas,
    googleCarregado,
    dataAnalise,
    calcularCards,
    desenharGantt,
    desenharGrafico,
  ]);

  function baixarCSV() {
    let csv = "\uFEFFNOME DO PROJETO:;" + nomeProjeto + "\n";
    csv += "DIRETORIA:;" + diretoria + "\n";
    csv += "SETOR:;" + setor + "\n";
    csv += "ENGENHEIRO:;" + engenheiro + "\n";
    csv += "DATA_ANALISE:;" + dataAnalise + "\n";
    csv += "OBSERVACOES:;" + observacoes.replace(/\n/g, " ") + "\n\n";
    csv += "ID;Tarefa;Agente;DataInicio;DataFim;Progresso\n";
    demandas.forEach((t) => {
      csv += `${t.id};${t.tarefa};${t.agente};${t.dataInicio};${t.dataFim};${t.progresso}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nomeProjeto.replace(/\s+/g, "_")}_cronograma.csv`;
    a.click();
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
        dtAnalise = "";
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
          dtAnalise = l.split(";")[1]?.trim() || "";
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
          });
      }
      if (nome) setNomeProjeto(nome);
      if (obs) setObservacoes(obs);
      if (dir) setDiretoria(dir);
      if (set) setSetor(set);
      if (eng) setEngenheiro(eng);
      if (dtAnalise) setDataAnalise(dtAnalise);
      if (novos.length) setDemandas(novos);
    };
    reader.readAsText(file);
  }

  const corProgresso = (p) =>
    p >= 100 ? "bg-emerald-500" : p > 0 ? "bg-blue-500" : "bg-gray-300";
  const ganttHeight = Math.max(420, demandas.length * TRACK_HEIGHT + 60);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="bg-slate-800 text-white p-6 rounded-xl shadow-md flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="w-full lg:w-1/2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Nome do Projeto
            </span>
            <input
              type="text"
              value={nomeProjeto}
              onChange={(e) => setNomeProjeto(e.target.value)}
              className="w-full bg-transparent text-2xl font-bold border-b border-dashed border-slate-500 hover:border-white focus:border-blue-400 focus:outline-none py-1 transition"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition shadow-md cursor-pointer flex items-center gap-1">
              📁 Importar (CSV)
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={importarCSV}
              />
            </label>
            <button
              onClick={baixarCSV}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition shadow-md"
            >
              💾 Exportar (CSV)
            </button>
          </div>
        </div>

        {/* Linha de Dados Operacionais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-slate-700">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              🏛️ Diretoria
            </span>
            <input
              type="text"
              value={diretoria}
              onChange={(e) => setDiretoria(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold border-b border-dashed border-slate-600 hover:border-slate-400 focus:border-blue-400 focus:outline-none py-1 mt-0.5 transition text-slate-200"
            />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              🏢 Setor
            </span>
            <input
              type="text"
              value={setor}
              onChange={(e) => setSetor(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold border-b border-dashed border-slate-600 hover:border-slate-400 focus:border-blue-400 focus:outline-none py-1 mt-0.5 transition text-slate-200"
            />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              👷 Engenheiro Responsável
            </span>
            <input
              type="text"
              value={engenheiro}
              onChange={(e) => setEngenheiro(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold border-b border-dashed border-slate-600 hover:border-slate-400 focus:border-blue-400 focus:outline-none py-1 mt-0.5 transition text-slate-200"
            />
          </div>
          <div className="bg-slate-700/50 p-2 rounded-lg border border-slate-600">
            <span className="text-xs text-rose-400 font-bold uppercase tracking-wider block">
              📅 Data de Análise (Gantt)
            </span>
            <input
              type="date"
              value={dataAnalise}
              onChange={(e) => setDataAnalise(e.target.value)}
              className="w-full bg-transparent text-sm font-bold focus:outline-none mt-0.5 text-white cursor-pointer [color-scheme:dark]"
            />
          </div>
        </div>
      </header>

      {/* Observações */}
      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm">
        <label className="text-xs font-bold text-amber-800 uppercase tracking-wider">
          📝 Notas Técnicas e Observações da Obra
        </label>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          rows="2"
          className="w-full bg-transparent text-sm text-slate-700 focus:outline-none resize-y py-1 mt-1"
        />
      </div>

      {/* Cards de Datas Formatados em Padrão Nacional */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          {
            label: "Duração Total",
            value: cards.duracao,
            cor: "text-slate-800",
          },
          {
            label: "Início Programado",
            value: formatarDataBr(demandas[0]?.dataInicio) || cards.inicio,
            cor: "text-blue-600",
          },
          { label: "Fim Programado", value: cards.fim, cor: "text-indigo-600" },
          {
            label: "Evolução Geral",
            value: cards.progresso,
            cor: "text-emerald-600",
          },
        ].map((c, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200"
          >
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {c.label}
            </h3>
            <p className={`text-xl font-bold mt-2 ${c.cor}`}>{c.value}</p>
          </div>
        ))}
        <div className="bg-rose-50/50 p-4 rounded-xl shadow-sm border border-rose-200">
          <h3 className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
            ⚠️ Etapa Atual
          </h3>
          <p
            className="text-sm font-bold text-slate-800 mt-2 truncate"
            title={cards.etapaAtual}
          >
            {cards.etapaAtual}
          </p>
        </div>
      </div>

      {/* Gráfico Analítico de Rosca */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4 text-center">
          Gráfico Analítico de Execução
        </h2>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-shrink-0 w-full lg:w-64">
            <div className="relative h-56">
              <canvas id="percentChart"></canvas>
            </div>
            <div className="flex justify-center gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>{" "}
                Concluído
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span>{" "}
                Em andamento
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-slate-300 inline-block"></span>{" "}
                Não iniciado
              </span>
            </div>
            {tooltipRosca && (
              <div
                className="mt-3 p-3 rounded-lg border text-xs text-center transition-all"
                style={{
                  borderColor: tooltipRosca.cor,
                  backgroundColor: tooltipRosca.cor + "18",
                }}
              >
                <span className="font-bold text-slate-700">
                  #{tooltipRosca.id}
                </span>
                <p className="text-slate-600 mt-0.5 font-medium">
                  {tooltipRosca.tarefa}
                </p>
                <p
                  className="font-bold mt-1"
                  style={{ color: tooltipRosca.cor }}
                >
                  {tooltipRosca.progresso}% concluído
                </p>
              </div>
            )}
          </div>
          <div
            className="flex-1 overflow-y-auto"
            style={{ maxHeight: "320px" }}
          >
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Etapas representadas no gráfico
            </p>
            <div className="space-y-1">
              {demandas.map((t) => {
                const cor =
                  t.progresso >= 100
                    ? "#10b981"
                    : t.progresso > 0
                    ? "#3b82f6"
                    : "#94a3b8";
                const bgCor =
                  t.progresso >= 100
                    ? "bg-emerald-50 border-emerald-200"
                    : t.progresso > 0
                    ? "bg-blue-50 border-blue-200"
                    : "bg-slate-50 border-slate-200";
                return (
                  <div
                    key={t.id}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${bgCor}`}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-[10px]"
                      style={{ backgroundColor: cor }}
                    >
                      {t.id}
                    </span>
                    <span className="font-medium text-slate-700 flex-1 truncate">
                      {t.tarefa}
                    </span>
                    <span
                      className="font-bold flex-shrink-0"
                      style={{ color: cor }}
                    >
                      {t.progresso}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Gantt */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Gráfico de Gantt</h2>
          <span className="flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block w-8 border-t-2 border-dashed border-rose-500"></span>{" "}
              Linha de Análise
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block w-4 h-3 bg-slate-400/20 border border-slate-300"></span>{" "}
              Fim de semana
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block w-px h-3 bg-slate-300"></span> Dia
            </span>
          </span>
        </div>

        <div className="flex overflow-x-auto">
          {/* Painel lateral fixo com ID e Nome da Demanda */}
          <div
            className="flex-shrink-0 border-r border-slate-200 bg-slate-50"
            style={{ minWidth: "240px", width: "240px" }}
          >
            <div className="h-[42px] flex items-center px-3 border-b border-slate-200 bg-white">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                ID / Demanda
              </span>
            </div>
            <div
              style={{ height: `${ganttHeight - 42}px`, overflowY: "hidden" }}
            >
              {demandas.map((t) => {
                const corBar =
                  t.progresso >= 100
                    ? "bg-emerald-500"
                    : t.progresso > 0
                    ? "bg-blue-500"
                    : "bg-slate-300";
                return (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 px-3 border-b border-slate-100 hover:bg-slate-100 transition-colors"
                    style={{ height: `${TRACK_HEIGHT}px` }}
                  >
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${corBar}`}
                    >
                      {t.id}
                    </span>
                    <span
                      className="text-xs text-slate-700 font-semibold truncate leading-tight"
                      title={t.tarefa}
                    >
                      {t.tarefa}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Gráfico de Barras Puro */}
          <div className="flex-1 overflow-x-auto">
            <div id="gantt_chart_bars" style={{ minWidth: "750px" }}></div>
          </div>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Painel de Controle de Demandas
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-3 py-3 w-10 text-center">ID</th>
                <th className="px-4 py-3">Nome da Demanda / Etapa</th>
                <th className="px-4 py-3 bg-indigo-50 text-indigo-900">
                  Agente Responsável
                </th>
                <th className="px-3 py-3 w-40 bg-blue-50 text-blue-900 text-center">
                  Data Início
                </th>
                <th className="px-3 py-3 w-40 bg-blue-50 text-blue-900 text-center">
                  Data Fim
                </th>
                <th className="px-4 py-3 w-40 text-center">Progresso (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {demandas.map((t) => (
                <tr
                  key={t.id}
                  className="bg-white hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-2 font-semibold text-slate-700 text-center">
                    {t.id}
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={t.tarefa}
                      onChange={(e) =>
                        handleChange(t.id, "tarefa", e.target.value)
                      }
                      className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 font-medium text-gray-900 rounded text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 bg-indigo-50/20">
                    <input
                      type="text"
                      value={t.agente}
                      onChange={(e) =>
                        handleChange(t.id, "agente", e.target.value)
                      }
                      className="w-full bg-transparent border-b border-transparent hover:border-indigo-300 focus:border-indigo-500 focus:outline-none px-1 py-0.5 text-xs font-semibold text-indigo-900 rounded"
                    />
                  </td>
                  <td className="px-3 py-2 bg-blue-50/20 text-center">
                    <input
                      type="date"
                      value={t.dataInicio}
                      onChange={(e) =>
                        handleChange(t.id, "dataInicio", e.target.value)
                      }
                      className="text-xs bg-white border border-blue-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500 text-slate-700"
                    />
                  </td>
                  <td className="px-3 py-2 bg-blue-50/20 text-center">
                    <input
                      type="date"
                      value={t.dataFim}
                      onChange={(e) =>
                        handleChange(t.id, "dataFim", e.target.value)
                      }
                      className="text-xs bg-white border border-blue-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500 text-slate-700"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={t.progresso}
                        min="0"
                        max="100"
                        onChange={(e) =>
                          handleChange(t.id, "progresso", e.target.value)
                        }
                        className="w-12 text-center text-xs font-bold bg-gray-50 border border-gray-200 rounded p-1 focus:outline-none"
                      />
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${corProgresso(
                            t.progresso
                          )}`}
                          style={{ width: `${t.progresso}%` }}
                        ></div>
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
  );
}
