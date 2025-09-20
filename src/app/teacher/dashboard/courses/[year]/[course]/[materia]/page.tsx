"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface Aula {
  _id?: string;
  aulaId?: string;
  titulo?: string;
  Horario?: string;
  DesAula?: string;
  anoEscolar?: string;
  cursos?: string[];
  curso?: string;
  Turma?: string;
  Materia?: string;
  materias?: string | string[];
  professor?: string;
  arquivos?: { nome: string }[];
  arquivosIds?: string[];
}

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
  // Extrai apenas o número do ano da URL (ex: '1-ano' -> '1')
  const paramNum = parseInt(anoParam.replace(/\D/g, ""), 10);
  const apiNum = parseInt(anoApi, 10);

  return apiNum === paramNum || apiNum - 1 === paramNum;
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
          "https://apisubaulas.onrender.com/api/v1/aulas/MostarAulas"
        );
        if (!res.ok) {
          throw new Error("Falha ao buscar dados da API.");
        }
        const data = await res.json();
        setAulas(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ocorreu um erro desconhecido."
        );
        setAulas([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAulas();
  }, []);

  // Filtro robusto
  const aulasFiltradas = aulas.filter((aula) => {
    if (!year || !course || !materia) return false;

    const anoOk = matchAno(aula.anoEscolar, year);

    const cursoApi = Array.isArray(aula.cursos) ? aula.cursos[0] : aula.curso;
    const cursoOk = normalize(cursoApi).includes(normalize(course));

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
    (aula, index, self) =>
      index === self.findIndex((a) => a.aulaId === aula.aulaId)
  );

  const handleCardClick = (aula: Aula) => {
    const id = aula.aulaId || aula._id;
    if (id) {
      router.push(`/teacher/dashboard/aulas/${id}`);
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
          Aulas de {decodeURIComponent(materia)} - {decodeURIComponent(course).toUpperCase()}
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
              key={aula.aulaId || aula._id}
              className="bg-[#111115] border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={() => handleCardClick(aula)}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText size={20} />
                  {aula.titulo || "Tema da Aula"}
                </CardTitle>
                <CardDescription className="text-sm text-gray-400 pt-1">
                  {aula.DesAula || 'Sem descrição.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Professor:</span>
                  <span className="font-medium">{aula.professor || "N/I"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Horário:</span>
                  <span className="font-medium">{aula.Horario || "N/I"}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}