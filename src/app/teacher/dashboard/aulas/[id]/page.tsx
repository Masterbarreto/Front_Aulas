'use client';

import { ArrowLeft, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Aula } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Arquivo {
  _id: string;
  nome: string;
  mimetype: string;
}

interface LinkItem {
  name: string;
  url: string;
}

interface AulaCompleta extends Aula {
  arquivos: Arquivo[];
  arquivosIds: string[];
  LinkAula: LinkItem[];
  turmas: string[];
}

async function getAula(id: string): Promise<AulaCompleta | null> {
  try {
    const response = await fetch(
      `https://apisubaulas.onrender.com/api/v1/aulas/aula-id/${id}`
    );
    if (!response.ok) {
      console.error('Failed to fetch aula:', response.statusText);
      return null;
    }
    const data = await response.json();

    if (typeof data.LinkAula === 'string' && data.LinkAula.trim()) {
      try {
        const parsedLinks = JSON.parse(data.LinkAula);
        data.LinkAula = Array.isArray(parsedLinks) ? parsedLinks : [];
      } catch (error) {
        console.error('Erro ao parsear LinkAula:', error);
        data.LinkAula = [];
      }
    } else if (!Array.isArray(data.LinkAula)) {
      data.LinkAula = [];
    }
    
    if (data.Turma && !data.turmas) {
      data.turmas = [String(data.Turma)];
    } else if (!Array.isArray(data.turmas)) {
      data.turmas = [];
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

export default function AulaPage() {
  const [aula, setAula] = useState<AulaCompleta | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [professor, setProfessor] = useState('');
  const [turmaParaConcluir, setTurmaParaConcluir] = useState<string>('');
  const router = useRouter();
  const params = useParams();
  const id = params.id ? decodeURIComponent(params.id as string) : '';

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      const aulaAtual = await getAula(id);
      setAula(aulaAtual);
      if (aulaAtual?.turmas?.length) {
        setTurmaParaConcluir(aulaAtual.turmas[0]);
      }
    }
    fetchData();
  }, [id]);

  const handleConcluirClick = async () => {
    if (!professor || !turmaParaConcluir) {
      alert('Por favor, preencha o nome do professor e a turma.');
      return;
    }

    if (!aula) return;

    try {
      const response = await fetch(
        `https://apisubaulas.onrender.com/api/v1/aulas/${id}/concluir`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            concluida: true,
            professorConclusao: professor,
            turma: turmaParaConcluir,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Erro ao ler a resposta da API.' }));
        throw new Error(
          `Falha ao concluir a aula. Status: ${response.status}. Mensagem: ${errorData.message}`
        );
      }

      alert('Aula concluída com sucesso!');
      setShowModal(false);
      if (aula) {
        setAula({ ...aula, concluida: true });
      }
    } catch (err) {
      console.error('Erro ao concluir aula:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
      alert(`Erro ao concluir a aula: ${errorMessage}`);
    }
  };

  const handleDesconcluirClick = async () => {
    if (!id) return;
    try {
      const response = await fetch(
        `https://apisubaulas.onrender.com/api/v1/aulas/${id}/desconcluir`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
         throw new Error('Falha ao desconcluir a aula.');
      }

      alert('Aula marcada como não concluída!');
      if (aula) {
        setAula({ ...aula, concluida: false });
      }
    } catch (err) {
      console.error('Erro ao desconcluir aula:', err);
      alert('Erro ao desconcluir a aula!');
    }
  };

  if (!aula) {
    return (
      <div className="flex flex-col text-white items-center justify-center h-full">
        <p>Carregando aula...</p>
      </div>
    );
  }

  const titulo = aula.titulo
    ? aula.titulo.charAt(0).toUpperCase() + aula.titulo.slice(1).toLowerCase()
    : 'Aula';

  const materia = Array.isArray(aula.materias) ? aula.materias.join(', ') : aula.materias;


  return (
    <div className="text-white relative">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()}>
          <ArrowLeft size={32} className="cursor-pointer" />
        </button>
        <div>
          <h1 className="text-3xl font-bold">Aula de {titulo}</h1>
          <p className="text-gray-400">matéria: {materia}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <Card className="bg-[#111115] border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl">Detalhes da Aula</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Criador da atividade:</span>
              <span className="font-medium">{aula.professor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Data de Criação:</span>
              <span className="font-medium">{formatarData(aula.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Dia da Aula:</span>
              <span className="font-medium">{formatarData(aula.DayAula)}</span>
            </div>

            <div className="border-t border-gray-700 my-2" />

            <h3 className="font-semibold mb-2">Links e Arquivos</h3>
            <div className="flex flex-col gap-2">
              {Array.isArray(aula.arquivos) && aula.arquivos.length > 0
                ? aula.arquivos.map((arq: Arquivo, idx: number) => (
                    <button
                      key={`arquivo-${idx}`}
                      className="flex items-center justify-between w-full text-left p-2 rounded-md hover:bg-gray-700"
                      onClick={() => {
                        const arquivoId = aula.arquivosIds[idx];
                        if (arquivoId) {
                          fetch(
                            `https://apisubaulas.onrender.com/api/v1/aulas/${arquivoId}/pdf`
                          )
                            .then((res) => res.blob())
                            .then((blob) => {
                              const urlBlob = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = urlBlob;
                              a.download = arq.nome;
                              document.body.appendChild(a);
                              a.click();
                              window.URL.revokeObjectURL(urlBlob);
                              document.body.removeChild(a);
                            });
                        }
                      }}
                    >
                      <span className="flex items-center gap-2 text-blue-400">
                        <FileText size={20} />
                        {arq.nome}
                      </span>
                      <svg width="20" height="20" fill="#fff">
                        <path d="M5 13l4 4 4-4M12 17V7m-4 10V7" />
                      </svg>
                    </button>
                  ))
                : null}

              {Array.isArray(aula.LinkAula) && aula.LinkAula.length > 0
                ? aula.LinkAula.map((link: LinkItem, idx: number) => (
                    <div
                      key={`link-${idx}`}
                      className="cursor-pointer p-3 bg-[#2D2E36] rounded-lg mb-3 flex flex-col gap-2 hover:bg-gray-700"
                      onClick={() => window.open(link.url, '_blank')}
                    >
                      <div className="font-bold text-white">{link.name}</div>
                      <div className="text-gray-400 text-xs break-all">
                        {link.url}
                      </div>
                    </div>
                  ))
                : null}

              {(!aula.arquivos || aula.arquivos.length === 0) &&
                (!aula.LinkAula || aula.LinkAula.length === 0) && (
                  <p className="text-gray-400 text-xs">
                    Nenhum link ou arquivo disponível
                  </p>
                )}
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
              onClick={() =>
                aula.concluida
                  ? handleDesconcluirClick()
                  : setShowModal(true)
              }
            >
              {aula.concluida ? 'Desconcluir Aula' : 'Concluir Aula'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1C1C24] p-8 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-2">Concluir Aula</h2>
            <p className="text-gray-400 mb-6">
              Preencha essas informações para Concluir a Aula
            </p>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="professor-name"
                  className="text-sm font-medium text-gray-300"
                >
                  Nome de Quem Deu a Aula
                </Label>
                <Input
                  id="professor-name"
                  type="text"
                  placeholder="Professor Exemplo"
                  value={professor}
                  onChange={(e) => setProfessor(e.target.value)}
                  className="bg-gray-800 border-gray-700 mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="turma" className="text-sm font-medium text-gray-300">
                  Turma *
                </Label>
                <Select value={turmaParaConcluir} onValueChange={setTurmaParaConcluir}>
                  <SelectTrigger
                    id="turma"
                    className="bg-gray-800 border-gray-700 mt-2"
                  >
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111115] border-gray-700 text-white">
                    {aula.turmas.length > 1 && <SelectItem value="all">Todas as Turmas</SelectItem>}
                    {aula.turmas.map((turma) => (
                      <SelectItem key={turma} value={turma}>
                        Turma {turma}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Fechar
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleConcluirClick}
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
