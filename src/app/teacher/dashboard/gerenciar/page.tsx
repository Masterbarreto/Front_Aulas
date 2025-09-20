'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import type { Aula } from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

const chartData = [
  { day: 'Seg', aulas: 1 },
  { day: 'Ter', aulas: 1 },
  { day: 'Qua', aulas: 1 },
  { day: 'Qui', aulas: 1 },
  { day: 'Sex', aulas: 2 },
  { day: 'Sáb', aulas: 4 },
];

const chartConfig: ChartConfig = {
  aulas: {
    label: 'Aulas',
    color: 'hsl(var(--chart-1))',
  },
};

const barChartData = [
  { materia: 'Português', substituicoes: 2 },
  { materia: 'Inglês', substituicoes: 2 },
];

const barChartConfig: ChartConfig = {
  substituicoes: {
    label: 'Substituições',
    color: 'hsl(var(--destructive))',
  },
};

export default function GerenciarPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);

  const fetchAulas = () => {
    fetch('https://apisubaulas.onrender.com/api/v1/aulas/MostarAulas')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAulas(data);
        } else {
          setAulas([]);
        }
      })
      .catch(() => setAulas([]));
  };

  useEffect(() => {
    fetchAulas();
  }, []);

  const handleDelete = async (id: string) => {
    if (!id) {
      alert('ID da aula não encontrado. Não é possível deletar.');
      return;
    }
    if (confirm('Tem certeza de que deseja deletar esta aula?')) {
      try {
        const res = await fetch(
          `https://apisubaulas.onrender.com/api/v1/aulas/${id}`,
          {
            method: 'DELETE',
          }
        );
        
        if (res.status === 204 || res.ok) {
           alert('Aula deletada com sucesso!');
           fetchAulas();
        } else {
          const errorData = await res.json().catch(() => ({ message: 'Falha ao deletar a aula' }));
          throw new Error(errorData.message || 'Falha ao deletar a aula');
        }

      } catch (error) {
        console.error('Erro ao deletar aula:', error);
        alert(`Erro ao deletar a aula: ${error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.'}`);
      }
    }
  };

  const aulasConcluidasCount = useMemo(() => {
    return aulas.filter((aula) => aula.concluida).length;
  }, [aulas]);

  function formatarData(dataString: string) {
    if (!dataString) return 'Sem data';
    const data = new Date(dataString);
    if (!isNaN(data.getTime())) {
      return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(
        data
      );
    }
    return 'Data inválida';
  }

  return (
    <div className="flex flex-col text-white">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Atividades</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#111115] border-gray-800">
          <CardHeader>
            <CardTitle>Relatório De Aulas</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[150px] w-full">
              <AreaChart
                data={chartData}
                margin={{ left: -20, top: 5, right: 20, bottom: -10 }}
              >
                <defs>
                  <linearGradient id="colorAulas" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-aulas)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-aulas)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'white' }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="aulas"
                  type="natural"
                  fill="url(#colorAulas)"
                  stroke="var(--color-aulas)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-[#111115] border-gray-800">
          <CardHeader>
            <CardTitle>Aulas Com Mais Substituição</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={barChartConfig}
              className="h-[150px] w-full"
            >
              <BarChart
                data={barChartData}
                margin={{ left: -20, top: 5, right: 20, bottom: -10 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="materia"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'white' }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="substituicoes"
                  fill="var(--color-substituicoes)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-[#111115] border-gray-800 flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle>Concluídas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <p className="text-6xl font-bold">{aulasConcluidasCount}</p>
            <p className="text-gray-400">Aulas</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg bg-[#111115] border-gray-800 p-4">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-[#111115]">
              <TableHead className="text-white">TÍTULO</TableHead>
              <TableHead className="text-white">STATUS</TableHead>
              <TableHead className="text-white">DATA</TableHead>
              <TableHead className="text-white">PROFESSOR</TableHead>
              <TableHead className="text-white">ANO ESCOLAR</TableHead>
              <TableHead className="text-white">CURSO</TableHead>
              <TableHead className="text-white">TURMA</TableHead>
              <TableHead className="text-white">MATÉRIA</TableHead>
              <TableHead className="text-white">AÇÕES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aulas.map((aula, index) => (
              <TableRow key={aula._id || index} className="border-gray-800">
                <TableCell>{aula.titulo}</TableCell>
                <TableCell>
                  <span
                    className={
                      aula.concluida ? 'text-green-400' : 'text-yellow-400'
                    }
                  >
                    {aula.concluida ? 'Concluída' : 'Não Concluída'}
                  </span>
                </TableCell>
                <TableCell>{formatarData(aula.DayAula)}</TableCell>
                <TableCell>{aula.professor}</TableCell>
                <TableCell>{aula.anoEscolar}</TableCell>
                <TableCell>
                  {Array.isArray(aula.curso)
                    ? aula.curso.join(', ')
                    : aula.curso}
                </TableCell>
                <TableCell>{aula.Turma}</TableCell>
                <TableCell>{aula.materias || aula.Materia || 'N/A'}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(aula._id)}
                    disabled={!aula._id}
                  >
                    DELETAR
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
