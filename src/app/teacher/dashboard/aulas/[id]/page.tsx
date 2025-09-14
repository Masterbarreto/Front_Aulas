'use client';

import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Aula } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

async function getAula(id: string): Promise<Aula | null> {
  try {
    const response = await fetch(
      `https://apisubaulas.onrender.com/api/v1/aulas/aula-id/${id}`
    );
    if (!response.ok) {
      console.error('Failed to fetch aula:', response.statusText);
      return null;
    }
    const data = await response.json();
    if (typeof data.LinkAula === 'string' && data.LinkAula) {
      try {
        data.LinkAula = JSON.parse(data.LinkAula);
      } catch (error) {
        console.error('Erro ao parsear LinkAula:', error);
        data.LinkAula = [];
      }
    }
    return data;
  } catch (error) {
    console.error('Error fetching aula:', error);
    return null;
  }
}

function formatarData(dataString: string | undefined) {
  if (!dataString) return 'Não informado';
  const data = new Date(dataString);
  if (isNaN(data.getTime())) return 'Data inválida';
  return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

export default function AulaPage({ params }: { params: { id: string } }) {
  const [aula, setAula] = useState<Aula | null>(null);
  const router = useRouter();

  useEffect(() => {
    getAula(params.id).then(setAula);
  }, [params.id]);

  if (!aula) {
    return (
      <div className="flex flex-col text-white items-center justify-center h-full">
        <p>Carregando aula...</p>
      </div>
    );
  }
    
  if (!aula.Materia) {
    return (
      <div className="flex flex-col text-white items-center justify-center h-full">
        <p>Aula não encontrada.</p>
        <button onClick={() => router.back()} className="mt-4 text-blue-400 hover:underline">
          Voltar
        </button>
      </div>
    );
  }

  const titulo = aula.titulo
    ? aula.titulo.charAt(0).toUpperCase() + aula.titulo.slice(1).toLowerCase()
    : 'Aula';


  return (
    <div className="text-white">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()}>
            <ArrowLeft size={32} className="cursor-pointer" />
        </button>
        <div>
            <h1 className="text-3xl font-bold">
            Aula de {titulo}
            </h1>
            <p className="text-gray-400">matéria: {aula.Materia}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Seção de Descrição */}
        <Card className="md:col-span-2 bg-[#111115] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText size={24} />
              Tema da aula
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-t border-gray-700 my-4" />
            <h3 className="font-semibold mb-2">Descrição da Aula:</h3>
            <p className="text-gray-300">{aula.DesAula}</p>
          </CardContent>
        </Card>

        {/* Seção de Detalhes */}
        <Card className="bg-[#111115] border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl">Detalhes da Aula</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <div className='flex justify-between'>
                <span className='text-gray-400'>Criador da atividade:</span>
                <span className='font-medium'>{aula.professor}</span>
            </div>
            <div className='flex justify-between'>
                <span className='text-gray-400'>Data de Criação:</span>
                <span className='font-medium'>{formatarData(aula.createdAt)}</span>
            </div>
            <div className='flex justify-between'>
                <span className='text-gray-400'>Dia da Aula:</span>
                <span className='font-medium'>{formatarData(aula.DayAula)}</span>
            </div>
           
            <div className="border-t border-gray-700 my-2" />

            <h3 className="font-semibold mb-2">Links e Arquivos</h3>
            <div className="flex flex-col gap-2">
                {Array.isArray(aula.LinkAula) && aula.LinkAula.length > 0 ? (
                    aula.LinkAula.map((link: any, idx: number) => (
                        <a
                        key={`link-${idx}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline break-all"
                        >
                        {link.name || link.url}
                        </a>
                    ))
                ) : (
                    <p className="text-gray-400 text-xs">Nenhum link disponível</p>
                )}
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
              {aula.concluida ? 'Desconcluir Aula' : 'Concluir Aula'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
