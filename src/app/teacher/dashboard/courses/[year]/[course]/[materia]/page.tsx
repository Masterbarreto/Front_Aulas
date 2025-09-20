"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

type AulaSimplificada = {
  id?: string;
  titulo: string;
  descricao: string;
  horario: string;
  ano: number;
  curso: string;
  materia: string;
  professor: string;
};

// função para normalizar strings (sem acento, minúsculo, sem espaços)
function normalize(str: string): string {
  return str
    ? str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, '')
    : '';
}

// ajusta ano da API para o ano da URL
function matchAno(anoApi: number, anoParam: number): boolean {
  return anoApi === anoParam;
}

export default function AulasListPage() {
  const params = useParams();
  const router = useRouter();

  const [aulas, setAulas] = useState<AulaSimplificada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const year = params.year as string;
  const course = params.course as string;
  const materia = params.materia as string;

  const anoParam = parseInt(year.replace(/\D/g, ''), 10);

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

        const aulasSimplificadas: AulaSimplificada[] = data.map(
          (aula: any) => ({
            id: aula.aulaId,
            titulo: aula.titulo ?? 'Sem título',
            descricao: aula.DesAula ?? 'Sem descrição',
            horario: aula.Horario ?? 'N/I',
            ano: parseInt(String(aula.anoEscolar || '0').replace(/\D/g, ''), 10),
            curso: Array.isArray(aula.cursos) ? aula.cursos.join(', ') : aula.curso,
            materia: Array.isArray(aula.materias) ? aula.materias.join(', ') : aula.Materia,
            professor: aula.professor ?? 'N/I',
          })
        );
        setAulas(aulasSimplificadas);
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
    if (!course || !materia) return false;

    const anoOk = matchAno(aula.ano, anoParam);
    const cursoOk = normalize(aula.curso).includes(normalize(course as string));
    const materiaOk = normalize(aula.materia).includes(normalize(materia as string));

    return anoOk && cursoOk && materiaOk;
  });

  const aulasUnicas = aulasFiltradas.filter(
    (aula, index, self) => index === self.findIndex((a) => a.id === aula.id)
  );

  const handleCardClick = (aula: AulaSimplificada) => {
    const id = aula.id;
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {aulasUnicas.map((aula) => (
            <Card
              key={aula.id}
              className="bg-[#111115] border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={() => handleCardClick(aula)}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText size={20} />
                  {aula.titulo}
                </CardTitle>
                <CardDescription className="text-sm text-gray-400 pt-1">
                  {aula.descricao}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Professor:</span>
                  <span className="font-medium">{aula.professor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Horário:</span>
                  <span className="font-medium">{aula.horario}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
