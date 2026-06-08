import React, { useEffect, useState, useCallback } from "react";

const hoje = new Date();
hoje.setHours(0, 0, 0, 0);

function toISO(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toISOString().split("T")[0];
}

function fromISO(s) {
  if (!s) return null;
  return new Date(s + "T00:00:00");
}

function addDias(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

const DEMANDAS_INICIAIS = [
  {
    id: "1",
    tarefa: "Desmontagem das estruturas",
    agente: "Equipe Demolição e Civil",
    dataInicio: toISO(hoje),
    dataFim: toISO(addDias(hoje, 5)),
    progresso: 100,
  },
  {
    id: "2",
    tarefa: "Preparação de superfícies e alvenaria",
    agente: "Equipe Civil",
    dataInicio: toISO(addDias(hoje, 0)),
    dataFim: toISO(addDias(hoje, 6)),
    progresso: 90,
  },
  {
    id: "3",
    tarefa: "Infraestrutura Hidráulica",
    agente: "Encanador / Oficial",
    dataInicio: toISO(addDias(hoje, 7)),
    dataFim: toISO(addDias(hoje, 11)),
    progresso: 50,
  },
  {
    id: "4",
    tarefa: "Infraestrutura Elétrica",
    agente: "Eletricista / Oficial",
    dataInicio: toISO(addDias(hoje, 7)),
    dataFim: toISO(addDias(hoje, 13)),
    progresso: 30,
  },
  {
    id: "5",
    tarefa: "Passagem de Redes e Dados",
    agente: "Técnico de TI / Telecom",
    dataInicio: toISO(addDias(hoje, 14)),
    dataFim: toISO(addDias(hoje, 17)),
    progresso: 0,
  },
  {
    id: "6",
    tarefa: "Pintura base e acabamentos de parede",
    agente: "Pintor / Ajudante",
    dataInicio: toISO(addDias(hoje, 14)),
    dataFim: toISO(addDias(hoje, 21)),
    progresso: 0,
  },
  {
    id: "7",
    tarefa: "Instalação de Iluminação Fina",
    agente: "Eletricista",
    dataInicio: toISO(addDias(hoje, 22)),
    dataFim: toISO(addDias(hoje, 25)),
    progresso: 0,
  },
  {
    id: "8",
    tarefa: "Montagem de Móveis Planejados",
    agente: "Marceneiro / Montador",
    dataInicio: toISO(addDias(hoje, 22)),
    dataFim: toISO(addDias(hoje, 30)),
    progresso: 0,
  },
  {
    id: "9",
    tarefa: "Arremates finais e Limpeza Técnica",
    agente: "Equipe de Apoio",
    dataInicio: toISO(addDias(hoje, 31)),
    dataFim: toISO(addDias(hoje, 34)),
    progresso: 0,
  },
  {
    id: "10",
    tarefa: "Entrega das Chaves e As-Built",
    agente: "Engenheiro Responsável",
    dataInicio: toISO(addDias(hoje, 35)),
    dataFim: toISO(addDias(hoje, 37)),
    progresso: 0,
  },
  {
    id: "11",
    tarefa: "Impermeabilização de Banheiros",
    agente: "Equipe Civil",
    dataInicio: toISO(addDias(hoje, 3)),
    dataFim: toISO(addDias(hoje, 7)),
    progresso: 0,
  },
  {
    id: "12",
    tarefa: "Instalação de Pisos e Rodapés",
    agente: "Pedreiro / Azulejista",
    dataInicio: toISO(addDias(hoje, 8)),
    dataFim: toISO(addDias(hoje, 16)),
    progresso: 0,
  },
  {
    id: "13",
    tarefa: "Colocação de Louças e Metais",
    agente: "Encanador Especializado",
    dataInicio: toISO(addDias(hoje, 17)),
    dataFim: toISO(addDias(hoje, 21)),
    progresso: 0,
  },
  {
    id: "14",
    tarefa: "Instalação de Ar Condicionado",
    agente: "Técnico HVAC",
    dataInicio: toISO(addDias(hoje, 10)),
    dataFim: toISO(addDias(hoje, 15)),
    progresso: 0,
  },
  {
    id: "15",
    tarefa: "Instalação de Portas e Batentes",
    agente: "Carpinteiro / Marceneiro",
    dataInicio: toISO(addDias(hoje, 12)),
    dataFim: toISO(addDias(hoje, 18)),
    progresso: 0,
  },
  {
    id: "16",
    tarefa: "Instalação de Janelas e Esquadrias",
    agente: "Serralheiro / Vidraceiro",
    dataInicio: toISO(addDias(hoje, 5)),
    dataFim: toISO(addDias(hoje, 11)),
    progresso: 0,
  },
  {
    id: "17",
    tarefa: "Gesso e Forro",
    agente: "Gesseiro Especializado",
    dataInicio: toISO(addDias(hoje, 14)),
    dataFim: toISO(addDias(hoje, 20)),
    progresso: 0,
  },
  {
    id: "18",
    tarefa: "Paisagismo e Área Externa",
    agente: "Paisagista / Jardineiro",
    dataInicio: toISO(addDias(hoje, 28)),
    dataFim: toISO(addDias(hoje, 33)),
    progresso: 0,
  },
  {
    id: "19",
    tarefa: "Teste e Vistoria Elétrica",
    agente: "Engenheiro Eletricista",
    dataInicio: toISO(addDias(hoje, 26)),
    dataFim: toISO(addDias(hoje, 28)),
    progresso: 0,
  },
  {
    id: "20",
    tarefa: "Teste e Vistoria Hidráulica",
    agente: "Engenheiro Hidráulico",
    dataInicio: toISO(addDias(hoje, 26)),
    dataFim: toISO(addDias(hoje, 28)),
    progresso: 0,
  },
  {
    id: "21",
    tarefa: "Instalação de Câmeras e Alarmes",
    agente: "Técnico de Segurança",
    dataInicio: toISO(addDias(hoje, 20)),
    dataFim: toISO(addDias(hoje, 24)),
    progresso: 0,
  },
  {
    id: "22",
    tarefa: "Instalação de Intercomunicadores",
    agente: "Técnico de Telecom",
    dataInicio: toISO(addDias(hoje, 22)),
    dataFim: toISO(addDias(hoje, 25)),
    progresso: 0,
  },
  {
    id: "23",
    tarefa: "Acabamento de Fachada Externa",
    agente: "Equipe Especializada",
    dataInicio: toISO(addDias(hoje, 15)),
    dataFim: toISO(addDias(hoje, 23)),
    progresso: 0,
  },
  {
    id: "24",
    tarefa: "Instalação de Elevador / Plataforma",
    agente: "Empresa Especializada",
    dataInicio: toISO(addDias(hoje, 18)),
    dataFim: toISO(addDias(hoje, 27)),
    progresso: 0,
  },
  {
    id: "25",
    tarefa: "Documentação e Habite-se",
    agente: "Despachante / Engenheiro",
    dataInicio: toISO(addDias(hoje, 33)),
    dataFim: toISO(addDias(hoje, 40)),
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

export default function App() {
  const [nomeProjeto, setNomeProjeto] = useState("Residencial Alfa – Fase 1");
  const [observacoes, setObservacoes] = useState(
    "Manter foco no alinhamento das equipes de elétrica e hidráulica para evitar ociosidade."
  );
  const [demandas, setDemandas] = useState(DEMANDAS_INICIAIS);
  const [cards, setCards] = useState({
    duracao: "–",
    inicio: "–",
    fim: "–",
    progresso: "0%",
    etapaAtual: "–",
  });
  const [googleCarregado, setGoogleCarregado] = useState(false);

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
    const container = document.getElementById("gantt_chart");
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
      dataTable.addRow([
        t.id,
        t.tarefa,
        t.agente,
        ini,
        fim,
        null,
        parseInt(t.progresso) || 0,
        null,
      ]);
    });

    const chart = new window.google.visualization.Gantt(container);
    chart.draw(dataTable, {
      height: Math.max(420, demandas.length * 42 + 60),
      gantt: {
        trackHeight: 36,
        criticalPathEnabled: false,
        barHeight: 20,
        labelStyle: { fontName: "sans-serif", fontSize: 11 },
        shadowEnabled: false,
      },
    });

    // Linha do dia atual e marcação de finais de semana
    setTimeout(() => {
      const svg = container.querySelector("svg");
      if (!svg) return;

      const svgRect = svg.getBoundingClientRect();
      const allRects = svg.querySelectorAll("rect");
      let minX = Infinity,
        maxX = -Infinity,
        barY = 0,
        barH = 0;
      let yInicio = Infinity,
        yFim = -Infinity;

      // descobrir a área de barras pelo maior rect horizontal de fundo (track)
      allRects.forEach((r) => {
        const w = parseFloat(r.getAttribute("width") || 0);
        const h = parseFloat(r.getAttribute("height") || 0);
        const x = parseFloat(r.getAttribute("x") || 0);
        if (w > 200 && h > 20) {
          if (x < minX) minX = x;
          if (x + w > maxX) maxX = x + w;
          const y = parseFloat(r.getAttribute("y") || 0);
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

      // Finais de semana
      const cur = new Date(dataMin);
      while (cur <= dataMax) {
        const dow = cur.getDay();
        if (dow === 6 || dow === 0) {
          const xPos = minX + ((cur - dataMin) / totalMs) * totalPx;
          const dayW = totalPx / (totalMs / 86400000);
          const rect = document.createElementNS(svgNS, "rect");
          rect.setAttribute("x", xPos);
          rect.setAttribute("y", yInicio);
          rect.setAttribute("width", dayW);
          rect.setAttribute("height", yFim - yInicio);
          rect.setAttribute("fill", "rgba(100,116,139,0.10)");
          rect.setAttribute("pointer-events", "none");
          svg.appendChild(rect);
        }
        cur.setDate(cur.getDate() + 1);
      }

      // Linha de hoje
      const hojeMs = hoje - dataMin;
      if (hojeMs >= 0 && hojeMs <= totalMs) {
        const xHoje = minX + (hojeMs / totalMs) * totalPx;
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", xHoje);
        line.setAttribute("x2", xHoje);
        line.setAttribute("y1", yInicio - 10);
        line.setAttribute("y2", yFim + 5);
        line.setAttribute("stroke", "#e11d48");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("stroke-dasharray", "5,3");
        line.setAttribute("pointer-events", "none");
        svg.appendChild(line);

        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", xHoje);
        circle.setAttribute("cy", yInicio - 10);
        circle.setAttribute("r", "5");
        circle.setAttribute("fill", "#e11d48");
        circle.setAttribute("pointer-events", "none");
        svg.appendChild(circle);

        const label = document.createElementNS(svgNS, "text");
        label.setAttribute("x", xHoje + 7);
        label.setAttribute("y", yInicio - 5);
        label.setAttribute("fill", "#e11d48");
        label.setAttribute("font-size", "11");
        label.setAttribute("font-weight", "bold");
        label.setAttribute("font-family", "sans-serif");
        label.textContent = "Hoje";
        svg.appendChild(label);
      }
    }, 400);
  }, [demandas]);

  const desenharGrafico = useCallback(() => {
    const ctx = document.getElementById("percentChart");
    if (!ctx || !window.Chart) return;
    if (window._graficoRosca) window._graficoRosca.destroy();
    window._graficoRosca = new window.Chart(ctx.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: demandas.map((t) => `ID ${t.id}`),
        datasets: [
          {
            data: demandas.map((t) => parseInt(t.progresso) || 0),
            backgroundColor: demandas.map((t) =>
              t.progresso >= 100
                ? "#10b981"
                : t.progresso > 0
                ? "#3b82f6"
                : "#94a3b8"
            ),
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });
  }, [demandas]);

  useEffect(() => {
    calcularCards();
    desenharGrafico();
    if (googleCarregado) desenharGantt();
    else if (window.google?.visualization?.Gantt) desenharGantt();
  }, [
    demandas,
    googleCarregado,
    calcularCards,
    desenharGantt,
    desenharGrafico,
  ]);

  function baixarCSV() {
    let csv = "\uFEFFNOME DO PROJETO:;" + nomeProjeto + "\n";
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
        obs = "";
      for (const linha of linhas) {
        const l = linha.trim();
        if (!l) continue;
        if (l.startsWith("NOME DO PROJETO:")) {
          nome = l.split(";")[1]?.trim() || "";
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
            progresso: parseInt(c[5].trim()) || 0,
          });
      }
      if (nome) setNomeProjeto(nome);
      if (obs) setObservacoes(obs);
      if (novos.length) setDemandas(novos);
    };
    reader.readAsText(file);
  }

  const corProgresso = (p) =>
    p >= 100 ? "bg-emerald-500" : p > 0 ? "bg-blue-500" : "bg-gray-300";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="bg-slate-800 text-white p-6 rounded-xl shadow-md flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
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

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          {
            label: "Duração Total",
            value: cards.duracao,
            cor: "text-slate-800",
          },
          {
            label: "🗓️ Início Programado",
            value: cards.inicio,
            cor: "text-blue-600",
          },
          {
            label: "🏁 Fim Programado",
            value: cards.fim,
            cor: "text-indigo-600",
          },
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

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-800">
              Gráfico de Gantt
            </h2>
            <span className="flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-8 border-t-2 border-dashed border-rose-500"></span>{" "}
                Hoje
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-4 h-3 bg-slate-400/20 border border-slate-300"></span>{" "}
                Fim de semana
              </span>
            </span>
          </div>
          <div
            id="gantt_chart"
            style={{ overflowX: "auto", minHeight: "400px" }}
          ></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <h2 className="text-lg font-bold text-slate-800 mb-4 text-center">
            Gráfico Analítico de Execução
          </h2>
          <div className="relative h-64">
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
              <span className="w-3 h-3 rounded-sm bg-gray-300 inline-block"></span>{" "}
              Não iniciado
            </span>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Painel de Controle de Demandas
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-3 py-3 w-10">ID</th>
                <th className="px-4 py-3">Nome da Demanda / Etapa</th>
                <th className="px-4 py-3 bg-indigo-50 text-indigo-900">
                  Agente Responsável
                </th>
                <th className="px-3 py-3 w-36 bg-blue-50 text-blue-900">
                  Data Início
                </th>
                <th className="px-3 py-3 w-36 bg-blue-50 text-blue-900">
                  Data Fim
                </th>
                <th className="px-4 py-3 w-36">Progresso (%)</th>
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
                      className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 font-medium text-gray-900 rounded transition text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 bg-indigo-50/20">
                    <input
                      type="text"
                      value={t.agente}
                      onChange={(e) =>
                        handleChange(t.id, "agente", e.target.value)
                      }
                      className="w-full bg-transparent border-b border-transparent hover:border-indigo-300 focus:border-indigo-500 focus:outline-none px-1 py-0.5 text-xs font-semibold text-indigo-900 rounded transition"
                    />
                  </td>
                  <td className="px-3 py-2 bg-blue-50/20">
                    <input
                      type="date"
                      value={t.dataInicio}
                      onChange={(e) =>
                        handleChange(t.id, "dataInicio", e.target.value)
                      }
                      className="w-full text-xs bg-white border border-blue-200 rounded px-1 py-1 focus:outline-none focus:border-blue-500 text-slate-700"
                    />
                  </td>
                  <td className="px-3 py-2 bg-blue-50/20">
                    <input
                      type="date"
                      value={t.dataFim}
                      onChange={(e) =>
                        handleChange(t.id, "dataFim", e.target.value)
                      }
                      className="w-full text-xs bg-white border border-blue-200 rounded px-1 py-1 focus:outline-none focus:border-blue-500 text-slate-700"
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
                        className="w-14 text-center text-xs font-semibold bg-gray-50 border border-gray-200 rounded p-1 focus:outline-none"
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
