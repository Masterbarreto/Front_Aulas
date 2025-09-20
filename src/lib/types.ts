export interface Turma {
  _id: string;
  nome: string;
  ano: number;
  turno: string;
  sala_id: string;
  alunos: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Aluno {
  _id: string;
  nome: string;
  idade: number;
  turma_id: string;
  data_nascimento: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AulaConcluida {
  _id: string;
  Materia: string;
  professor: string;
  data: string;
  DayAula?: string; // Optional
  dataAula?: string; // Optional
}

export interface Aula {
  _id: string;
  aulaId?: string;
  anoEscolar: string;
  curso?: string; // Legacy field
  cursos?: string[]; // New field
  titulo: string;
  Turma: string; // Legacy field
  turmas?: string[]; // New field
  Materia: string | string[]; // Legacy field
  materias?: string | string[]; // New field
  DayAula: string;
  Horario: string;
  DesAula: string;
  LinkAula: any; // Can be a string or an array of objects
  concluida: boolean;
  professor?: string;
  createdAt?: string;
  arquivos?: { nome: string; mimetype: string }[];
  arquivosIds?: string[];
}
