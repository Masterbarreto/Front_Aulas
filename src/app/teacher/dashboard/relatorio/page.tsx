'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Aula } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function RelatorioPage() {
  const [aulasConcluidas, setAulasConcluidas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAulasConcluidas() {
      try {
        const response = await fetch('https://apisubaulas.onrender.com/api/v1/aulas/AulasConcluidas');
        if (!response.ok) {
          throw new Error('Falha ao buscar as aulas concluídas.');
        }
        const data = await response.json();
        setAulasConcluidas(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
        setAulasConcluidas([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAulasConcluidas();
  }, []);

  function formatarData(dataString?: string) {
    if (!dataString) return 'Não informado';
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return 'Data inválida';
    // Adiciona o fuso horário para garantir que a data seja exibida corretamente
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }

  return (
    <div className="flex flex-col text-white">
      <h1 className="text-3xl font-bold mb-6">Relatório de Aulas Concluídas</h1>
      {loading && <p>Carregando relatórios...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="rounded-lg bg-[#111115] border-gray-800 p-4">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-[#111115]">
                <TableHead className="text-white">AULA</TableHead>
                <TableHead className="text-white">STATUS</TableHead>
                <TableHead className="text-white">DATA</TableHead>
                <TableHead className="text-white">PROFESSOR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aulasConcluidas.length > 0 ? (
                aulasConcluidas.map((aula) => (
                  <TableRow key={aula._id} className="border-gray-800">
                    <TableCell>{aula.titulo}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600/20 text-green-400 border-green-500/30">
                        Concluída
                      </Badge>
                    </TableCell>
                    <TableCell>{formatarData(aula.DayAula)}</TableCell>
                    <TableCell>{aula.professor || 'Não informado'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-400">
                    Nenhuma aula concluída encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
