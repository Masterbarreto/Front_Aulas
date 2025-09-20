'use client';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';

const coursesData = [
  { id: 'iot', title: 'IOT – Internet das Coisas', imageKey: 'iot' },
  { id: 'ti', title: 'TI – Informática', imageKey: 'ti' },
  { id: 'mmd', title: 'MMD – Multimídia', imageKey: 'mmd' },
  { id: 'cdd', title: 'CDD – Ciências de Dados', imageKey: 'cdd' },
  { id: 'adm', title: 'ADM – Administração', imageKey: 'adm' },
  { id: 'mkt', title: 'MKT – Marketing', imageKey: 'mkt' },
  { id: 'ia', title: 'IA – Inteligência Artificial', imageKey: 'ia' },
];

const getImageForCourse = (courseId: string) => {
    const imageMap = placeholderImages.courseImages as Record<string, { src: string; hint: string, width: number; height: number; }>;
    const imageData = imageMap[courseId] || imageMap.default;
    return imageData;
}


export default function YearScreen() {
  const router = useRouter();
  const params = useParams();
  const year = params.year as string;

  const handleCursoClick = (cursoId: string) => {
    router.push(`/teacher/dashboard/courses/${year}/${cursoId}`);
  };

  return (
    <div className="text-white">
      <div className="flex items-center gap-4 mb-8 cursor-pointer" onClick={() => router.back()}>
        <ArrowLeft className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Turmas do {year?.replace('-', 'º ')} – Senac</h1>
      </div>

      <div>
        <h2 className="text-lg mb-6">Cursos Técnicos:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {coursesData.map((curso) => {
            const { src, hint, width, height } = getImageForCourse(curso.id);
            return (
              <div key={curso.id} onClick={() => handleCursoClick(curso.id)} className="cursor-pointer group">
                <Card className="bg-transparent border-none overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video relative w-full rounded-lg overflow-hidden">
                      <Image
                        src={src}
                        alt={curso.title}
                        width={width}
                        height={height}
                        data-ai-hint={hint}
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <p className="font-semibold text-md mt-2">{curso.title}</p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
