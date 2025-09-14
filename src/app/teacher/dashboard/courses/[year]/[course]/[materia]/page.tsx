'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Aula {
  _id: string;
  aulaId?: string;
  titulo: string;
  Horario: string;
  DesAula: string;
  anoEscolar?: string;
  curso?: string;
  Turma?: string;
  Materia?: string;
}

function normalize(str?: string) {
  return (str || '')
    .toLowerCase()
    .replace(/\s/g, '')
    .replace(/-/g, '');
}

export default function AulasListPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const router = useRouter();
  const params = useParams();
  const { year, course, materia } = params;

  useEffect(() => {
    fetch('https://apisubaulas.onrender.com/api/v1/aulas/MostarAulas')
      .then((res) => res.json())
      .then((data) => setAulas(Array.isArray(data) ? data : []))
      .catch((error) => console.error('Erro ao buscar aulas:', error));
  }, []);

  if (!year || !course || !materia) {
    return <p className="text-white">Parâmetros da URL ausentes.</p>;
  }

  const aulasFiltradas = aulas.filter(
    (aula) =>
      normalize(aula.anoEscolar) === normalize(year as string) &&
      normalize(aula.curso) === normalize(course as string) &&
      normalize(aula.Materia) === normalize(materia as string)
  );

  const handleClick = (aula: Aula) => {
    const id = aula.aulaId || aula._id;
    router.push(`/teacher/dashboard/aulas/${id}`);
  };

  return (
    <div className="flex flex-col text-white">
      <div
        className="flex items-center gap-4 mb-8 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Aulas – Senac</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {aulasFiltradas.length > 0 ? (
          aulasFiltradas.map((aula) => (
            <Card
              key={aula._id}
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
