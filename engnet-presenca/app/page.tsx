"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import Turmas from "./components/Turmas";
import Alunos from "./components/Alunos";
import Frequencia from "./components/Frequencia";
import Relatorios from "./components/Relatorio";

export type Turma = {
  id: string;
  nome: string;
  codigo: string;
  curso: string;
  horario: string;
};

export type Aluno = {
  id: string;
  nome: string;
  matricula: string;
  turmaId: string;
};

export type Aula = {
  id: string;
  turma_id: string;
  professor_id: string;
  data_hora_inicio: string;
  data_hora_fim: string;
  conteudo: string;
  observacoes: string;
  criada_em: string;
};


export type Presenca = {
  id: string;
  aula_id: string;
  aluno_id: string;
  status: "presente" | "falta" | "justificada";
  registrado_por: string;
  registrado_em: string;
  observacao: string | null;

  aluno: {
    id: string;
    nome: string;
    matricula: string;
  };

  aula: {
    id: string;
    turma_id: string;
    data_hora_inicio: string;
    data_hora_fim: string;
    conteudo: string;
  };
};


export default function Home() {
  const router = useRouter();

  const [aulas, setAulas] = useState<Aula[]>([]);
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);

 
  useEffect(() => {
    async function buscarAulas() {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) return;

        const resposta = await fetch("http://localhost:3000/aulas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (!resposta.ok) {
      const erro = await resposta.text();

      console.error("Erro ao buscar aulas:", {
      status: resposta.status,
      statusText: resposta.statusText,
      resposta: erro,
    });

  throw new Error("Erro ao buscar aulas.");
}

        const dados = await resposta.json();

        setAulas(dados);
      } catch (erro) {
        console.error("Erro ao carregar aulas:", erro);
      }
    }

    buscarAulas();
  }, []);

  
  async function atualizarPresencas() {
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const resposta = await fetch("http://localhost:3000/presencas", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resposta.ok) {
        if (resposta.status === 401) {
          sessionStorage.removeItem("token");
          router.push("/login");
          return;
        }

        throw new Error("Erro ao buscar frequências.");
      }

      const dados = await resposta.json();

      setPresencas(dados);
    } catch (erro) {
      console.error("Erro ao carregar frequências:", erro);
      throw erro;
    }
  }

  
  useEffect(() => {
    atualizarPresencas();
  }, [router]);

  
  useEffect(() => {
    async function buscarTurmas() {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const resposta = await fetch("http://localhost:3000/turmas", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resposta.ok) {
          if (resposta.status === 401) {
            sessionStorage.removeItem("token");
            router.push("/login");
            return;
          }

          throw new Error("Erro ao buscar turmas.");
        }

        const dados = await resposta.json();

        setTurmas(dados);
      } catch (erro) {
        console.error("Erro ao carregar turmas:", erro);
      }
    }

    buscarTurmas();
  }, [router]);

  useEffect(() => {
    async function buscarAlunos() {
    const token = sessionStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const resposta = await fetch("http://localhost:3000/alunos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (resposta.status === 401) {
        router.push("/login");
        return;
      }

      if (!resposta.ok) {
        throw new Error("Erro ao buscar alunos");
      }

      const dados = await resposta.json();

      console.log("Alunos recebidos pela API:", dados);
      console.table(
  dados.map((aluno: any) => ({
    nome: aluno.nome,
    matricula: aluno.matricula,
    turmaId: aluno.turmaId,
    turma_id: aluno.turma_id,
    turma: aluno.turma,
  }))
);

      setAlunos(dados);
    } catch (erro) {
      console.error("Erro ao carregar alunos:", erro);
    }
  }

  buscarAlunos();
}, [router]);
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1
          id="dashboard"
          className="text-3xl font-bold text-white"
        >
          Dashboard
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard
            titulo="Total de alunos"
            valor={String(alunos.length)}
          />

          <StatCard
            titulo="Total de turmas"
            valor={String(turmas.length)}
          />

          <StatCard
            titulo="Média de frequência"
             valor={
                presencas.length > 0
                      ? `${(
                (presencas.filter((p) => p.status === "presente").length /
                  presencas.length) * 100
                        ).toFixed(1)}%`
                  : "Sem registros"
                }
          />
        </div>

        <div id="turmas" className="mt-8">
          <Turmas
            turmas={turmas}
            setTurmas={setTurmas}
            alunos={alunos}
          />
        </div>

        <div id="alunos" className="mt-8">
          <Alunos
            alunos={alunos}
            setAlunos={setAlunos}
            turmas={turmas}
          />
        </div>

        <div id="frequencia" className="mt-8">
          <Frequencia
            alunos={alunos}
            turmas={turmas}
            presencas={presencas}
            aulas={aulas}
            atualizarPresencas={atualizarPresencas}
          />
        </div>

        <div id="relatorios" className="mt-8">
          <Relatorios
            alunos={alunos}
            turmas={turmas}
            presencas={presencas}
            aulas={aulas}
          />
        </div>

        <button
          type="button"
          className="rounded-lg bg-white p-3 font-bold text-black hover:bg-gray-300"
          onClick={() => {
            sessionStorage.removeItem("token");
            router.push("/login");
          }}
        >
          Sair do sistema
        </button>
      </main>
    </div>
  );
}
