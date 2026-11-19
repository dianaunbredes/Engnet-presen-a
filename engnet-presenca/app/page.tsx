
"use client";

import { useState } from "react";

import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import Turmas from "./components/Turmas";
import Alunos from "./components/Alunos";
import Frequencia from "./components/Frequencia";
import Relatorios from "./components/Relatorio";

export type Turma = {
  id: number;
  nome: string;
  codigo: string;
  curso: string;
  horario: string;
};

export type Aluno = {
  id: number;
  nome: string;
  matricula: string;
  turmaId: number;
};

export type RegistroFrequencia = {
  alunoId: number;
  presente: boolean;
};

export type Chamada = {
  id: number;
  turmaId: number;
  data: string;
  registros: RegistroFrequencia[];
};

export default function Home() {
  const [turmas, setTurmas] = useState<Turma[]>([
    {
      id: 1,
      nome: "Turma A",
      codigo: "ENG001",
      curso: "Engenharia de Redes",
      horario: "08:00 - 10:00",
    },
    {
      id: 2,
      nome: "Turma B",
      codigo: "ENG002",
      curso: "Engenharia de Redes",
      horario: "10:00 - 12:00",
    },
  ]);

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [chamadas, setChamadas] = useState<Chamada[]>([]);

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
            valor="87%"
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
            chamadas={chamadas}
            setChamadas={setChamadas}
          />
        </div>

        <div id="relatorios" className="mt-8">
          <Relatorios
            alunos={alunos}
            turmas={turmas}
            chamadas={chamadas}
          />
        </div>
      </main>
    </div>
  );
}
