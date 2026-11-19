
"use client";

import { useState } from "react";
import type { Turma, Aluno } from "../page";

type Props = {
  turmas: Turma[];
  setTurmas: React.Dispatch<React.SetStateAction<Turma[]>>;
  alunos: Aluno[];
};

export default function Turmas({ turmas, setTurmas, alunos }: Props) {
  const [nomeTurma, setNomeTurma] = useState("");
  const [codigo, setCodigo] = useState("");
  const [horario, setHorario] = useState("");

  const [editandoId, setEditandoId] = useState<number | null>(null);

  function limparFormulario() {
    setNomeTurma("");
    setCodigo("");
    setHorario("");
    setEditandoId(null);
  }

  function salvarTurma() {
    if (!nomeTurma.trim() || !codigo.trim() || !horario.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    const codigoExistente = turmas.some(
      (turma) =>
        turma.codigo.toLowerCase() === codigo.trim().toLowerCase() &&
        turma.id !== editandoId
    );

    if (codigoExistente) {
      alert("Já existe uma turma com esse código.");
      return;
    }

    if (editandoId !== null) {
      setTurmas((listaAtual) =>
        listaAtual.map((turma) =>
          turma.id === editandoId
            ? {
                ...turma,
                nome: nomeTurma.trim(),
                codigo: codigo.trim(),
                horario: horario.trim(),
              }
            : turma
        )
      );
    } else {
      const novaTurma: Turma = {
        id: Date.now(),
        nome: nomeTurma.trim(),
        codigo: codigo.trim(),
        curso: "Engenharia de Redes",
        horario: horario.trim(),
      };

      setTurmas((listaAtual) => [...listaAtual, novaTurma]);
    }

    limparFormulario();
  }

  function editarTurma(turma: Turma) {
    setNomeTurma(turma.nome);
    setCodigo(turma.codigo);
    setHorario(turma.horario);
    setEditandoId(turma.id);
  }

  function excluirTurma(id: number) {
    const possuiAlunos = alunos.some((aluno) => aluno.turmaId === id);

    if (possuiAlunos) {
      alert("Não é possível excluir uma turma que possui alunos vinculados.");
      return;
    }

    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta turma?"
    );

    if (!confirmar) return;

    setTurmas((listaAtual) =>
      listaAtual.filter((turma) => turma.id !== id)
    );

    if (editandoId === id) {
      limparFormulario();
    }
  }

  return (
    <section className="rounded-xl border border-engnet-roxo bg-engnet-preto p-6">
      <h2 className="text-2xl font-bold text-white">
        Gerenciamento de Turmas
      </h2>

      <p className="mt-1 text-sm text-gray-400">
        Cadastre, edite e gerencie as turmas.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Nome da turma"
          value={nomeTurma}
          onChange={(e) => setNomeTurma(e.target.value)}
          className="rounded-lg border border-engnet-roxo bg-black px-4 py-3 text-white outline-none"
        />

        <input
          type="text"
          placeholder="Código da turma"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="rounded-lg border border-engnet-roxo bg-black px-4 py-3 text-white outline-none"
        />

        <input
          type="text"
          placeholder="Horário"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          className="rounded-lg border border-engnet-roxo bg-black px-4 py-3 text-white outline-none"
        />
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={salvarTurma}
          className="rounded-lg bg-engnet-laranja px-5 py-3 font-bold text-black hover:opacity-80"
        >
          {editandoId !== null ? "Salvar alterações" : "+ Adicionar turma"}
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
              <th className="p-4">Código</th>
              <th className="p-4">Horário</th>
              <th className="p-4">Alunos</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>

          <tbody>
            {turmas.map((turma) => (
              <tr
                key={turma.id}
                className="border-b border-gray-800 hover:bg-white/5"
              >
                <td className="p-4 font-medium">{turma.nome}</td>
                <td className="p-4 text-gray-400">{turma.codigo}</td>
                <td className="p-4 text-gray-400">{turma.horario}</td>
                <td className="p-4">
                  {alunos.filter((aluno) => aluno.turmaId === turma.id).length}
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => editarTurma(turma)}
                      className="rounded-lg bg-engnet-roxo px-3 py-2 text-sm text-white hover:opacity-80"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => excluirTurma(turma.id)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {turmas.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  Nenhuma turma cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
