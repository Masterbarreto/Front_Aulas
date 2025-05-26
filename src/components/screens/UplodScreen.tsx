import { Hub } from "../ui/hub";
import React, { useState } from "react";
import "../../Styles/uplodScren.css";
import LinkInput from "../ui/LinkInput";
import { useForm, Controller } from "react-hook-form";
import { AulaSelects } from "../ui/AulaSelects";
import { FileUploader } from "../ui/FileUploader";
import { enviarParaApi } from "../../http/uploadService.ts";
import axios from "axios";


export function UplodScreen() {
    const [dataAula, setDataAula] = useState("");
    const [horaAula, setHoraAula] = useState("");
    const [descricao, setDescricao] = useState("");
    const { control, reset, getValues } = useForm();
    const [files, setFiles] = useState<File[]>([]);
    const [clearFiles, setClearFiles] = useState(false);
    const [clearLinks, setClearLinks] = useState(false);
    const [links, setLinks] = useState<string[]>([]);

    // Limpa todos os campos
    const handleCancelar = () => {
        reset();
        setDataAula("");
        setHoraAula("");
        setDescricao("");
        setFiles([]);
        setLinks([]);
        setClearFiles(true);
        setClearLinks(true);
        setTimeout(() => {
            setClearFiles(false);
            setClearLinks(false);
        }, 100); // reseta o flag após limpar
    };

    // Envia os dados para a API

const handleEnviar = async (e: React.FormEvent) => {
  e.preventDefault();
  const values = getValues();
  const nomeProf = localStorage.getItem("name") || "";

  const form = new FormData();
  form.append("anoEscolar", values["ano-escolar"]);
  form.append("curso", values.curso);
  form.append("titulo", values.titulo);
  form.append("Turma", values.turma);
  form.append("Materia", values.materia);
  form.append("DayAula", dataAula); // ex: "2025-05-29"
  form.append("Horario", horaAula); // ex: "14:30"
  form.append("DesAula", descricao);
  form.append("LinkAula", links[0] || ""); // ou null se preferir
  form.append("professor", nomeProf);

  // Os teus arquivos *têm* de ser enviados com a mesma chave que o servidor espera:
  files.forEach((file) => form.append("arquivos", file));

  try {
    await axios.post(
      "https://apisubaulas.onrender.com/api/v1/aulas",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    alert("Enviado com sucesso!");

    // Limpa todos os campos após o envio bem-sucedido
    handleCancelar();
  } catch (err: any) {
    console.error("Erro do servidor:", err.response?.data);
    alert("Falha: " + JSON.stringify(err.response?.data));
  }
};


    return (
        <div className="container-principal">
            <Hub />

            <div className="main-content">
                <h1 className="main-title">Tela de Upload de Atividades</h1>
                <div className="container-selects">
                    <AulaSelects control={control} />
                </div>
                <div className="upload-area">
                    <FileUploader onFilesSelected={setFiles} clearFiles={clearFiles} />
                </div>
                <div className="botoes-row">
                    <button className="btn-cancelar" type="button" onClick={handleCancelar}>
                        Cancelar
                    </button>
                    <button className="btn-enviar" type="submit" form="form-detalhes">
                        Enviar
                    </button>
                </div>
            </div>

            <form
                className="container-form"
                id="form-detalhes"
                onSubmit={handleEnviar}
                autoComplete="off"
            >
                <h1 className="title">Detalhes da Aula</h1>
                <label className="input-label" htmlFor="titulo">
                    Título
                </label>
                <input
                    type="text"
                    id="titulo"
                    className="input"
                    {...control.register("titulo", { required: true })}
                    placeholder="Ex: Informática"
                />
                <label className="input-label" htmlFor="data-aula">
                    Dia da Aula
                </label>
                <input
                    type="date"
                    id="data-aula"
                    className="input"
                    value={dataAula}
                    onChange={(e) => setDataAula(e.target.value)}
                    required
                />
                <label className="input-label" htmlFor="atividade">
                    Horário
                </label>
                <input
                    type="time"
                    id="atividade"
                    className="input"
                    value={horaAula}
                    onChange={(e) => setHoraAula(e.target.value)}
                    required
                />
                <label className="input-label" htmlFor="descricao-aula">
                    Descrição da Aula
                </label>
                <textarea
                    id="descricao-aula"
                    className="input textarea-descricao"
                    required
                    rows={10}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Adicione um breve descrição do documento que será usado para essa aula"
                />
                <LinkInput clearLinks={clearLinks} onLinksChange={setLinks} />
            </form>
        </div>
    );
}