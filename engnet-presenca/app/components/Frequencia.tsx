
"use client";

import { useEffect, useMemo, useState } from "react";
import type { Aluno, Turma, Aula, Presenca } from "../page";

type StatusPresenca =
  | "presente"
  | "falta"
  | "justificada"
  | "nao_registrado";

type RegistroLocal = {
  alunoId: string;
  status: StatusPresenca;
};

type Props = {
  alunos: Aluno[];
  turmas: Turma[];
  aulas: Aula[];
  presencas: Presenca[];
  atualizarPresencas: () => Promise<void>;
};

function formatarDataLocal(dataISO: string): string {
  const data = new Date(dataISO);

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export default function Frequencia({
  alunos,
  turmas,
  aulas,
  presencas,
  atualizarPresencas,
}: Props) {
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [data, setData] = useState("");
  const [registros, setRegistros] = useState<RegistroLocal[]>([]);
  const [salvando, setSalvando] = useState(false);

  const aulaSelecionada = aulas.find(
    (aula) =>
      aula.turma_id === turmaSelecionada &&
      formatarDataLocal(aula.data_hora_inicio) === data
  );

  const alunosDaTurma = useMemo(
    () => alunos.filter((aluno) => aluno.turmaId === turmaSelecionada),
    [alunos, turmaSelecionada]
  );

  // CARREGAR PRESENÇAS DO BANCO
  useEffect(() => {
    if (!aulaSelecionada) {
      setRegistros([]);
      return;
    }

    const presencasDaAula = presencas.filter(
      (presenca) => presenca.aula_id === aulaSelecionada.id
    );

    const novosRegistros: RegistroLocal[] = alunosDaTurma.map((aluno) => {
      const presenca = presencasDaAula.find(
        (item) => item.aluno_id === aluno.id
      );

      return {
        alunoId: aluno.id,
        status: presenca ? presenca.status : "nao_registrado",
      };
    });

    setRegistros(novosRegistros);
  }, [aulaSelecionada, alunosDaTurma, presencas]);

  // MARCAR PRESENÇA
  function marcarPresenca(
    alunoId: string,
    status: StatusPresenca
  ) {
    setRegistros((listaAtual) =>
      listaAtual.map((registro) =>
        registro.alunoId === alunoId
          ? { ...registro, status }
          : registro
      )
    );
  }

  // SALVAR CHAMADA NO BANCO DE DADOS
  async function salvarChamada() {
    if (salvando) return;

    if (!turmaSelecionada || !data) {
      alert("Selecione uma turma e uma data.");
      return;
    }

    if (!aulaSelecionada) {
      alert(
        "Não existe uma aula cadastrada nesta data para a turma selecionada."
      );
      return;
    }

    if (alunosDaTurma.length === 0) {
      alert("Esta turma não possui alunos cadastrados.");
      return;
    }

    if (
      registros.length !== alunosDaTurma.length ||
      registros.some(
        (registro) => registro.status === "nao_registrado"
      )
    ) {
      alert("Registre a situação de todos os alunos antes de salvar.");
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const token = sessionStorage.getItem("token");

    if (!API_URL) {
      alert("A URL da API não foi configurada.");
      return;
    }

    if (!token) {
      alert("Sessão expirada. Faça login novamente.");
      return;
    }

    setSalvando(true);

    try {
      for (const registro of registros) {
        const resposta = await fetch(`${API_URL}/presencas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            aula_id: aulaSelecionada.id,
            aluno_id: registro.alunoId,
            status: registro.status,
            observacao: null,
          }),
        });

        if (!resposta.ok) {
          const erro = await resposta.text();

          console.error("Erro ao salvar presença:", {
            status: resposta.status,
            resposta: erro,
            alunoId: registro.alunoId,
          });

          throw new Error("Falha ao salvar uma das presenças.");
        }
      }

      await atualizarPresencas();

      alert("Chamada salva no banco de dados com sucesso!");
    } catch (erro) {
      console.error("Erro completo ao salvar chamada:", erro);
       alert(
      erro instanceof Error
      ? erro.message
      : String(erro)
    );
}
}

  // CONTADORES
  const presentes = registros.filter(
    (registro) => registro.status === "presente"
  ).length;

  const ausentes = registros.filter(
    (registro) => registro.status === "falta"
  ).length;

  const justificadas = registros.filter(
    (registro) => registro.status === "justificada"
  ).length;

  const registrados = registros.filter(
    (registro) => registro.status !== "nao_registrado"
  ).length;

  return (
    <section className="rounded-xl border border-engnet-roxo bg-engnet-preto p-6">
      <h2 className="text-2xl font-bold text-white">
        Controle de Frequência
      </h2>

      <p className="mt-1 text-sm text-gray-400">
        Selecione uma turma e a data da aula para registrar a frequência.
      </p>

      {/* SELEÇÃO DE TURMA E DATA */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <select
          value={turmaSelecionada}
          onChange={(e) => setTurmaSelecionada(e.target.value)}
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

      {/* INFORMAÇÕES DA AULA */}
      {turmaSelecionada && data && (
        <div className="mt-6">
          {aulaSelecionada ? (
            <p className="text-sm text-green-400">
              Aula encontrada: {aulaSelecionada.conteudo}
            </p>
          ) : (
            <p className="text-sm text-yellow-400">
              Nenhuma aula encontrada para esta turma nesta data.
            </p>
          )}
        </div>
      )}

      {/* RESUMO */}
      {aulaSelecionada && (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-black p-4">
            <p className="text-sm text-gray-400">Total de alunos</p>
            <p className="mt-2 text-2xl font-bold text-white">
              {alunosDaTurma.length}
            </p>
          </div>

          <div className="rounded-lg bg-black p-4">
            <p className="text-sm text-gray-400">Presentes</p>
            <p className="mt-2 text-2xl font-bold text-green-400">
              {presentes}
            </p>
          </div>

          <div className="rounded-lg bg-black p-4">
            <p className="text-sm text-gray-400">Faltas</p>
            <p className="mt-2 text-2xl font-bold text-red-400">
              {ausentes}
            </p>
          </div>

          <div className="rounded-lg bg-black p-4">
            <p className="text-sm text-gray-400">Justificadas</p>
            <p className="mt-2 text-2xl font-bold text-yellow-400">
              {justificadas}
            </p>
          </div>
        </div>
      )}

      {/* LISTA DE ALUNOS */}
      {aulaSelecionada && (
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
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            marcarPresenca(aluno.id, "presente")
                          }
                          className={`rounded-lg px-3 py-2 text-sm font-medium ${
                            registro?.status === "presente"
                              ? "bg-green-600 text-white"
                              : "bg-gray-800 text-gray-300"
                          }`}
                        >
                          Presente
                        </button>

                        <button
                          onClick={() =>
                            marcarPresenca(aluno.id, "falta")
                          }
                          className={`rounded-lg px-3 py-2 text-sm font-medium ${
                            registro?.status === "falta"
                              ? "bg-red-600 text-white"
                              : "bg-gray-800 text-gray-300"
                          }`}
                        >
                          Falta
                        </button>

                        <button
                          onClick={() =>
                            marcarPresenca(aluno.id, "justificada")
                          }
                          className={`rounded-lg px-3 py-2 text-sm font-medium ${
                            registro?.status === "justificada"
                              ? "bg-yellow-600 text-white"
                              : "bg-gray-800 text-gray-300"
                          }`}
                        >
                          Justificada
                        </button>
                      </div>

                      {registro?.status === "nao_registrado" && (
                        <p className="mt-2 text-xs text-gray-400">
                          Ainda não registrado
                        </p>
                      )}
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

      {/* PROGRESSO */}
      {aulaSelecionada && alunosDaTurma.length > 0 && (
        <p className="mt-4 text-sm text-gray-400">
          {registrados} de {alunosDaTurma.length} alunos registrados.
        </p>
      )}

      {/* BOTÃO SALVAR */}
      {aulaSelecionada && alunosDaTurma.length > 0 && (
        <button
          onClick={salvarChamada}
          disabled={salvando}
          className={`mt-6 rounded-lg bg-engnet-laranja px-6 py-3 font-bold text-black ${
            salvando
              ? "cursor-not-allowed opacity-50"
              : "hover:opacity-80"
          }`}
        >
          {salvando ? "Salvando chamada..." : "Salvar chamada"}
        </button>
      )}

      {/* INFORMAÇÃO SOBRE ARMAZENAMENTO */}
      <div className="mt-10">
        <p className="text-sm text-gray-400">
          As frequências registradas são armazenadas no banco de dados.
        </p>
      </div>
    </section>
  );
}

