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
import { useState } from 'react';

export default function UploadPage() {
  const [links, setLinks] = useState(['']);

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

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-8">Tela de Upload de Atividades</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ano-escolar">Ano Escolar</Label>
              <Select>
                <SelectTrigger id="ano-escolar" className="bg-[#111115] border-gray-700">
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent className="bg-[#111115] border-gray-700 text-white">
                  <SelectItem value="1">1º Ano</SelectItem>
                  <SelectItem value="2">2º Ano</SelectItem>
                  <SelectItem value="3">3º Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="curso">Curso</Label>
              <Select>
                <SelectTrigger id="curso" className="bg-[#111115] border-gray-700">
                  <SelectValue placeholder="Selecione o curso" />
                </SelectTrigger>
                <SelectContent className="bg-[#111115] border-gray-700 text-white">
                  <SelectItem value="ti">TI - Informática</SelectItem>
                  <SelectItem value="adm">ADM - Administração</SelectItem>
                  <SelectItem value="mkt">MKT - Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="turma">Turma</Label>
              <Select>
                <SelectTrigger id="turma" className="bg-[#111115] border-gray-700">
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent className="bg-[#111115] border-gray-700 text-white">
                  <SelectItem value="a">Turma A</SelectItem>
                  <SelectItem value="b">Turma B</SelectItem>
                  <SelectItem value="c">Turma C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="materia">Matéria</Label>
              <Select>
                <SelectTrigger id="materia" className="bg-[#111115] border-gray-700">
                  <SelectValue placeholder="Selecione a matéria" />
                </SelectTrigger>
                <SelectContent className="bg-[#111115] border-gray-700 text-white">
                  <SelectItem value="portugues">Português</SelectItem>
                  <SelectItem value="matematica">Matemática</SelectItem>
                  <SelectItem value="historia">História</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center text-center h-64">
            <UploadCloud className="h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400 mb-2">
              Arraste e solte seus arquivos aqui ou
            </p>
            <Button variant="link" className="text-blue-400">
              ESCOLHER ARQUIVOS
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              Only PNG and JPG, Pdf (4mb max)
            </p>
          </div>

          <div className="flex justify-start gap-4 pt-4">
            <Button variant="outline" className="border-gray-600 hover:bg-gray-800">CANCELAR</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">ENVIAR</Button>
          </div>
        </div>

        <div className="space-y-6 bg-[#111115] p-6 rounded-lg">
          <h2 className="text-xl font-bold">Detalhes da Aula</h2>

          <div className="space-y-2">
            <Label htmlFor="nome-professor">Nome do Professor</Label>
            <Input id="nome-professor" placeholder="Digite o nome do professor" className="bg-[#1C1C24] border-gray-700" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" placeholder="Ex: Informática" className="bg-[#1C1C24] border-gray-700" />
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
                  <span>dd/mm/aaaa</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#111115] border-gray-700">
                <Calendar mode="single" />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="horario">Horário</Label>
            <div className="relative">
              <Input id="horario" type="time" placeholder="--:--" className="bg-[#1C1C24] border-gray-700 pr-10" />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao-aula">Descrição da Aula</Label>
            <Textarea
              id="descricao-aula"
              placeholder="Adicione um breve descrição do documento que será usado para essa aula"
              className="bg-[#1C1C24] border-gray-700"
              rows={4}
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
            <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-800" onClick={handleAddLink}>
              <Plus className="mr-2 h-4 w-4" /> ADICIONAR LINK
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
