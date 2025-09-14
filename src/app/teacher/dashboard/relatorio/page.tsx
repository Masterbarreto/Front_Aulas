'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AulaConcluida } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RelatorioPage() {
  const [aulas, setAulas] = useState<AulaConcluida[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('https://apisubaulas.onrender.com/api/v1/aulas/AulasConcluidas')
      .then((res) => res.json())
      .then((data) => setAulas(Array.isArray(data) ? data : []))
      .catch(() => setAulas([]));
  }, []);

  function getAulaDate(aula: AulaConcluida): string {
    return aula.data || aula.DayAula || aula.dataAula || '';
  }

  function formatarData(dataString: string) {
    if (!dataString) return 'N/A';

    if (dataString.includes('/')) {
      return dataString.split(' ')[0];
    }

    const data = new Date(dataString);
    if (!isNaN(data.getTime())) {
      return data.toLocaleDateString('pt-BR', {
        timeZone: 'UTC',
      });
    }

    return 'Data inválida';
  }

  const handleRowClick = (aulaId: string) => {
    router.push(`/teacher/dashboard/aulas/${aulaId}`);
  };

  return (
    <div className="flex flex-col text-white">
      <h1 className="text-3xl font-bold mb-6">Relatório de Aulas Concluídas</h1>
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
            {aulas.map((aula) => (
              <TableRow
                key={aula._id}
                className="border-gray-800 hover:bg-gray-800 cursor-pointer"
                onClick={() => handleRowClick(aula._id)}
              >
                <TableCell>{aula.Materia}</TableCell>
                <TableCell>
                  <span className="text-green-400">Concluída</span>
                </TableCell>
                <TableCell>{formatarData(getAulaDate(aula))}</TableCell>
                <TableCell>{aula.professor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
