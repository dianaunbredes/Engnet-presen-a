
"use client";

import { useState } from "react";
import type { Aluno, Turma } from "../page";

type Props = {
  alunos: Aluno[];
  setAlunos: React.Dispatch<React.SetStateAction<Aluno[]>>;
  turmas: Turma[];
};

export default function Alunos({ alunos, setAlunos, turmas }: Props) {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [turmaId, setTurmaId] = useState("");

  const [editandoId, setEditandoId] = useState<number | null>(null);

  function limparFormulario() {
    setNome("");
    setMatricula("");
    setTurmaId("");
    setEditandoId(null);
  }

  function salvarAluno() {
    if (!nome.trim() || !matricula.trim() || !turmaId) {
      alert("Preencha todos os campos.");
      return;
    }

    const matriculaExistente = alunos.some(
      (aluno) =>
        aluno.matricula.toLowerCase() === matricula.trim().toLowerCase() &&
        aluno.id !== editandoId
    );

    if (matriculaExistente) {
      alert("Essa matrícula já está cadastrada.");
      return;
    }

    if (editandoId !== null) {
      setAlunos((listaAtual) =>
        listaAtual.map((aluno) =>
          aluno.id === editandoId
            ? {
                ...aluno,
                nome: nome.trim(),
                matricula: matricula.trim(),
                turmaId: Number(turmaId),
              }
            : aluno
        )
      );
    } else {
      const novoAluno: Aluno = {
        id: Date.now(),
        nome: nome.trim(),
        matricula: matricula.trim(),
        turmaId: Number(turmaId),
      };

      setAlunos((listaAtual) => [...listaAtual, novoAluno]);
    }

    limparFormulario();
  }

  function editarAluno(aluno: Aluno) {
    setNome(aluno.nome);
    setMatricula(aluno.matricula);
    setTurmaId(String(aluno.turmaId));
    setEditandoId(aluno.id);
  }

  function excluirAluno(id: number) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este aluno?"
    );

    if (!confirmar) return;

    setAlunos((listaAtual) =>
      listaAtual.filter((aluno) => aluno.id !== id)
    );

    if (editandoId === id) {
      limparFormulario();
    }
  }

  return (
    <section className="rounded-xl border border-engnet-roxo bg-engnet-preto p-6">
      <h2 className="text-2xl font-bold text-white">
        Gerenciamento de Alunos
      </h2>

      <p className="mt-1 text-sm text-gray-400">
        Cadastre alunos e associe cada um a uma turma.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="rounded-lg border border-engnet-roxo bg-black px-4 py-3 text-white outline-none"
        />

        <input
          type="text"
          placeholder="Matrícula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          className="rounded-lg border border-engnet-roxo bg-black px-4 py-3 text-white outline-none"
        />

        <select
          value={turmaId}
          onChange={(e) => setTurmaId(e.target.value)}
          className="rounded-lg border border-engnet-roxo bg-black px-4 py-3 text-white outline-none"
        >
          <option value="">Selecione uma turma</option>

          {turmas.map((turma) => (
            <option key={turma.id} value={turma.id}>
              {turma.nome} - {turma.codigo}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={salvarAluno}
          className="rounded-lg bg-engnet-laranja px-5 py-3 font-bold text-black hover:opacity-80"
        >
          {editandoId !== null ? "Salvar alterações" : "+ Adicionar aluno"}
        </button>

        {editandoId !== null && (
          <button
            onClick={limparFormulario}
            className="rounded-lg border border-engnet-roxo px-5 py-3 text-white hover:bg-engnet-roxo"
          >
            Cancelar
          </button>
        )}
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-white">
          <thead>
            <tr className="border-b border-engnet-roxo text-gray-400">
              <th className="p-4">Nome</th>
              <th className="p-4">Matrícula</th>
              <th className="p-4">Turma</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>

          <tbody>
            {alunos.map((aluno) => {
              const turma = turmas.find(
                (item) => item.id === aluno.turmaId
              );

              return (
                <tr
                  key={aluno.id}
                  className="border-b border-gray-800 hover:bg-white/5"
                >
                  <td className="p-4 font-medium">{aluno.nome}</td>
                  <td className="p-4 text-gray-400">{aluno.matricula}</td>
                  <td className="p-4 text-gray-400">
                    {turma ? turma.nome : "Turma não encontrada"}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => editarAluno(aluno)}
                        className="rounded-lg bg-engnet-roxo px-3 py-2 text-sm text-white hover:opacity-80"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => excluirAluno(aluno.id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {alunos.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">
                  Nenhum aluno cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
