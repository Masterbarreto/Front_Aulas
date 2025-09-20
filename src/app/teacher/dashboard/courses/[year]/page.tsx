'use client';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const coursesData = [
  { id: 'iot', title: 'IOT – Internet das Coisas' },
  { id: 'ti', title: 'TI – Informática' },
  { id: 'mmd', title: 'MMD – Multimídia' },
  { id: 'cdd', title: 'CDD – Ciências de Dados' },
  { id: 'adm', title: 'ADM – Administração' },
  { id: 'mkt', title: 'MKT – Marketing' },
  { id: 'ia', title: 'IA – Inteligência Artificial' },
];

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
            return (
              <div key={curso.id} onClick={() => handleCursoClick(curso.id)} className="cursor-pointer group">
                <Card className="bg-transparent border-none overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video relative w-full rounded-lg overflow-hidden">
                      <Image
                        src="/images/courses-banner.png"
                        alt={curso.title}
                        width={400}
                        height={225}
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
