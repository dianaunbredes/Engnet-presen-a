type StatCardProps = {
  titulo: string;
  valor: string;
};

export default function StatCard({ titulo, valor }: StatCardProps) {
  return (
    <div className="rounded-xl border border-engnet-roxo bg-engnet-preto p-6">
      <p className="text-sm text-gray-400">{titulo}</p>
      <p className="mt-2 text-4xl font-bold text-engnet-laranja">{valor}</p>
    </div>
  );
}