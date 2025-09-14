'use client';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const courses = [
    { name: '1º Ano', year: 1 },
    { name: '2º Ano', year: 2 },
    { name: '3º Ano', year: 3 },
  ];

  const handleYearClick = (year: number) => {
    router.push(`/teacher/dashboard/courses/${year}-ano`);
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Bem-vindos Professores
      </h1>
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-left">Seus Cursos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {courses.map((course) => (
            <Card
              key={course.year}
              className="bg-[#111115] border-gray-800 rounded-lg p-4 flex flex-col items-center justify-center aspect-square text-white hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={() => handleYearClick(course.year)}
            >
              <CardContent className="flex flex-col items-center justify-center p-0">
                <GraduationCap className="h-12 w-12 mb-4" />
                <p className="font-semibold text-md">{course.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
