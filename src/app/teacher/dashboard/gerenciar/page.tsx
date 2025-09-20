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
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';

const chartConfig: ChartConfig = {
  aulas: {
    label: 'Aulas',
    color: 'hsl(var(--chart-1))',
  },
};

const barChartConfig: ChartConfig = {
  substituicoes: {
    label: 'Substituições',
    color: 'hsl(var(--destructive))',
  },
};

export default function GerenciarPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [areaChartData, setAreaChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [aulasConcluidasCount, setAulasConcluidasCount] = useState(0);
  const router = useRouter();

  const fetchAulas = () => {
    Promise.all([
      fetch('https://apisubaulas.onrender.com/api/v1/aulas/MostarAulas').then(
        (res) => res.json()
      ),
      fetch('https://apisubaulas.onrender.com/api/v1/aulas/AulasConcluidas').then(
        (res) => res.json()
      ),
      fetch(
        'https://apisubaulas.onrender.com/api/v1/relatorios/relatorio-semanal'
      ).then((res) => res.json()),
      fetch(
        'https://apisubaulas.onrender.com/api/v1/relatorios/materias-mais-substituicoes'
      ).then((res) => res.json()),
      fetch(
        'https://apisubaulas.onrender.com/api/v1/relatorios/total-aulas-concluidas'
      ).then((res) => res.json()),
    ])
      .then(
        ([
          aulasNaoConcluidasData,
          aulasConcluidasData,
          relatorioSemanal,
          topMaterias,
          totalConcluidas,
        ]) => {
          const naoConcluidas = Array.isArray(aulasNaoConcluidasData)
            ? aulasNaoConcluidasData
            : [];
          const concluidas = Array.isArray(aulasConcluidasData)
            ? aulasConcluidasData
            : [];
          setAulas([...naoConcluidas, ...concluidas]);

          if (Array.isArray(relatorioSemanal)) {
            const dayOrder = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            
            const dayShiftMap: { [key: string]: string } = {
                'Dom': 'Sáb', 'Seg': 'Dom', 'Ter': 'Seg', 'Qua': 'Ter', 'Qui': 'Qua', 'Sex': 'Qui', 'Sáb': 'Sex'
            };

            const dataMap = new Map(relatorioSemanal.map(item => [item.dia, item.aulas || 0]));
            
            const finalData = dayOrder.map(originalDay => {
                const shiftedDay = dayShiftMap[originalDay];
                return {
                    day: shiftedDay,
                    value: dataMap.get(originalDay) || 0,
                };
            }).sort((a,b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

            setAreaChartData(finalData as any);
          }


          if (Array.isArray(topMaterias)) {
            const formattedTopMaterias = topMaterias.map((item: any) => ({
              materia: item.materia,
              substituicoes: item.substituicoes || 0,
            }));
            setBarChartData(formattedTopMaterias as any);
          }

          if (totalConcluidas && typeof totalConcluidas.total === 'number') {
            setAulasConcluidasCount(totalConcluidas.total);
          }
        }
      )
      .catch((error) => {
        console.error('Erro ao buscar dados:', error);
        setAulas([]);
        setAreaChartData([]);
        setBarChartData([]);
        setAulasConcluidasCount(0);
      });
  };

  useEffect(() => {
    fetchAulas();
  }, []);

  const handleRowClick = (aula: Aula) => {
    const id = aula.aulaId || aula._id;
    if (id) {
      router.push(`/teacher/dashboard/aulas/${id}`);
    } else {
      console.error('ID da aula não encontrado para navegação.');
    }
  };

  const handleEditClick = (e: React.MouseEvent, aula: Aula) => {
    e.stopPropagation();
    const id = aula.aulaId || aula._id;
    if (id) {
      router.push(`/teacher/dashboard/aulas/edit/${id}`);
    } else {
      console.error('ID da aula não encontrado para edição.');
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
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
          const errorData = await res
            .json()
            .catch(() => ({ message: 'Falha ao deletar a aula' }));
          throw new Error(errorData.message || 'Falha ao deletar a aula');
        }
      } catch (error) {
        console.error('Erro ao deletar aula:', error);
        alert(
          `Erro ao deletar a aula: ${
            error instanceof Error
              ? error.message
              : 'Ocorreu um erro desconhecido.'
          }`
        );
      }
    }
  };

  function formatarData(dataString: string) {
    if (!dataString) return 'Sem data';
    try {
      // Adicionar o deslocamento de fuso horário local para evitar que a data mude
      const date = new Date(dataString);
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      const correctedDate = new Date(date.getTime() + userTimezoneOffset);
      return format(correctedDate, 'dd/MM/yyyy');
    } catch {
      return 'Data inválida';
    }
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
              <AreaChart data={areaChartData} margin={{ left: 0, right: 20, top: 10, bottom: 0 }}>
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
                  dataKey="value"
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
            <CardTitle className="whitespace-nowrap">
              Aulas Com Mais Substituição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={barChartConfig}
              className="h-[150px] w-full"
            >
              <BarChart data={barChartData} margin={{ left: 0, right: 20, top: 10, bottom: 0 }}>
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
                  tickFormatter={(value) => value.substring(0, 3)}
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
              <TableHead className="text-white text-center">AÇÕES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aulas.map((aula, index) => (
              <TableRow
                key={aula.aulaId || aula._id || index}
                className="border-gray-800 cursor-pointer"
                onClick={() => handleRowClick(aula)}
              >
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
                  {Array.isArray(aula.cursos)
                    ? aula.cursos.join(', ')
                    : aula.curso}
                </TableCell>
                <TableCell>
                  {Array.isArray(aula.turmas)
                    ? aula.turmas.join(', ')
                    : aula.Turma}
                </TableCell>
                <TableCell>{Array.isArray(aula.materias) ? aula.materias.join(', ') : aula.materias || aula.Materia || 'N/A'}</TableCell>
                <TableCell className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleEditClick(e, aula)}
                    disabled={!aula.aulaId && !aula._id}
                  >
                    EDITAR
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => handleDelete(e, aula.aulaId || aula._id)}
                    disabled={!aula.aulaId && !aula._id}
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

    