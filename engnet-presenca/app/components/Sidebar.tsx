
export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-engnet-preto border-r border-engnet-roxo p-6">
      <h2 className="text-2xl font-bold text-engnet-roxo">
        EngNet
      </h2>

      <nav className="mt-8 flex flex-col gap-2">
        <a
          href="#dashboard"
          className="rounded-lg px-4 py-2 text-white hover:bg-engnet-roxo"
        >
          Dashboard
        </a>

        <a
          href="#turmas"
          className="rounded-lg px-4 py-2 text-white hover:bg-engnet-roxo"
        >
          Turmas
        </a>

        <a
          href="#alunos"
          className="rounded-lg px-4 py-2 text-white hover:bg-engnet-roxo"
        >
          Alunos
        </a>

        <a
          href="#frequencia"
          className="rounded-lg px-4 py-2 text-white hover:bg-engnet-roxo"
        >
          Frequência
        </a>

        <a
          href="#relatorios"
          className="rounded-lg px-4 py-2 text-white hover:bg-engnet-roxo"
        >
          Relatórios
        </a>
      </nav>
    </aside>
  );
}
