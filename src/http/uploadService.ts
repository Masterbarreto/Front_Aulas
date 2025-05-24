import axios from "axios";

export async function enviarParaApi({
  values,
  dataAula,
  horaAula,
  descricao,
  files = [],
  links = [],
  titulo, // Adicionado aqui
}: {
  values: any;
  dataAula: string;
  horaAula: string;
  descricao: string;
  files?: File[];
  links?: string[];
  titulo?: string; // Adicionado aqui
}) {
  const formData = new FormData();

  formData.append("anoEscolar", values["ano-escolar"] || "");
  formData.append("titulo", titulo || values["titulo"] || ""); // Usa o campo separado se existir
  formData.append("Turma", values["turma"] || "");
  formData.append("curso", values["curso"] || "");
  formData.append("Materia", values["materia"] || "");
  formData.append("DayAula", dataAula);
  formData.append("Horario", horaAula);
  formData.append("DesAula", descricao);

  // Envia só o primeiro link (ou vazio)
  formData.append("LinkAula", links[0]?.trim() || "");

  // Envia todos os arquivos como campos separados (um campo arquivos para cada arquivo)
  (files ?? []).forEach((file) => {
    formData.append("arquivos", file);
  });

  return axios.post("https://apisubaulas.onrender.com/api/v1/aulas", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}