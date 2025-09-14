'use client';
import { useRouter, useParams } from 'next/navigation';
import React from 'react';
import {
  BookText,
  MessageCircle,
  Plus,
  Globe,
  BookOpen,
  Atom,
  Cpu,
  Drama,
  Dumbbell,
  GraduationCap,
  Users,
  FlaskConical,
  Fish,
  ArrowLeft,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const materias = [
  { nome: 'Portugues', icon: BookText, id: 'portugues' },
  { nome: 'Inglês', icon: MessageCircle, id: 'ingles' },
  { nome: 'Matemática', icon: Plus, id: 'matematica' },
  { nome: 'Geografia', icon: Globe, id: 'geografia' },
  { nome: 'Filosofia', icon: BookOpen, id: 'filosofia' },
  { nome: 'Física', icon: Atom, id: 'fisica' },
  { nome: 'FTP', icon: Cpu, id: 'ftp' },
  { nome: 'Artes', icon: Drama, id: 'artes' },
  { nome: 'Educação Física', icon: Dumbbell, id: 'educacao-fisica' },
  { nome: 'História', icon: GraduationCap, id: 'historia' },
  { nome: 'Sociologia', icon: Users, id: 'sociologia' },
  { nome: 'Quimica', icon: FlaskConical, id: 'quimica' },
  { nome: 'Biologia', icon: Fish, id: 'biologia' },
];

const turmasPorCurso: Record<string, string[]> = {
  mmd: ['1', '2', '3', '4', '5', '6', '7', '8'],
  iot: ['1', '2', '3', '4'],
  ti: ['1', '2', '3', '4'],
  cdd: ['1', '2', '3'],
  adm: ['1', '2', '3', '4'],
  mkt: ['1', '2', '3', '4'],
  ia: ['1', '2', '3'],
};

export default function MateriasScreen() {
  const router = useRouter();
  const params = useParams();
  const year = params.year as string;
  const course = params.course as string;

  const turmas = turmasPorCurso[course] || [];
  const [turmaSelecionada, setTurmaSelecionada] = React.useState(turmas[0]);

  const handleMateriaClick = (materiaId: string) => {
    // Navigate to the next page, you can define the route later
    console.log(`/${year}/${course}/${turmaSelecionada}/${materiaId}/aulas`);
    // router.push(`/${year}/${course}/${turmaSelecionada}/${materiaId}/aulas`);
  };

  return (
    <div className="flex flex-col text-white">
      <div
        className="flex items-center gap-4 mb-8 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-6 w-6" />
        <h1 className="text-2xl font-bold">
          Turmas do {year?.replace('-', ' ')} – Senac
        </h1>
      </div>

      <div className="flex flex-col">
        <h2 className="mb-4">Turmas do curso ({course?.toUpperCase()}):</h2>

        <div className="flex gap-4 mb-8 border-b border-gray-700">
          {turmas.map((turma) => (
            <Button
              key={turma}
              variant="ghost"
              className={`rounded-none text-white hover:bg-[#23262f] hover:text-white ${
                turmaSelecionada === turma
                  ? 'border-b-2 border-primary'
                  : 'border-b-2 border-transparent'
              }`}
              onClick={() => setTurmaSelecionada(turma)}
            >
              {turma.replace('-', ' ')}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {materias.map((materia) => {
            const Icon = materia.icon;
            return (
              <Card
                key={materia.id}
                className="bg-[#111115] border-gray-800 rounded-lg p-4 flex flex-col items-center justify-center aspect-[4/3] text-white hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => handleMateriaClick(materia.id)}
              >
                <Icon className="h-10 w-10 mb-3" />
                <span>{materia.nome}</span>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
