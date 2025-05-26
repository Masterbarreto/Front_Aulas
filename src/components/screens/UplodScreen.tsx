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

        // Junta data e hora no formato ISO
        const dataCompleta = dataAula && horaAula ? `${dataAula}T${horaAula}:00` : "";

        try {
            const nome = localStorage.getItem("name");

            // Certifique-se de que todos os campos obrigatórios estão sendo enviados
            const payload = {
                dataAula: dataCompleta,
                descricao,
                titulo: values.titulo,
                anoEscolar: values["ano-escolar"], // Certifique-se de que o nome do campo está correto
                curso: values.curso,
                turma: values.turma,
                materia: values.materia,
                professor: nome,
                files,
                links,
            };

            console.log("Payload enviado:", payload);

            const formData = new FormData();
            formData.append("dataAula", dataCompleta);
            formData.append("descricao", descricao);
            formData.append("titulo", values.titulo);
            formData.append("anoEscolar", values["ano-escolar"]);
            formData.append("curso", values.curso);
            formData.append("turma", values.turma);
            formData.append("materia", values.materia);
            const nomeProf = localStorage.getItem("name") || "";  
            formData.append("professor", nomeProf);

            files.forEach((file) => {
                formData.append("files", file);
            });

            links.forEach((link) => {
                formData.append("links", link);
            });

            await enviarParaApi(formData);
            alert("Enviado com sucesso!");

            const userId = localStorage.getItem("userId");

            await axios.post(`${import.meta.env.VITE_API_URL}/users/activity`, {
                userId: userId,
                action: "Upload de atividade",
                data: new Date().toISOString(),
                detalhes: {
                    titulo: values.titulo,
                    turma: values.turma,
                    curso: values.curso,
                },
            });

            handleCancelar();
        } catch (error: any) {
            alert("Erro ao enviar! " + (error?.response?.data?.message || ""));
            console.error(error);
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