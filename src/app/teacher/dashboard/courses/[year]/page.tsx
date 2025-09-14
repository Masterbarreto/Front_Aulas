'use client';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images.json';

const coursesData = [
  { id: 'iot', title: 'IOT – Internet das Coisas', imageId: 'iot' },
  { id: 'ti', title: 'TI – Informática', imageId: 'ti' },
  { id: 'mmd', title: 'MMD – Multimídia', imageId: 'mmd' },
  { id: 'cdd', title: 'CDD – Ciências de Dados', imageId: 'cdd' },
  { id: 'adm', title: 'ADM – Administração', imageId: 'adm' },
  { id: 'mkt', title: 'MKT – Marketing', imageId: 'mkt' },
  { id: 'ia', title: 'IA – Inteligência Artificial', imageId: 'ia' },
];

export default function YearScreen() {
  const router = useRouter();
  const params = useParams();
  const year = params.year as string;
  const courseId = params.course as string;

  const handleCursoClick = (cursoId: string) => {
    router.push(`/teacher/dashboard/courses/${year}/${cursoId}`);
  };

  const getImageData = (imageId: string) => {
    return placeholderImages.find((img) => img.id === imageId);
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
            const imageData = getImageData(curso.imageId);
            return (
              <div key={curso.id} onClick={() => handleCursoClick(curso.id)} className="cursor-pointer group">
                <Card className="bg-transparent border-none overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video relative w-full rounded-lg overflow-hidden">
                      {imageData && (
                        <Image
                          src={imageData.src}
                          alt={curso.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          data-ai-hint={imageData['data-ai-hint']}
                        />
                      )}
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
