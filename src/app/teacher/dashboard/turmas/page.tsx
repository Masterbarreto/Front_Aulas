import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type Turma } from '@/lib/types';

async function getTurmas(): Promise<Turma[]> {
  try {
    const response = await fetch('https://apisubaulas.onrender.com/api/v1/turmas');
    if (!response.ok) {
      console.error('Failed to fetch turmas:', response.statusText);
      return [];
    }
    const data = await response.json();
    return data.turmas || [];
  } catch (error) {
    console.error('Error fetching turmas:', error);
    return [];
  }
}

export default async function TurmasPage() {
  const turmas = await getTurmas();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Turmas</h1>
      {turmas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turmas.map((turma) => (
            <Card key={turma._id}>
              <CardHeader>
                <CardTitle>{turma.nome}</CardTitle>
                <CardDescription>
                  Ano: {turma.ano} | Turno: {turma.turno}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  ID da Sala: {turma.sala_id}
                </p>
                <p className="text-sm text-gray-400">
                  Alunos: {turma.alunos.length}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">Nenhuma turma encontrada.</p>
      )}
    </div>
  );
}