'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Aula } from '@/lib/types';

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
          throw new Error('Falha ao buscar dados da API');
        }
        return res.json();
      })
      .then((data) => {
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

  const aulasFiltradas = aulas; // Removendo todos os filtros por enquanto

  const handleClick = (aula: Aula) => {
    const id = aula.aulaId || aula._id;
    router.push(`/teacher/dashboard/aulas/${id}`);
  };

  function capitalize(str: string): string {
    if (!str) return '';
    return str.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

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
          Aulas de {materiaCapitalized} – {courseFormatted} ({yearFormatted}{' '}
          Ano)
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {aulasFiltradas.length > 0 ? (
          aulasFiltradas.map((aula, index) => (
            <Card
              key={`${aula._id}-${index}`}
              className="bg-[#111115] border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors cursor-pointer flex flex-col justify-between"
              onClick={() => handleClick(aula)}
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {aula.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow text-xs text-gray-400 space-y-1">
                <p className="text-sm text-gray-300">
                  Professor: {aula.professor || 'N/I'}
                </p>
                <div className="border-t border-gray-700 my-2"></div>
                <p className="mt-2 text-gray-500 truncate">
                  {aula.DesAula || 'Sem descrição.'}
                </p>
                {/* Dados de depuração */}
                <div className="mt-4 pt-2 border-t border-gray-700 text-gray-500 text-[10px] space-y-1">
                  <p><strong>Ano Escolar (API):</strong> {aula.anoEscolar}</p>
                  <p><strong>Cursos (API):</strong> {JSON.stringify(aula.cursos || aula.curso)}</p>
                  <p><strong>Matéria (API):</strong> {aula.Materia || aula.materias}</p>
                </div>
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
              Verifique se existem aulas cadastradas para este filtro.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
