'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  UploadCloud,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  X,
  FileText,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import type { Aula } from '@/lib/types';

interface LinkItem {
  name: string;
  url: string;
}

export default function EditAulaPage() {
  const [structuredLinks, setStructuredLinks] = useState<LinkItem[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<any[]>([]);
  const [anoEscolar, setAnoEscolar] = useState('');
  const [curso, setCurso] = useState('');
  const [turma, setTurma] = useState<string>('');
  const [materia, setMateria] = useState('');
  const [professor, setProfessor] = useState('');
  const [titulo, setTitulo] = useState('');
  const [diaAula, setDiaAula] = useState<Date | undefined>(undefined);
  const [horario, setHorario] = useState('');
  const [descricao, setDescricao] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLinkName, setCurrentLinkName] = useState('');
  const [currentLinkUrl, setCurrentLinkUrl] = useState('');

  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (!id) return;
    async function fetchAula() {
      try {
        const response = await fetch(`https://apisubaulas.onrender.com/api/v1/aulas/aula-id/${id}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar dados da aula.');
        }
        const data: Aula = await response.json();

        setAnoEscolar(data.anoEscolar ? `${data.anoEscolar}-ano` : '');
        setCurso(Array.isArray(data.cursos) ? data.cursos[0] : (data.curso || ''));
        setTurma(Array.isArray(data.turmas) ? data.turmas[0] : (data.Turma || ''));
        setMateria(Array.isArray(data.materias) ? data.materias[0] as string : (data.materias as string || ''));
        setProfessor(data.professor || '');
        setTitulo(data.titulo || '');
        setDiaAula(data.DayAula ? parseISO(data.DayAula) : undefined);
        setHorario(data.Horario || '');
        setDescricao(data.DesAula || '');
        setStructuredLinks(Array.isArray(data.LinkAula) ? data.LinkAula : []);
        setExistingFiles(data.arquivos || []);
        
      } catch (error) {
        console.error("Erro ao buscar aula:", error);
        alert('Não foi possível carregar os dados da aula para edição.');
      }
    }
    fetchAula();
  }, [id]);

  const handleAddLink = () => {
    if (!currentLinkName || !currentLinkUrl) {
      alert('Por favor, preencha o nome e o link.');
      return;
    }
    setStructuredLinks([
      ...structuredLinks,
      { name: currentLinkName, url: currentLinkUrl },
    ]);
    setCurrentLinkName('');
    setCurrentLinkUrl('');
    setIsModalOpen(false);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = structuredLinks.filter((_, i) => i !== index);
    setStructuredLinks(newLinks);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleCancelar = () => {
    router.back();
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    const anoEscolarValue = anoEscolar ? anoEscolar.split('-')[0] : '';
    formData.append('anoEscolar', anoEscolarValue);
    formData.append('curso', JSON.stringify([curso]));
    formData.append('materias', materia);
    
    if (turma === 'all') {
      const turmasParaEnviar = ['1', '2', '3', '4', '5', '6', '7', '8'];
      formData.append('Turma', JSON.stringify(turmasParaEnviar));
    } else {
      formData.append('Turma', JSON.stringify([turma]));
    }
    
    formData.append('professor', professor);
    formData.append('titulo', titulo);
    
    if (diaAula) {
      formData.append('DayAula', format(diaAula, 'yyyy-MM-dd'));
    }
    
    formData.append('Horario', horario || '');
    formData.append('DesAula', descricao || '');

    if (structuredLinks.length > 0) {
      formData.append('LinkAula', JSON.stringify(structuredLinks));
    } else {
      formData.append('LinkAula', JSON.stringify([]));
    }

    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const res = await fetch(
        `https://apisubaulas.onrender.com/api/v1/aulas/${id}`,
        {
          method: 'PATCH',
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({
          error: 'Não foi possível ler a resposta de erro da API.',
        }));
        const specificMessage = errorData.error || errorData.message || 'Erro desconhecido';
        throw new Error(specificMessage);
      }

      alert('Aula atualizada com sucesso!');
      router.push('/teacher/dashboard/gerenciar');
    } catch (error: any) {
      const errorMessage = error?.message || 'Ocorreu um erro desconhecido.';
      console.error('Erro ao atualizar aula:', error);
      alert(`Erro ao atualizar a aula: ${errorMessage}`);
    }
  };

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-8">Editar Atividade</h1>
      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ano-escolar">Ano Escolar *</Label>
                <Select value={anoEscolar} onValueChange={setAnoEscolar}>
                  <SelectTrigger
                    id="ano-escolar"
                    className="bg-[#111115] border-gray-700"
                  >
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111115] border-gray-700 text-white">
                    <SelectItem value="1-ano">1º Ano</SelectItem>
                    <SelectItem value="2-ano">2º Ano</SelectItem>
                    <SelectItem value="3-ano">3º Ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="curso">Curso *</Label>
                <Select value={curso} onValueChange={setCurso}>
                  <SelectTrigger
                    id="curso"
                    className="bg-[#111115] border-gray-700"
                  >
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111115] border-gray-700 text-white">
                    <SelectItem value="TI - Informática">TI - Informática</SelectItem>
                    <SelectItem value="ADM - Administração">ADM - Administração</SelectItem>
                    <SelectItem value="MKT - Marketing">MKT - Marketing</SelectItem>
                    <SelectItem value="IOT - Internet das Coisas">IOT – Internet das Coisas</SelectItem>
                    <SelectItem value="MMD - Multimídia">MMD – Multimídia</SelectItem>
                    <SelectItem value="CDD - Ciências de Dados">CDD – Ciências de Dados</SelectItem>
                    <SelectItem value="IA - Inteligência Artificial">IA – Inteligência Artificial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="turma">Turma *</Label>
                <Select value={turma} onValueChange={(value) => setTurma(String(value))}>
                  <SelectTrigger
                    id="turma"
                    className="bg-[#111115] border-gray-700"
                  >
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111115] border-gray-700 text-white">
                    <SelectItem value="all">Todas as Turmas</SelectItem>
                    <SelectItem value="1">Turma 1</SelectItem>
                    <SelectItem value="2">Turma 2</SelectItem>
                    <SelectItem value="3">Turma 3</SelectItem>
                    <SelectItem value="4">Turma 4</SelectItem>
                    <SelectItem value="5">Turma 5</SelectItem>
                    <SelectItem value="6">Turma 6</SelectItem>
                    <SelectItem value="7">Turma 7</SelectItem>
                    <SelectItem value="8">Turma 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="materia">Matéria *</Label>
                <Select value={materia} onValueChange={setMateria}>
                  <SelectTrigger
                    id="materia"
                    className="bg-[#111115] border-gray-700"
                  >
                    <SelectValue placeholder="Selecione a matéria" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111115] border-gray-700 text-white">
                    <SelectItem value="Português">Português</SelectItem>
                    <SelectItem value="Inglês">Inglês</SelectItem>
                    <SelectItem value="Matemática">Matemática</SelectItem>
                    <SelectItem value="Geografia">Geografia</SelectItem>
                    <SelectItem value="Filosofia">Filosofia</SelectItem>
                    <SelectItem value="Física">Física</SelectItem>
                    <SelectItem value="FTP">FTP</SelectItem>
                    <SelectItem value="Artes">Artes</SelectItem>
                    <SelectItem value="Educação Física">Educação Física</SelectItem>
                    <SelectItem value="História">História</SelectItem>
                    <SelectItem value="Sociologia">Sociologia</SelectItem>
                    <SelectItem value="Química">Química</SelectItem>
                    <SelectItem value="Biologia">Biologia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center text-center h-64">
              <UploadCloud className="h-12 w-12 text-gray-500 mb-4" />
              <p className="text-gray-400 mb-2">
                Arraste e solte novos arquivos aqui ou
              </p>
              <Label
                htmlFor="file-upload"
                className="text-blue-400 cursor-pointer hover:underline"
              >
                ESCOLHER NOVOS ARQUIVOS
              </Label>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
              <div className="mt-4 text-sm text-gray-300">
                {files.length > 0 && (
                  <>
                    <p>{files.length} novo(s) arquivo(s) selecionado(s):</p>
                    <ul className="list-disc list-inside">
                      {files.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </>
                )}
                 {existingFiles.length > 0 && (
                  <>
                    <p className='mt-2'>Arquivos existentes:</p>
                    <ul className="list-disc list-inside">
                      {existingFiles.map((file, index) => (
                        <li key={index}>{file.nome}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-start gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="border-gray-600 hover:bg-gray-800"
                onClick={handleCancelar}
              >
                CANCELAR
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                SALVAR ALTERAÇÕES
              </Button>
            </div>
          </div>

          <div className="space-y-6 bg-[#111115] p-6 rounded-lg">
            <h2 className="text-xl font-bold">Detalhes da Aula</h2>

            <div className="space-y-2">
              <Label htmlFor="nome-professor">Nome do Professor *</Label>
              <Input
                id="nome-professor"
                placeholder="Digite o nome do professor"
                className="bg-[#1C1C24] border-gray-700"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                placeholder="Ex: Aula de Inglês"
                className="bg-[#1C1C24] border-gray-700"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dia-aula">Dia da Aula *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-[#1C1C24] border-gray-700 hover:bg-[#1C1C24]"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {diaAula ? (
                      format(diaAula, 'dd/MM/yyyy')
                    ) : (
                      <span>dd/mm/aaaa</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#111115] border-gray-700">
                  <Calendar
                    mode="single"
                    selected={diaAula}
                    onSelect={setDiaAula}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="horario">Horário</Label>
              <div className="relative">
                <Input
                  id="horario"
                  type="text"
                  placeholder="HH:MM"
                  className="bg-[#1C1C24] border-gray-700 pr-10"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao-aula">Descrição da Aula</Label>
              <Textarea
                id="descricao-aula"
                placeholder="Adicione uma breve descrição do documento que será usado para essa aula"
                className="bg-[#1C1C24] border-gray-700"
                rows={4}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label>Links da Aula</Label>
              <div className="space-y-2">
                {structuredLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 bg-[#1C1C24] p-2 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      <span className="text-sm">{link.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveLink(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-600 hover:bg-gray-800"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> ADICIONAR LINK
              </Button>
            </div>
          </div>
        </div>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1C1C24] p-8 rounded-lg shadow-lg w-full max-w-md relative text-white">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Cadastrar Link</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="link-name" className="text-sm font-medium">
                  Nome:
                </Label>
                <Input
                  id="link-name"
                  type="text"
                  placeholder="Ex: Exercício"
                  value={currentLinkName}
                  onChange={(e) => setCurrentLinkName(e.target.value)}
                  className="bg-gray-800 border-gray-700 mt-2"
                />
              </div>
              <div>
                <Label htmlFor="link-url" className="text-sm font-medium">
                  Link:
                </Label>
                <Input
                  id="link-url"
                  type="url"
                  placeholder="https://exemplo.com"
                  value={currentLinkUrl}
                  onChange={(e) => setCurrentLinkUrl(e.target.value)}
                  className="bg-gray-800 border-gray-700 mt-2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                FECHAR
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleAddLink}
              >
                SALVAR
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
