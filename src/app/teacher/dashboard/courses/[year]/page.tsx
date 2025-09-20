'use client';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const coursesData = [
  {
    id: 'iot',
    title: 'IOT – Internet das Coisas',
    imageUrl: '/iot.png',
  },
  {
    id: 'ti',
    title: 'TI – Informática',
    imageUrl: '/ti.png',
  },
  {
    id: 'mmd',
    title: 'MMD – Multimídia',
    imageUrl: '/mmd.png',
  },
  {
    id: 'cdd',
    title: 'CDD – Ciências de Dados',
    imageUrl: '/cdd.png',
  },
  {
    id: 'adm',
    title: 'ADM – Administração',
    imageUrl: '/adm.png',
  },
  {
    id: 'mkt',
    title: 'MKT – Marketing',
    imageUrl: '/mkt.png',
  },
  {
    id: 'ia',
    title: 'IA – Inteligência Artificial',
    imageUrl: '/ia.png',
  },
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {coursesData.map((course) => (
          <Card
            key={course.id}
            className="bg-[#111115] border-gray-800 rounded-lg text-white hover:bg-gray-800 transition-colors cursor-pointer overflow-hidden"
            onClick={() => handleCourseClick(course.id)}
          >
            <div className="relative w-full aspect-video">
              <Image
                src={course.imageUrl}
                alt={`Imagem do curso ${course.title}`}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <CardTitle className="text-md font-semibold text-center">
                {course.title}
              </CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
