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

export default function MateriasScreen() {
  const router = useRouter();
  const params = useParams();
  const year = params.year as string;
  const course = params.course as string;

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

  const handleMateriaClick = (materiaId: string) => {
    router.push(`/teacher/dashboard/courses/${year}/${course}/${materiaId}`);
  };

  return (
    <div className="flex flex-col text-white">
      <div
        className="flex items-center gap-4 mb-8 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-6 w-6" />
        <h1 className="text-2xl font-bold">
          Matérias de {course?.toUpperCase()} – {year?.replace('-', 'º ')}
        </h1>
      </div>

      <div className="flex flex-col">
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
