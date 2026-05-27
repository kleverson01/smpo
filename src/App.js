import React, { useEffect, useState } from "react";

export default function App() {
  const [nomeProjeto, setNomeProjeto] = useState("Residencial Alfa - Fase 1");
  const [observacoes, setObservacoes] = useState(
    "Manter foco no alinhamento das equipes de elétrica e hidráulica para evitar ociosidade."
  );
  const [dataBaseGeral, setDataBaseGeral] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [dadosProjeto, setDadosProjeto] = useState([
    {
      id: "1",
      tarefa: "Desmontagem das estruturas",
      agente: "Equipe Demolição e Civil",
      dias: 5,
      dependência: "",
      progresso: 100,
    },
    {
      id: "2",
      tarefa: "Preparação de superfícies e alvenaria",
      agente: "Equipe Civil",
      dias: 6,
      dependência: "1",
      progresso: 90,
    },
    {
      id: "3",
      tarefa: "Infraestrutura Hidráulica",
      agente: "Encanador / Oficial",
      dias: 4,
      dependência: "2",
      progresso: 50,
    },
    {
      id: "4",
      tarefa: "Infraestrutura Elétrica",
      agente: "Eletricista / Oficial",
      dias: 6,
      dependência: "2",
      progresso: 30,
    },
    {
      id: "5",
      tarefa: "Passagem de Redes e Dados",
      agente: "Técnico de TI / Telecom",
      dias: 3,
      dependência: "4",
      progresso: 0,
    },
    {
      id: "6",
      tarefa: "Pintura base e acabamentos de parede",
      agente: "Pintor / Ajudante",
      dias: 7,
      dependência: "3,4",
      progresso: 0,
    },
    {
      id: "7",
      tarefa: "Instalação de Iluminação Fina",
      agente: "Eletricista",
      dias: 3,
      dependência: "6",
      progresso: 0,
    },
    {
      id: "8",
      tarefa: "Montagem de Móveis Planejados",
      agente: "Marceneiro / Montador",
      dias: 8,
      dependência: "6",
      progresso: 0,
    },
    {
      id: "9",
      tarefa: "Arremates finais e Limpeza Técnica",
      agente: "Equipe de Apoio",
      dias: 3,
      dependência: "7,8",
      progresso: 0,
    },
    {
      id: "10",
      tarefa: "Entrega das Chaves e As-Built",
      agente: "Engenheiro Responsável",
      dias: 2,
      dependência: "9",
      progresso: 0,
    },
  ]);

  const [cards, setCards] = useState({
    duracao: "0 dias",
    inicio: "--/--/----",
    fim: "--/--/----",
    progresso: "0%",
    etapaAtual: "Nenhuma",
  });

  const handleInputChange = (id, campo, valor) => {
    setDadosProjeto((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let valorTratado = valor;
          if (campo === "dias" || campo === "progresso") {
            valorTratado = Math.max(0, parseInt(valor) || 0);
            if (campo === "progresso")
              valorTratado = Math.min(100, valorTratado);
          }
          return { ...item, [campo]: valorTratado };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    const scripts = [
      "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4",
      "https://cdn.jsdelivr.net/npm/chart.js",
      "https://www.gstatic.com/charts/loader.js",
    ];

    let carregados = 0;
    const inicializarScripts = () => {
      carregados++;
      if (carregados === scripts.length) {
        if (window.google && window.google.charts) {
          window.google.charts.load("current", {
            packages: ["gantt"],
            language: "pt-br",
          });
          window.google.charts.setOnLoadCallback(renderizarPainel);
        }
      }
    };

    scripts.forEach((src) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        inicializarScripts();
      } else {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => inicializarScripts();
        document.body.appendChild(script);
      }
    });
  }, [dadosProjeto, dataBaseGeral]);

  const renderizarPainel = () => {
    calcularDatasEFlutuação();
    atualizarCards();
    desenharGantt();
    desenharGraficoPercentual();
  };

  function calcularDatasEFlutuação() {
    let dataBase = new Date(dataBaseGeral + "T00:00:00");
    let mapaTarefas = {};

    dadosProjeto.forEach((t) => {
      mapaTarefas[t.id] = t;
    });

    dadosProjeto.forEach((t) => {
      if (!t.dependência) {
        t.dataInicio = new Date(dataBase);
      } else {
        let deps = t.dependência.split(",");
        let maxDataTermino = new Date(dataBase);
        deps.forEach((depId) => {
          let dep = mapaTarefas[depId.trim()];
          if (dep && dep.dataTermino && dep.dataTermino > maxDataTermino) {
            maxDataTermino = new Date(dep.dataTermino);
          }
        });
        t.dataInicio = new Date(maxDataTermino);
        t.dataInicio.setDate(t.dataInicio.getDate() + 1);
      }
      t.dataTermino = new Date(t.dataInicio);
      t.dataTermino.setDate(t.dataTermino.getDate() + parseInt(t.dias || 1));
    });
  }

  function atualizarCards() {
    const totalDias = dadosProjeto.reduce(
      (acc, t) => acc + parseInt(t.dias || 0),
      0
    );
    const mediaProgresso = Math.round(
      dadosProjeto.reduce((acc, t) => acc + parseInt(t.progresso || 0), 0) /
        dadosProjeto.length
    );

    // Encontra as datas extremas do cronograma
    const todasDatasInicio = dadosProjeto
      .map((t) => t.dataInicio)
      .filter(Boolean);
    const todasDatasTermino = dadosProjeto
      .map((t) => t.dataTermino)
      .filter(Boolean);

    const dataMinima = todasDatasInicio.length
      ? new Date(Math.min(...todasDatasInicio))
      : new Date();
    const dataMaxima = todasDatasTermino.length
      ? new Date(Math.max(...todasDatasTermino))
      : new Date();

    const primeiraEtapaParada = dadosProjeto.find(
      (t) => (parseInt(t.progresso) || 0) < 100
    );
    const textoEtapaParada = primeiraEtapaParada
      ? `ID ${primeiraEtapaParada.id} - ${primeiraEtapaParada.tarefa.substring(
          0,
          22
        )}...`
      : "Obra Concluída! 🎉";

    setCards({
      duracao: `${totalDias} Dias Úteis`,
      inicio: dataMinima.toLocaleDateString("pt-BR"),
      fim: dataMaxima.toLocaleDateString("pt-BR"),
      progresso: `${mediaProgresso}%`,
      etapaAtual: textoEtapaParada,
    });
  }

  function desenharGantt() {
    const container = document.getElementById("gantt_chart");
    if (
      !container ||
      !window.google ||
      !window.google.visualization ||
      !window.google.visualization.Gantt
    )
      return;

    const dataTable = new window.google.visualization.DataTable();
    dataTable.addColumn("string", "Task ID");
    dataTable.addColumn("string", "Task Name");
    dataTable.addColumn("string", "Resource");
    dataTable.addColumn("date", "Start Date");
    dataTable.addColumn("date", "End Date");
    dataTable.addColumn("number", "Duration");
    dataTable.addColumn("number", "Percent Complete");
    dataTable.addColumn("string", "Dependencies");

    dadosProjeto.forEach((t) => {
      dataTable.addRow([
        t.id,
        t.tarefa,
        t.agente,
        t.dataInicio,
        t.dataTermino,
        null,
        parseInt(t.progresso) || 0,
        t.dependência ? t.dependência : null,
      ]);
    });

    const chart = new window.google.visualization.Gantt(container);
    chart.draw(dataTable, {
      height: 420,
      gantt: {
        trackHeight: 38,
        criticalPathEnabled: true,
        criticalPathStyle: { stroke: "#e11d48", strokeWidth: 2 },
      },
    });
  }

  function desenharGraficoPercentual() {
    const ctx = document.getElementById("percentChart");
    if (!ctx || !window.Chart) return;

    if (window.meuGraficoRosca) window.meuGraficoRosca.destroy();

    window.meuGraficoRosca = new window.Chart(ctx.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: dadosProjeto.map((t) => `ID ${t.id}`),
        datasets: [
          {
            data: dadosProjeto.map((t) => parseInt(t.progresso) || 0),
            backgroundColor: dadosProjeto.map((t) =>
              t.progresso === 100
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
  }

  function baixarCSVModelo() {
    let csvContent = "\uFEFFNOME DO PROJETO: ;" + nomeProjeto + "\n";
    csvContent += "OBSERVACOES: ;" + observacoes.replace(/\n/g, " ") + "\n\n";
    csvContent += "ID;Tarefa;Agente;Dias;Dependencia;Progresso\n";
    dadosProjeto.forEach((t) => {
      csvContent += `${t.id};${t.tarefa};${t.agente};${t.dias};${t.dependência};${t.progresso}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${nomeProjeto.replace(/\s+/g, "_")}_cronograma.csv`;
    link.click();
  }

  function importarCSV(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
      const linhas = evt.target.result.split("\n");
      let novosDados = [];
      let nomeExtraido = "";
      let obsExtraidas = "";

      for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i].trim();
        if (linha === "") continue;

        if (linha.startsWith("NOME DO PROJETO:")) {
          nomeExtraido = linha.split(";")[1]?.trim() || "";
          continue;
        }
        if (linha.startsWith("OBSERVACOES:")) {
          obsExtraidas = linha.split(";")[1]?.trim() || "";
          continue;
        }
        if (linha.startsWith("ID;Tarefa;")) continue; // Pula cabeçalho da tabela

        const colunas = linha.split(";");
        if (colunas.length >= 6) {
          novosDados.push({
            id: colunas[0].trim(),
            tarefa: colunas[1].trim(),
            agente: colunas[2].trim(),
            dias: parseInt(colunas[3].trim()) || 1,
            dependência:
              colunas[4].trim() === "null" || colunas[4].trim() === ""
                ? ""
                : colunas[4].trim(),
            progresso: parseInt(colunas[5].trim()) || 0,
          });
        }
      }

      if (nomeExtraido) setNomeProjeto(nomeExtraido);
      if (obsExtraidas) setObservacoes(obsExtraidas);
      if (novosDados.length > 0) setDadosProjeto(novosDados);
    };
    reader.readAsText(file);
  }

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
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-medium mb-1">
              Data de Partida:
            </span>
            <input
              type="date"
              value={dataBaseGeral}
              onChange={(e) => setDataBaseGeral(e.target.value)}
              className="bg-slate-700 text-white text-sm px-3 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2 mt-4 lg:mt-0">
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition shadow-md cursor-pointer flex items-center">
              📁 Importar Projeto (CSV)
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={importarCSV}
              />
            </label>
            <button
              onClick={baixarCSVModelo}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition shadow-md"
            >
              💾 Exportar (CSV)
            </button>
          </div>
        </div>
      </header>

      {/* Observações */}
      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm flex flex-col gap-1">
        <label className="text-xs font-bold text-amber-800 uppercase tracking-wider">
          📝 Notas Técnicas e Observações da Obra
        </label>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          rows="2"
          className="w-full bg-transparent text-sm text-slate-700 focus:outline-none resize-y transition py-1"
          placeholder="Adicione observações importantes..."
        />
      </div>

      {/* Indicadores Atualizados */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Duração Total
          </h3>
          <p className="text-xl font-bold text-slate-800 mt-2">
            {cards.duracao}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            🗓️ Início Programado
          </h3>
          <p className="text-xl font-bold text-blue-600 mt-2">{cards.inicio}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            🏁 Fim Programado
          </h3>
          <p className="text-xl font-bold text-indigo-600 mt-2">{cards.fim}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Evolução Geral
          </h3>
          <p className="text-xl font-bold text-emerald-600 mt-2">
            {cards.progresso}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-200 bg-rose-50/30">
          <h3 className="text-xs font-medium text-rose-600 font-semibold uppercase tracking-wider">
            ⚠️ Etapa / Gargalo
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
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Gráfico de Gantt Dinâmico (Caminho Crítico em Vermelho)
          </h2>
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
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-2">
          Painel de Controle de Demandas
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-3 py-3 w-12">ID</th>
                <th className="px-4 py-3">Nome da Demanda / Etapa</th>
                <th className="px-4 py-3 bg-indigo-50 text-indigo-900">
                  Agente Responsável
                </th>
                <th className="px-4 py-3 w-28 text-center bg-blue-50 text-blue-900">
                  Prazo (Dias)
                </th>
                <th className="px-4 py-3 w-32">Progresso (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dadosProjeto.map((t) => (
                <tr
                  key={t.id}
                  className="bg-white border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-3 font-semibold text-slate-700">
                    {t.id}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={t.tarefa}
                      onChange={(e) =>
                        handleInputChange(t.id, "tarefa", e.target.value)
                      }
                      className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:bg-white px-1 py-1 font-medium text-gray-900 rounded transition"
                    />
                  </td>
                  <td className="px-4 py-3 bg-indigo-50/30">
                    <input
                      type="text"
                      value={t.agente}
                      onChange={(e) =>
                        handleInputChange(t.id, "agente", e.target.value)
                      }
                      className="w-full font-semibold bg-transparent border-b border-transparent hover:border-indigo-300 focus:border-indigo-600 focus:bg-white text-xs px-2 py-1 rounded transition text-indigo-950"
                    />
                  </td>
                  <td className="px-4 py-3 bg-blue-50/30">
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="number"
                        value={t.dias}
                        onChange={(e) =>
                          handleInputChange(t.id, "dias", e.target.value)
                        }
                        className="w-14 text-center font-bold text-slate-800 bg-white border border-blue-200 rounded p-1 focus:outline-none focus:border-blue-500"
                        min="1"
                      />
                      <span className="text-xs text-slate-500 font-semibold">
                        d
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={t.progresso}
                        onChange={(e) =>
                          handleInputChange(t.id, "progresso", e.target.value)
                        }
                        className="w-14 text-center text-xs font-semibold bg-gray-50 border border-gray-200 rounded p-1"
                        min="0"
                        max="100"
                      />
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full"
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
