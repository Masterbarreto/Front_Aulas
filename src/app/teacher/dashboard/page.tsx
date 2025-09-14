import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

export default function DashboardPage() {
  const courses = ['1º Ano', '2º Ano', '3º Ano'];

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-4xl font-bold mb-12">Bem-vindos Professores</h1>
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-left">Seus Cursos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course}
              className="bg-[#111115] border-gray-800 rounded-lg p-4 flex flex-col items-center justify-center aspect-square text-white hover:bg-gray-800 transition-colors"
            >
              <CardContent className="flex flex-col items-center justify-center p-0">
                <GraduationCap className="h-16 w-16 mb-4" />
                <p className="font-semibold text-lg">{course}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
