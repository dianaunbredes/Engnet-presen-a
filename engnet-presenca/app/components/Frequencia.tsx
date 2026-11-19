
"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Aluno, Turma, Chamada } from "../page";

type Props = {
  alunos: Aluno[];
  turmas: Turma[];
  chamadas: Chamada[];
  setChamadas: Dispatch<SetStateAction<Chamada[]>>;
};

function obterDataLocal() {
  const start = performance.now() ? new Date(performance.now()) : new Date();
  const timezoneOffset = start.getTimezoneOffset() * 60000;
  const hoje = new Date(start.getTime() - timezoneOffset);
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export default function Frequencia({
  alunos,
  turmas,
  chamadas,
  setChamadas,
}: Props) {
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [data, setData] = useState(obterDataLocal);

  const [registros, setRegistros] = useState<
    { alunoId: number; presente: boolean }[]
  >([]);

  const alunosDaTurma = alunos.filter(
    (aluno) => aluno.turmaId === Number(turmaSelecionada)
  );

  function selecionarTurma(id: string) {
    setTurmaSelecionada(id);

    const alunosFiltrados = alunos.filter(
      (aluno) => aluno.turmaId === Number(id)
    );

    setRegistros(
      alunosFiltrados.map((aluno) => ({
        alunoId: aluno.id,
        presente: false,
      }))
    );
  }

  function marcarPresenca(alunoId: number, presente: boolean) {
    setRegistros((listaAtual) =>
      listaAtual.map((registro) =>
        registro.alunoId === alunoId
          ? { ...registro, presente }
          : registro
      )
    );
  }

  function salvarChamada() {
    if (!turmaSelecionada || !data) {
      alert("Selecione uma turma e uma data.");
      return;
    }

    if (alunosDaTurma.length === 0) {
      alert("Esta turma não possui alunos cadastrados.");
      return;
    }

    if (registros.length !== alunosDaTurma.length) {
      alert("Confira a lista de alunos antes de salvar.");
      return;
    }

    const chamadaExistente = chamadas.some(
      (chamada) =>
        chamada.turmaId === Number(turmaSelecionada) &&
        chamada.data === data
    );

    if (chamadaExistente) {
      alert("Já existe uma chamada registrada para esta turma e data.");
      return;
    }

    const novaChamada: Chamada = {
      id: Date.now(),
      turmaId: Number(turmaSelecionada),
      data,
      registros,
    };

    setChamadas((listaAtual) => [...listaAtual, novaChamada]);

    alert("Chamada salva com sucesso!");
  }

  const presentes = registros.filter(
    (registro) => registro.presente
  ).length;

  const ausentes = registros.length - presentes;

  return (
    <section className="rounded-xl border border-engnet-roxo bg-engnet-preto p-6">
      <h2 className="text-2xl font-bold text-white">
        Controle de Frequência
      </h2>

      <p className="mt-1 text-sm text-gray-400">
        Registre a presença dos alunos em cada aula.
      </p>

      {/* SELEÇÃO DE TURMA E DATA */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <select
          value={turmaSelecionada}
          onChange={(e) => selecionarTurma(e.target.value)}
          className="rounded-lg border border-engnet-roxo bg-black px-4 py-3 text-white outline-none"
        >
          <option value="">Selecione uma turma</option>

          {turmas.map((turma) => (
            <option key={turma.id} value={turma.id}>
              {turma.nome} - {turma.codigo}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="rounded-lg border border-engnet-roxo bg-black px-4 py-3 text-white outline-none"
        />
      </div>

      {/* RESUMO */}
      {turmaSelecionada && (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-black p-4">
            <p className="text-sm text-gray-400">Total de alunos</p>
            <p className="mt-2 text-2xl font-bold text-white">
              {registros.length}
            </p>
          </div>

          <div className="rounded-lg bg-black p-4">
            <p className="text-sm text-gray-400">Presentes</p>
            <p className="mt-2 text-2xl font-bold text-green-400">
              {presentes}
            </p>
          </div>

          <div className="rounded-lg bg-black p-4">
            <p className="text-sm text-gray-400">Ausentes</p>
            <p className="mt-2 text-2xl font-bold text-red-400">
              {ausentes}
            </p>
          </div>
        </div>
      )}

      {/* LISTA DE ALUNOS */}
      {turmaSelecionada && (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-white">
            <thead>
              <tr className="border-b border-engnet-roxo text-gray-400">
                <th className="p-4">Aluno</th>
                <th className="p-4">Matrícula</th>
                <th className="p-4">Presença</th>
              </tr>
            </thead>

            <tbody>
              {alunosDaTurma.map((aluno) => {
                const registro = registros.find(
                  (item) => item.alunoId === aluno.id
                );

                return (
                  <tr
                    key={aluno.id}
                    className="border-b border-gray-800 hover:bg-white/5"
                  >
                    <td className="p-4">{aluno.nome}</td>

                    <td className="p-4 text-gray-400">
                      {aluno.matricula}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            marcarPresenca(aluno.id, true)
                          }
                          className={`rounded-lg px-3 py-2 text-sm font-medium ${
                            registro?.presente
                              ? "bg-green-600 text-white"
                              : "bg-gray-800 text-gray-300"
                          }`}
                        >
                          Presente
                        </button>

                        <button
                          onClick={() =>
                            marcarPresenca(aluno.id, false)
                          }
                          className={`rounded-lg px-3 py-2 text-sm font-medium ${
                            registro && !registro.presente
                              ? "bg-red-600 text-white"
                              : "bg-gray-800 text-gray-300"
                          }`}
                        >
                          Ausente
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {alunosDaTurma.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="p-6 text-center text-gray-400"
                  >
                    Nenhum aluno cadastrado nesta turma.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* BOTÃO SALVAR */}
      {turmaSelecionada && alunosDaTurma.length > 0 && (
        <button
          onClick={salvarChamada}
          className="mt-6 rounded-lg bg-engnet-laranja px-6 py-3 font-bold text-black hover:opacity-80"
        >
          Salvar chamada
        </button>
      )}

      {/* HISTÓRICO */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-white">
          Histórico de Chamadas
        </h3>

        <div className="mt-4 space-y-3">
          {chamadas.map((chamada) => {
            const turma = turmas.find(
              (item) => item.id === chamada.turmaId
            );

            const totalPresentes = chamada.registros.filter(
              (registro) => registro.presente
            ).length;

            return (
              <div
                key={chamada.id}
                className="rounded-lg border border-gray-800 bg-black p-4"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-bold text-white">
                      {turma?.nome ?? "Turma não encontrada"}
                    </p>

                    <p className="text-sm text-gray-400">
                      Data: {chamada.data}
                    </p>
                  </div>

                  <p className="text-sm text-green-400">
                    {totalPresentes}/{chamada.registros.length} presentes
                  </p>
                </div>
              </div>
            );
          })}

          {chamadas.length === 0 && (
            <p className="text-sm text-gray-400">
              Nenhuma chamada registrada.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}