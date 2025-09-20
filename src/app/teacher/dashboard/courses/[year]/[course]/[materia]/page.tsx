"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Aula } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AulaSimplificada = {
  _id: string;
  aulaId: string;
  titulo: string;
  DesAula: string;
  Horario: string;
  anoEscolar: string;
  cursos?: string[];
  Materia: string;
  materias?: string | string[];
  professor: string;
};

// Função para normalizar strings (remover acentos, converter para minúsculas)
function normalizeString(str: string | undefined | null): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function AulasListPage() {
  const params = useParams();
  const router = useRouter();
  const year = params.year as string;
  const course = params.course as string;
  const materia = params.materia as string;

  const [aulas, setAulas] = useState<AulaSimplificada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extrai o número do ano do parâmetro da URL (ex: "1-ano" -> 1)
  const anoParam = parseInt(year?.replace(/\D/g, "") || "0", 10);
  const courseParamNorm = normalizeString(course);
  const materiaParamNorm = normalizeString(materia);

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

  const aulasFiltradas = aulas.filter((aula) => {
    // 1. Filtro de Ano
    const anoApi = parseInt(aula.anoEscolar, 10);
    const anoMatch = anoApi === anoParam;

    // 2. Filtro de Curso
    const cursoMatch =
      aula.cursos?.some((c) => normalizeString(c).includes(courseParamNorm)) ??
      false;

    // 3. Filtro de Matéria
    let materiaApiNorm = normalizeString(aula.Materia);
    if (!materiaApiNorm && aula.materias) {
      if (Array.isArray(aula.materias)) {
        materiaApiNorm = normalizeString(aula.materias[0]);
      } else {
        materiaApiNorm = normalizeString(aula.materias);
      }
    }
    const materiaMatch = materiaApiNorm.includes(materiaParamNorm);

    return anoMatch && cursoMatch && materiaMatch;
  });

  // Remove duplicatas com base no ID da aula
  const aulasUnicas = aulasFiltradas.filter(
    (aula, index, self) =>
      index === self.findIndex((a) => a.aulaId === aula.aulaId)
  );

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
          Aulas de {decodeURIComponent(materia)} - {decodeURIComponent(course).toUpperCase()} (
          {anoParam}º ano)
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
              key={aula.aulaId}
              className="bg-[#111115] border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={() => router.push(`/teacher/dashboard/aulas/${aula.aulaId}`)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{aula.titulo}</CardTitle>
                <CardDescription className="text-sm text-gray-400 pt-1">
                  {aula.DesAula}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Professor:</span>
                  <span className="font-medium">{aula.professor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Horário:</span>
                  <span className="font-medium">{aula.Horario}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
