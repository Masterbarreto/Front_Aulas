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
  anoEscolar: string;
  curso: string;
  titulo: string;
  Turma: string;
  Materia: string;
  DayAula: string;
  Horario: string;
  DesAula: string;
  LinkAula: any; // Can be a string or an array of objects
  concluida: boolean;
  professor?: string;
  createdAt?: string;
}
