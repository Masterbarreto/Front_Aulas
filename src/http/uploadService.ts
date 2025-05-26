import axios from "axios";

export async function enviarParaApi({
  dataAula,
  descricao,
  titulo,
  anoEscolar,
  curso,
  turma,
  materia,
  professor,
  files = [],
  links = [],
}: {
  dataAula: string;
  descricao: string;
  titulo: string;
  anoEscolar: string;
  curso: string;
  turma: string;
  materia: string;
  professor: string;
  files?: File[];
  links?: string[];
}) {
  const formData = new FormData();

  formData.append("anoEscolar", anoEscolar || "");
  formData.append("titulo", titulo || "");
  formData.append("Turma", turma || "");
  formData.append("curso", curso || "");
  formData.append("Materia", materia || "");
  formData.append("DayAula", dataAula);
  formData.append("Horario", ""); // Se necessário, ajuste o valor
  formData.append("DesAula", descricao);
  formData.append("professor", professor || "");

  // Envia só o primeiro link (ou vazio)
  formData.append("LinkAula", links[0]?.trim() || "");

  // Envia todos os arquivos como campos separados
  (files ?? []).forEach((file) => {
    formData.append("arquivos", file);
  });

  return axios.post("http://localhost:3000/api/v1/aulas", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}