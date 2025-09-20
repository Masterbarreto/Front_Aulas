'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Aula } from '@/lib/types';

function capitalize(str: string): string {
  if (!str) return '';
  return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export default function AulasListPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const year = params.year as string;
  const course = params.course as string;
  const materia = params.materia as string;

  useEffect(() => {
    fetch('https://apisubaulas.onrender.com/api/v1/aulas/MostarAulas')
      .then((res) => {
        if (!res.ok) {
          // Se a resposta não for OK, lança um erro para o catch
          throw new Error('Falha ao buscar dados da API');
        }
        return res.json();
      })
      .then((data) => {
        // Garante que 'data' seja um array antes de setar o estado
        if (Array.isArray(data)) {
          setAulas(data);
        } else {
          console.error('API não retornou um array de aulas:', data);
          setAulas([]);
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar ou processar aulas:', error);
        setAulas([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-white">Carregando aulas...</p>;
  }

  const handleClick = (aula: Aula) => {
    const id = aula.aulaId || aula._id;
    router.push(`/teacher/dashboard/aulas/${id}`);
  };
  
  const materiaCapitalized = capitalize(materia);
  const courseFormatted = course.toUpperCase();
  const yearFormatted = year ? year.replace('-', 'º ') : '';

  return (
    <div className="flex flex-col text-white">
      <div
        className="flex items-center gap-4 mb-8 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-6 w-6" />
        <h1 className="text-2xl font-bold">
          Aulas de {materiaCapitalized} – {courseFormatted} ({yearFormatted} Ano)
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {aulas.length > 0 ? (
          aulas.map((aula, index) => (
            <Card
              key={`${aula._id}-${index}`}
              className="bg-[#111115] border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors cursor-pointer flex flex-col justify-between"
              onClick={() => handleClick(aula)}
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{aula.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-400">
                  {aula.Horario ? `Horário: ${aula.Horario}` : 'Horário não definido'}
                </p>
                <p className="text-sm text-gray-400">
                  Professor: {aula.professor || 'Não informado'}
                </p>
                <p className="text-sm text-gray-400">
                  Matéria: {Array.isArray(aula.Materia) ? aula.Materia.join(', ') : (aula.Materia || 'Não informado')}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {aula.DesAula || 'Sem descrição disponível'}
                </p>
              </CardContent>
              <div className="p-4 pt-0 mt-auto">
                <MoreHorizontal className="text-gray-500" />
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-gray-400 mb-2">
              Nenhuma aula encontrada.
            </p>
            <p className="text-sm text-gray-500">
              Verifique se existem aulas cadastradas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
