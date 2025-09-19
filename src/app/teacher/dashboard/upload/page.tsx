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
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useState, ChangeEvent, FormEvent } from 'react';
import { format } from 'date-fns';

export default function UploadPage() {
  const [links, setLinks] = useState<string[]>(['']);
  const [files, setFiles] = useState<File[]>([]);
  const [anoEscolar, setAnoEscolar] = useState('');
  const [curso, setCurso] = useState('');
  const [turma, setTurma] = useState('');
  const [materia, setMateria] = useState('');
  const [professor, setProfessor] = useState('');
  const [titulo, setTitulo] = useState('');
  const [diaAula, setDiaAula] = useState<Date | undefined>(undefined);
  const [horario, setHorario] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleAddLink = () => {
    setLinks([...links, '']);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleCancelar = () => {
    setAnoEscolar('');
    setCurso('');
    setTurma('');
    setMateria('');
    setProfessor('');
    setTitulo('');
    setDiaAula(undefined);
    setHorario('');
    setDescricao('');
    setFiles([]);
    setLinks(['']);
  };

  const handleEnviar = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('anoEscolar', anoEscolar);
    formData.append('curso', curso);
    formData.append('Turma', turma);
    formData.append('Materia', materia);
    formData.append('professor', professor);
    formData.append('titulo', titulo);
    if (diaAula) {
      formData.append('DayAula', format(diaAula, 'yyyy-MM-dd'));
    }
    formData.append('Horario', horario);
    formData.append('DesAula', descricao);
    
    const linkAula = links.filter(link => link.trim() !== '').map(link => ({ url: link, name: link }));
    formData.append('LinkAula', JSON.stringify(linkAula));

    files.forEach((file) => {
      formData.append('arquivos', file);
    });

    try {
      const response = await fetch('https://apisubaulas.onrender.com/api/v1/aulas/CriarAula', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao criar a aula.');
      }

      alert('Aula criada com sucesso!');
      handleCancelar();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
      console.error('Erro ao criar aula:', error);
      alert(`Erro ao criar a aula: ${errorMessage}`);
    }
  };

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-8">Tela de Upload de Atividades</h1>
      <form onSubmit={handleEnviar}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ano-escolar">Ano Escolar</Label>
                <Select value={anoEscolar} onValueChange={setAnoEscolar}>
                  <SelectTrigger id="ano-escolar" className="bg-[#111115] border-gray-700">
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
                <Label htmlFor="curso">Curso</Label>
                <Select value={curso} onValueChange={setCurso}>
                  <SelectTrigger id="curso" className="bg-[#111115] border-gray-700">
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111115] border-gray-700 text-white">
                    <SelectItem value="ti">TI - Informática</SelectItem>
                    <SelectItem value="adm">ADM - Administração</SelectItem>
                    <SelectItem value="mkt">MKT - Marketing</SelectItem>
                    <SelectItem value="iot">IOT – Internet das Coisas</SelectItem>
                    <SelectItem value="mmd">MMD – Multimídia</SelectItem>
                    <SelectItem value="cdd">CDD – Ciências de Dados</SelectItem>
                    <SelectItem value="ia">IA – Inteligência Artificial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="turma">Turma</Label>
                 <Input id="turma" placeholder="Ex: A, B, C ou 1, 2, 3" value={turma} onChange={(e) => setTurma(e.target.value)} className="bg-[#111115] border-gray-700" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="materia">Matéria</Label>
                <Select value={materia} onValueChange={setMateria}>
                  <SelectTrigger id="materia" className="bg-[#111115] border-gray-700">
                    <SelectValue placeholder="Selecione a matéria" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111115] border-gray-700 text-white">
                    <SelectItem value="portugues">Português</SelectItem>
                    <SelectItem value="ingles">Inglês</SelectItem>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="geografia">Geografia</SelectItem>
                    <SelectItem value="filosofia">Filosofia</SelectItem>
                    <SelectItem value="fisica">Física</SelectItem>
                    <SelectItem value="ftp">FTP</SelectItem>
                    <SelectItem value="artes">Artes</SelectItem>
                    <SelectItem value="educacao-fisica">Educação Física</SelectItem>
                    <SelectItem value="historia">História</SelectItem>
                    <SelectItem value="sociologia">Sociologia</SelectItem>
                    <SelectItem value="quimica">Química</SelectItem>
                    <SelectItem value="biologia">Biologia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center text-center h-64">
              <UploadCloud className="h-12 w-12 text-gray-500 mb-4" />
              <p className="text-gray-400 mb-2">
                Arraste e solte seus arquivos aqui ou
              </p>
              <Label htmlFor="file-upload" className="text-blue-400 cursor-pointer hover:underline">
                ESCOLHER ARQUIVOS
              </Label>
              <Input id="file-upload" type="file" className="hidden" multiple onChange={handleFileChange} />
              <p className="text-xs text-gray-500 mt-4">
                PDF, PNG, JPG (4mb max)
              </p>
               {files.length > 0 && (
                <div className="mt-4 text-sm text-gray-300">
                  <p>{files.length} arquivo(s) selecionado(s):</p>
                  <ul className="list-disc list-inside">
                    {files.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-start gap-4 pt-4">
              <Button type="button" variant="outline" className="border-gray-600 hover:bg-gray-800" onClick={handleCancelar}>CANCELAR</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">ENVIAR</Button>
            </div>
          </div>

          <div className="space-y-6 bg-[#111115] p-6 rounded-lg">
            <h2 className="text-xl font-bold">Detalhes da Aula</h2>

            <div className="space-y-2">
              <Label htmlFor="nome-professor">Nome do Professor</Label>
              <Input id="nome-professor" placeholder="Digite o nome do professor" className="bg-[#1C1C24] border-gray-700" value={professor} onChange={(e) => setProfessor(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input id="titulo" placeholder="Ex: Informática" className="bg-[#1C1C24] border-gray-700" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dia-aula">Dia da Aula</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-[#1C1C24] border-gray-700 hover:bg-[#1C1C24]"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {diaAula ? format(diaAula, 'dd/MM/yyyy') : <span>dd/mm/aaaa</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#111115] border-gray-700">
                  <Calendar mode="single" selected={diaAula} onSelect={setDiaAula} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="horario">Horário</Label>
              <div className="relative">
                <Input id="horario" type="time" className="bg-[#1C1C24] border-gray-700 pr-10" value={horario} onChange={(e) => setHorario(e.target.value)} />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
              {links.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    className="bg-[#1C1C24] border-gray-700"
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                  />
                  {links.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveLink(index)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" className="w-full border-gray-600 hover:bg-gray-800" onClick={handleAddLink}>
                <Plus className="mr-2 h-4 w-4" /> ADICIONAR LINK
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
