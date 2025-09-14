import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type Aluno } from '@/lib/types';
import { User } from 'lucide-react';

async function getAlunos(): Promise<Aluno[]> {
  try {
    const response = await fetch(
      'https://apisubaulas.onrender.com/api/v1/alunos'
    );
    if (!response.ok) {
      console.error('Failed to fetch alunos:', response.statusText);
      return [];
    }
    const data = await response.json();
    return data.alunos || [];
  } catch (error) {
    console.error('Error fetching alunos:', error);
    return [];
  }
}

export default async function AlunosPage() {
  const alunos = await getAlunos();

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Alunos</h1>
      {alunos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {alunos.map((aluno) => (
            <Card
              key={aluno._id}
              className="bg-[#111115] border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors"
            >
              <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                <div className="p-3 rounded-md bg-blue-500/20">
                  <User className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle>{aluno.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">Idade: {aluno.idade}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Turma ID: {aluno.turma_id}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">Nenhum aluno encontrado.</p>
      )}
    </div>
  );
}
