"use client";

import { useState } from "react";
import type { Aluno, Turma } from "../page";

type Presenca = {
  id: string;
  aula_id: string;
  aluno_id: string;
  status: "presente" | "falta" | "justificada";
  registrado_em: string;
};

type Aula = {
  id: string;
  turma_id: string;
  data_hora_inicio: string;
};

type Props = {
  alunos: Aluno[];
  turmas: Turma[];
  presencas: Presenca[];
  aulas: Aula[];
};

const LIMITE_FREQUENCIA = 75;

export default function Relatorios({
  alunos,
  turmas,
  presencas,
  aulas,
}: Props) {
  const [turmaSelecionada, setTurmaSelecionada] = useState("todas");

  // Turmas e alunos considerados pelo filtro selecionado
  const alunosFiltrados = alunos.filter(
    (aluno) =>
      turmaSelecionada === "todas" ||
      aluno.turmaId === turmaSelecionada
  );

  const turmasFiltradas = turmas.filter(
    (turma) =>
      turmaSelecionada === "todas" ||
      turma.id === turmaSelecionada
  );

  // Aulas pertencentes às turmas selecionadas
  const aulasFiltradas = aulas.filter((aula) =>
    turmaSelecionada === "todas"
      ? true
      : aula.turma_id === turmaSelecionada
  );

  const idsAulas = new Set(aulasFiltradas.map((aula) => aula.id));

  // Presenças referentes às aulas selecionadas
  const presencasFiltradas = presencas.filter((presenca) =>
    idsAulas.has(presenca.aula_id)
  );

  // Calcula a frequência individual de um aluno
  function calcularFrequencia(aluno: Aluno) {
    const aulasDaTurma = aulas.filter(
      (aula) => aula.turma_id === aluno.turmaId
    );

    const idsAulasAluno = new Set(
      aulasDaTurma.map((aula) => aula.id)
    );

    const registros = presencas.filter(
      (presenca) =>
        presenca.aluno_id === aluno.id &&
        idsAulasAluno.has(presenca.aula_id)
    );

    const totalAulas = registros.length;

    const quantidadePresencas = registros.filter(
      (registro) => registro.status === "presente"
    ).length;

    const faltas = registros.filter(
      (registro) => registro.status === "falta"
    ).length;

    const justificadas = registros.filter(
      (registro) => registro.status === "justificada"
    ).length;

    const percentual =
      totalAulas > 0
        ? (quantidadePresencas / totalAulas) * 100
        : null;

    return {
      totalAulas,
      presencas: quantidadePresencas,
      faltas,
      justificadas,
      percentual,
    };
  }

  // Indicadores gerais
  const totalPresencas = presencasFiltradas.filter(
    (registro) => registro.status === "presente"
  ).length;

  const mediaFrequencia =
    presencasFiltradas.length > 0
      ? (totalPresencas / presencasFiltradas.length) * 100
      : null;

  // Alunos abaixo do limite de frequência
  const alunosEmAlerta = alunosFiltrados.filter((aluno) => {
    const resultado = calcularFrequencia(aluno);

    return (
      resultado.percentual !== null &&
      resultado.percentual < LIMITE_FREQUENCIA
    );
  });

  return (
    <section className="rounded-xl border border-engnet-roxo bg-engnet-preto p-6">
      <h2 className="text-2xl font-bold text-white">
        Relatórios
      </h2>

      <p className="mt-1 text-sm text-gray-400">
        Acompanhe a frequência dos alunos e o desempenho das turmas.
      </p>

      {/* FILTRO */}
      <div className="mt-6">
        <label className="mb-2 block text-sm text-gray-300">
          Selecionar turma
        </label>

        <select
          value={turmaSelecionada}
          onChange={(e) => setTurmaSelecionada(e.target.value)}
          className="w-full rounded-lg border border-engnet-roxo bg-black px-4 py-3 text-white md:w-1/2"
        >
          <option value="todas">Todas as turmas</option>

          {turmas.map((turma) => (
            <option key={turma.id} value={turma.id}>
              {turma.nome} - {turma.codigo}
            </option>
          ))}
        </select>
      </div>

      {/* INDICADORES */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-black p-4">
          <p className="text-sm text-gray-400">Total de alunos</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {alunosFiltrados.length}
          </p>
        </div>

        <div className="rounded-lg bg-black p-4">
          <p className="text-sm text-gray-400">Chamadas realizadas</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {aulasFiltradas.length}
          </p>
        </div>

        <div className="rounded-lg bg-black p-4">
          <p className="text-sm text-gray-400">Média de frequência</p>
          <p className="mt-2 text-2xl font-bold text-green-400">
            {mediaFrequencia !== null
              ? `${mediaFrequencia.toFixed(1)}%`
              : "Sem registros"}
          </p>
        </div>
      </div>

      {/* FREQUÊNCIA INDIVIDUAL */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-white">
          Frequência individual
        </h3>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-white">
            <thead>
              <tr className="border-b border-engnet-roxo text-gray-400">
                <th className="p-3">Aluno</th>
                <th className="p-3">Matrícula</th>
                <th className="p-3">Aulas</th>
                <th className="p-3">Presenças</th>
                <th className="p-3">Faltas</th>
                <th className="p-3">Justificadas</th>
                <th className="p-3">Frequência</th>
              </tr>
            </thead>

            <tbody>
              {alunosFiltrados.map((aluno) => {
                const resultado = calcularFrequencia(aluno);

                return (
                  <tr key={aluno.id} className="border-b border-gray-800">
                    <td className="p-3">{aluno.nome}</td>

                    <td className="p-3 text-gray-400">
                      {aluno.matricula}
                    </td>

                    <td className="p-3">
                      {resultado.totalAulas}
                    </td>

                    <td className="p-3 text-green-400">
                      {resultado.presencas}
                    </td>

                    <td className="p-3 text-red-400">
                      {resultado.faltas}
                    </td>

                    <td className="p-3 text-yellow-400">
                      {resultado.justificadas}
                    </td>

                    <td className="p-3">
                      {resultado.percentual === null ? (
                        <span className="text-gray-400">
                          Sem registros
                        </span>
                      ) : (
                        <span
                          className={
                            resultado.percentual < LIMITE_FREQUENCIA
                              ? "font-bold text-red-400"
                              : "font-bold text-green-400"
                          }
                        >
                          {resultado.percentual.toFixed(1)}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {alunosFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-6 text-center text-gray-400"
                  >
                    Nenhum aluno cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BAIXA FREQUÊNCIA */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-white">
          Alertas de baixa frequência
        </h3>

        <p className="mt-1 text-sm text-gray-400">
          Alunos com frequência abaixo de {LIMITE_FREQUENCIA}%.
        </p>

        <div className="mt-4 space-y-3">
          {alunosEmAlerta.map((aluno) => {
            const resultado = calcularFrequencia(aluno);

            const turma = turmas.find(
              (item) => item.id === aluno.turmaId
            );

            return (
              <div
                key={aluno.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-900 bg-black p-4"
              >
                <div>
                  <p className="font-bold text-white">{aluno.nome}</p>

                  <p className="text-sm text-gray-400">
                    {turma?.nome} · Matrícula: {aluno.matricula}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-red-400">
                    {resultado.percentual?.toFixed(1)}%
                  </p>

                  <p className="text-xs text-gray-400">
                    {resultado.faltas} falta(s)
                  </p>
                </div>
              </div>
            );
          })}

          {alunosEmAlerta.length === 0 && (
            <p className="rounded-lg bg-black p-4 text-sm text-gray-400">
              Nenhum aluno com baixa frequência nos registros disponíveis.
            </p>
          )}
        </div>
      </div>

      {/* RESUMO POR TURMA */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-white">
          Frequência por turma
        </h3>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-white">
            <thead>
              <tr className="border-b border-engnet-roxo text-gray-400">
                <th className="p-3">Turma</th>
                <th className="p-3">Alunos</th>
                <th className="p-3">Chamadas</th>
                <th className="p-3">Frequência média</th>
              </tr>
            </thead>

            <tbody>
              {turmasFiltradas.map((turma) => {
                const aulasTurma = aulas.filter(
                  (aula) => aula.turma_id === turma.id
                );

                const idsAulasTurma = new Set(
                  aulasTurma.map((aula) => aula.id)
                );

                const registros = presencas.filter(
                  (presenca) =>
                    idsAulasTurma.has(presenca.aula_id)
                );

                const quantidadePresencas = registros.filter(
                  (registro) => registro.status === "presente"
                ).length;

                const media =
                  registros.length > 0
                    ? (quantidadePresencas / registros.length) * 100
                    : null;

                const quantidadeAlunos = alunos.filter(
                  (aluno) => aluno.turmaId === turma.id
                ).length;

                return (
                  <tr
                    key={turma.id}
                    className="border-b border-gray-800"
                  >
                    <td className="p-3">{turma.nome}</td>

                    <td className="p-3">
                      {quantidadeAlunos}
                    </td>

                    <td className="p-3">
                      {aulasTurma.length}
                    </td>

                    <td className="p-3 font-bold">
                      {media !== null
                        ? `${media.toFixed(1)}%`
                        : "Sem registros"}
                    </td>
                  </tr>
                );
              })}

              {turmasFiltradas.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center text-gray-400"
                  >
                    Nenhuma turma cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
