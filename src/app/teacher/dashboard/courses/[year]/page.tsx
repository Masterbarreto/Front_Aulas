'use client';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

const coursesData = [
  { id: 'iot', title: 'IOT – Internet das Coisas' },
  { id: 'ti', title: 'TI – Informática' },
  { id: 'mmd', title: 'MMD – Multimídia' },
  { id: 'cdd', title: 'CDD – Ciências de Dados' },
  { id: 'adm', title: 'ADM – Administração' },
  { id: 'mkt', title: 'MKT – Marketing' },
  { id: 'ia', title: 'IA – Inteligência Artificial' },
];

export default function CoursesPage() {
  const router = useRouter();
  const params = useParams();
  const year = params.year as string;

  const handleCourseClick = (courseId: string) => {
    router.push(`/teacher/dashboard/courses/${year}/${courseId}`);
  };

  return (
    <div className="flex flex-col text-white">
      <div
        className="flex items-center gap-4 mb-8 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-6 w-6" />
        <h1 className="text-2xl font-bold">
          Cursos – {year?.replace('-', 'º ')}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {coursesData.map((course) => (
          <Card
            key={course.id}
            className="bg-[#111115] border-gray-800 rounded-lg p-4 flex flex-col items-center justify-center aspect-square text-white hover:bg-gray-800 transition-colors cursor-pointer"
            onClick={() => handleCourseClick(course.id)}
          >
            <CardContent className="flex items-center justify-center text-center p-0">
              <CardTitle className="text-md font-semibold">
                {course.title}
              </CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
