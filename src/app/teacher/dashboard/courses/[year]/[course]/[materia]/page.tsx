"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, MoreHorizontal } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import type { Aula } from '@/lib/types';

// Normaliza strings (minúsculas, sem espaços, sem acentos, sem hífen)
function normalize(str?: string) {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "");
}

// Corrige mapeamento de anos (API manda "2" mas pode significar 1º ano)
function matchAno(anoApi?: string, anoParam?: string) {
  if (!anoApi || !anoParam) return false;
  const apiNum = parseInt(anoApi.replace(/\D/g, ''), 10);
  const paramNum = parseInt(anoParam.replace(/\D/g, ''), 10);
  return apiNum === paramNum;
}


export default function AulasListPage() {
  const params = useParams();
  const router = useRouter();

  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const year = params.year as string;
  const course = params.course as string;
  const materia = params.materia as string;

  useEffect(() => {
    async function fetchAulas() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          'https://apisubaulas.onrender.com/api/v1/aulas/MostarAulas'
        );
        if (!res.ok) {
          throw new Error('Falha ao buscar dados da API.');
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error('A API não retornou um array de aulas.');
        }
        setAulas(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.'
        );
        setAulas([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAulas();
  }, []);

  const aulasFiltradas = aulas.filter((aula) => {
    if (!course || !materia || !year) return false;

    const anoOk = matchAno(aula.anoEscolar, year);
    
    const cursoApi = Array.isArray(aula.cursos) ? aula.cursos.join(' ') : aula.curso;
    const cursoOk = normalize(cursoApi).includes(normalize(course as string));

    const materiaApi = aula.Materia || aula.materias;
    let materiaOk = false;
    if (typeof materiaApi === "string") {
      materiaOk = normalize(materiaApi) === normalize(materia);
    } else if (Array.isArray(materiaApi)) {
      materiaOk = materiaApi.some(m => normalize(m) === normalize(materia));
    }
    
    return anoOk && cursoOk && materiaOk;
  });

  const aulasUnicas = aulasFiltradas.filter(
    (aula, index, self) => index === self.findIndex((a) => (a.aulaId || a._id) === (aula.aulaId || a._id))
  );

  const handleCardClick = (aula: Aula) => {
    const id = aula.aulaId || aula._id;
    if (id) {
      router.push(`/teacher/dashboard/aulas/${id}`);
    } else {
      console.error('ID da aula não encontrado para navegação.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-white">
        <Loader2 className="animate-spin w-6 h-6" />
        <span className="ml-2">Carregando aulas...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Erro: {error}</p>;
  }

  return (
    <div className="p-4 text-white">
      <div
        className="flex items-center gap-4 mb-8 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-6 w-6" />
        <h1 className="text-2xl font-bold">
          Aulas de {decodeURIComponent(materia as string)} -{' '}
          {decodeURIComponent(course as string).toUpperCase()}
        </h1>
      </div>

      {aulasUnicas.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center bg-[#111115] border-gray-800 rounded-lg p-10">
          <p className="text-lg font-semibold text-gray-300">
            Nenhuma aula encontrada
          </p>
          <p className="text-gray-400 mt-2">
            Não há aulas disponíveis para os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aulasUnicas.map((aula, index) => (
            <Card
              key={aula.aulaId || aula._id || index}
              className="bg-[#111115] border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors cursor-pointer flex flex-col justify-between"
              onClick={() => handleCardClick(aula)}
            >
              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-xl font-bold">{aula.titulo || 'Sem Título'}</h2>
                <p className="text-gray-400">{aula.Horario || 'Sem horário'}</p>
                <p className="text-gray-400 truncate">
                  Breve descrição: {aula.DesAula || 'Sem descrição.'}
                </p>
              </div>
              <div className="p-4 pt-0 mt-auto">
                 <MoreHorizontal className="text-gray-500" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
