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
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { Aula } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const weeklyChartConfig: ChartConfig = {
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
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [weeklyChartData, setWeeklyChartData] = useState<any[]>([]);
  const [aulasConcluidasCount, setAulasConcluidasCount] = useState(0);
  const router = useRouter();

  const fetchPageData = () => {
    Promise.all([
      fetch('https://apisubaulas.onrender.com/api/v1/aulas/MostarAulas').then(res => res.json()).catch(() => []),
      fetch('https://apisubaulas.onrender.com/api/v1/aulas/AulasConcluidas').then(res => res.json()).catch(() => []),
      fetch('https://apisubaulas.onrender.com/api/v1/relatorios/materias-mais-substituicoes').then(res => res.json()).catch(() => []),
      fetch('https://apisubaulas.onrender.com/api/v1/relatorios/relatorio-semanal').then(res => res.json()).catch(() => []),
    ])
      .then(
        ([
          aulasNaoConcluidasData,
          aulasConcluidasData,
          topMaterias,
          relatorioSemanal,
        ]) => {
          const naoConcluidas = Array.isArray(aulasNaoConcluidasData) ? aulasNaoConcluidasData : [];
          const concluidas = Array.isArray(aulasConcluidasData) ? aulasConcluidasData : [];
          setAulas([...naoConcluidas, ...concluidas].sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()));
          
          setAulasConcluidasCount(concluidas.length);

          // Processar dados do gráfico de barras (Aulas com mais substituição)
          if (Array.isArray(topMaterias)) {
            const formattedTopMaterias = topMaterias.map((item: any) => ({
              materia: item.materia,
              substituicoes: item.total || 0,
            }));
            setBarChartData(formattedTopMaterias);
          } else {
             setBarChartData([]);
          }

          // Processar dados do gráfico de área (Relatório Semanal)
          if (Array.isArray(relatorioSemanal)) {
            const dayOrder = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            const dayTranslation: { [key: string]: string } = {
                'Domingo': 'Dom',
                'Segunda': 'Seg',
                'Terça': 'Ter',
                'Quarta': 'Qua',
                'Quinta': 'Qui',
                'Sexta': 'Sex',
                'Sábado': 'Sáb'
            };
            
            const aulasPorDia = relatorioSemanal.reduce((acc, item) => {
                const dayAbbr = dayTranslation[item.dia];
                if (dayAbbr) {
                    acc[dayAbbr] = item.aulas;
                }
                return acc;
            }, {} as { [key: string]: number });
        
            const formattedWeeklyData = dayOrder.map(day => ({
                day: day,
                aulas: aulasPorDia[day] || 0,
            }));
            setWeeklyChartData(formattedWeeklyData);
          } else {
            setWeeklyChartData([]);
          }
        }
      )
      .catch((error) => {
        console.error('Erro ao processar os dados das APIs:', error);
        setAulas([]);
        setBarChartData([]);
        setWeeklyChartData([]);
        setAulasConcluidasCount(0);
      });
  };

  useEffect(() => {
    fetchPageData();
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
          fetchPageData();
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

  function formatarData(dataString: string | undefined) {
    if (!dataString) return 'Sem data';
    try {
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
            <ChartContainer config={weeklyChartConfig} className="h-[150px] w-full">
              <AreaChart data={weeklyChartData} margin={{ left: -20, top: 5, right: 20, bottom: -10 }}>
                <defs>
                  <linearGradient id="colorAulas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-aulas)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-aulas)" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: 'white' }}/>
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Area dataKey="aulas" type="natural" fill="url(#colorAulas)" stroke="var(--color-aulas)" stackId="a" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-[#111115] border-gray-800">
          <CardHeader>
            <CardTitle>Aulas Com Mais Substituição</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[150px] w-full">
              <BarChart data={barChartData} margin={{ left: -20, right: 20, top: 10, bottom: -10 }} barSize={20} barCategoryGap="40%">
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)"/>
                <XAxis dataKey="materia" tickLine={false} axisLine={false} tick={{ fill: 'white' }} tickFormatter={(value) => value.substring(0, 3)}/>
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'white' }} width={20} allowDecimals={false}/>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />}/>
                <Bar dataKey="substituicoes" fill="var(--color-substituicoes)" radius={4}/>
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
                  {aula.concluida ? (
                    <Badge variant="default" className="bg-green-600/20 text-green-400 border-green-500/30">
                      Concluída
                    </Badge>
                  ) : (
                    <Badge variant="default" className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">
                      Não Concluída
                    </Badge>
                  )}
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
