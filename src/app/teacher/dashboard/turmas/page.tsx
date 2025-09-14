import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type Turma } from '@/lib/types';
import { GraduationCap } from 'lucide-react';

async function getTurmas(): Promise<Turma[]> {
  try {
    const response = await fetch(
      'https://apisubaulas.onrender.com/api/v1/turmas'
    );
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
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Turmas</h1>
      {turmas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {turmas.map((turma) => (
            <Card
              key={turma._id}
              className="bg-[#111115] border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors"
            >
              <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                <div className="p-3 rounded-md bg-purple-500/20">
                  <GraduationCap className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle>{turma.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Ano: {turma.ano} | Turno: {turma.turno}
                </CardDescription>
                <p className="text-sm text-gray-400 mt-2">
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
