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
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const year = params.year as string;
  const course = params.course as string;
  const materia = params.materia as string;

  useEffect(() => {
    fetch('https://apisubaulas.onrender.com/api/v1/aulas/MostarAulas')
      .then((res) => res.json())
      .then((data) => {
        setAulas(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Erro ao buscar aulas:', error);
        setAulas([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!year || !course || !materia) {
    return <p className="text-white">Parâmetros da URL ausentes.</p>;
  }

  if (loading) {
    return <p className="text-white">Carregando aulas...</p>;
  }

  const aulasFiltradas = aulas.filter((aula) => {
    // 1. Filtro por ano escolar - Compara o número do ano (ex: "2" com "2-ano")
    const yearNumber = year.split('-')[0];
    const anoMatch = aula.anoEscolar === yearNumber;

    // 2. Filtro por curso - Verifica se o curso da URL está no array de cursos da aula
    const normalizedCourseParam = normalize(course);
    const cursoMatch =
      Array.isArray(aula.cursos) &&
      aula.cursos.some((c: string) => normalize(c) === normalizedCourseParam);
    
    // 3. Filtro por matéria - Verifica tanto 'materias' quanto 'Materia' para compatibilidade
    const materiaDaAula = aula.materias || aula.Materia;
    const materiaMatch = normalize(materiaDaAula as string) === normalize(materia);
    
    return anoMatch && cursoMatch && materiaMatch;
  });
  
  // Remove duplicatas baseado em título e descrição
  const aulasUnicas = aulasFiltradas.filter((aula, index, self) =>
    index === self.findIndex((a) => (
      a.titulo === aula.titulo && 
      a.DesAula === aula.DesAula &&
      a.professor === aula.professor
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
        <h1 className="text-2xl font-bold">
          Aulas de {materiaCapitalized} – {courseFormatted} ({yearFormatted} Ano)
        </h1>
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
                <p className="text-sm text-gray-400">
                  {aula.Horario ? `Horário: ${aula.Horario}` : 'Horário não definido'}
                </p>
                <p className="text-sm text-gray-400">
                  Professor: {aula.professor || 'Não informado'}
                </p>
                <p className="text-sm text-gray-400">
                  Matéria: {Array.isArray(aula.Materia) ? aula.Materia.join(', ') : (aula.materias || aula.Materia || 'Não informado')}
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
              Nenhuma aula encontrada para este filtro.
            </p>
            <p className="text-sm text-gray-500">
              Verifique se existem aulas cadastradas para: <br />
              <strong>{materiaCapitalized}</strong> no curso <strong>{courseFormatted}</strong> do <strong>{yearFormatted} Ano</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
