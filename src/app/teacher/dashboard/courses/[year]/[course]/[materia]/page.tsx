'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Aula } from '@/lib/types';

// Função para normalizar strings, removendo espaços e hifens e convertendo para minúsculas.
function normalize(str?: string): string {
  if (!str) return '';
  return str.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export default function AulasListPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const router = useRouter();
  const params = useParams();
  const year = params.year as string;
  const course = params.course as string;
  const materia = params.materia as string;

  useEffect(() => {
    fetch('https://apisubaulas.onrender.com/api/v1/aulas/MostarAulas')
      .then((res) => res.json())
      .then((data) => setAulas(Array.isArray(data) ? data : []))
      .catch((error) => console.error('Erro ao buscar aulas:', error));
  }, []);

  if (!year || !course || !materia) {
    return <p className="text-white">Parâmetros da URL ausentes.</p>;
  }

  const aulasFiltradas = aulas.filter((aula) => {
    const anoMatch = normalize(aula.anoEscolar) === normalize(year);
    
    // O campo 'curso' na API pode ser uma string ou um array de strings.
    const cursoMatch = normalize(aula.curso) === normalize(course) || 
      (Array.isArray(aula.cursos) && aula.cursos.some(c => normalize(c) === normalize(course)));

    const materiaMatch = normalize(aula.Materia as string) === normalize(materia);

    return anoMatch && cursoMatch && materiaMatch;
  });

  const aulasUnicas = aulasFiltradas.filter((aula, index, self) =>
    index === self.findIndex((a) => (
      a.titulo === aula.titulo && a.DesAula === aula.DesAula
    ))
  );

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
        <h1 className="text-2xl font-bold">Aulas de {materiaCapitalized} – {courseFormatted} ({yearFormatted} Ano)</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {aulasUnicas.length > 0 ? (
          aulasUnicas.map((aula, index) => (
            <Card
              key={`${aula._id}-${index}`}
              className="bg-[#111115] border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors cursor-pointer flex flex-col justify-between"
              onClick={() => handleClick(aula)}
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{aula.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-400">{aula.Horario}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Breve descrição: {aula.DesAula}
                </p>
              </CardContent>
              <div className="p-4 pt-0 mt-auto">
                 <MoreHorizontal className="text-gray-500" />
              </div>
            </Card>
          ))
        ) : (
          <p>Nenhuma aula encontrada para este filtro.</p>
        )}
      </div>
    </div>
  );
}
