import { Hub } from "../ui/hub";
import React, { useState, useRef } from "react";
import "../../Styles/uplodScren.css";
import LinkInput from "../ui/LinkInput";
import { useForm, Controller } from "react-hook-form";
import { AulaSelects } from "../ui/AulaSelects";
import { FileUploader } from "../ui/FileUploader";
import { enviarParaApi } from "../../http/uploadService.ts";
import { TODOS_CURSOS, TODAS_TURMAS } from "../../constant/aula";
import { LinkModal } from "../ui/LinkModal";
import axios from "axios";

// Define a interface para os links estruturados
interface LinkItem {
  id: string;
  url: string;
  name: string;
}

export function UplodScreen() {
    const [dataAula, setDataAula] = useState("");
    const [horaAula, setHoraAula] = useState("");
    const [descricao, setDescricao] = useState("");
    const { control, reset, getValues } = useForm();
    const [files, setFiles] = useState<File[]>([]);
    const [clearFiles, setClearFiles] = useState(false);
    const [clearLinks, setClearLinks] = useState(false);
    const [links, setLinks] = useState<string[]>([]);
    const [structuredLinks, setStructuredLinks] = useState<LinkItem[]>([]); // Novo estado para links estruturados
    const linkModalRef = useRef<any>(null);

    // Limpa todos os campos
    const handleCancelar = () => {
        reset();
        setDataAula("");
        setHoraAula("");
        setDescricao("");
        setFiles([]);
        setLinks([]);
        setStructuredLinks([]); // Limpa os links estruturados
        setClearFiles(true);
        setClearLinks(true);

        // Limpa os links no LinkModal
        if (linkModalRef.current) {
            linkModalRef.current.resetLinks();
        }

        setTimeout(() => {
            setClearFiles(false);
            setClearLinks(false);
        }, 100); // reseta o flag após limpar
    };

    // Função para lidar com mudanças nos links estruturados
    const handleStructuredLinksChange = (newLinks: LinkItem[]) => {
        setStructuredLinks(newLinks);
        // Converte para o formato que a API espera (URLs e nomes alternativos)
        const linkData = newLinks.map(link => ({ url: link.url, name: link.name }));
        setLinks(linkData);
    };

    // Envia os dados para a API

const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const values = getValues();
    const nomeProf = localStorage.getItem("name") || "";

    const cursos = values.curso === "all" ? TODOS_CURSOS : [values.curso];
    const turmas = values.turma === "all" ? TODAS_TURMAS : [values.turma];

    const promises = cursos.flatMap((curso) =>
        turmas.map((turma) => {
            const form = new FormData();
            form.append("anoEscolar", values["ano-escolar"]);
            form.append("curso", curso);
            form.append("titulo", values.titulo);
            form.append("Turma", turma);
            form.append("Materia", values.materia);
            form.append("DayAula", dataAula);
            form.append("Horario", horaAula);
            form.append("DesAula", descricao);
            form.append("professor", nomeProf);

            // Adiciona os links estruturados como um único campo JSON
            form.append("LinkAula", JSON.stringify(structuredLinks));

            files.forEach((f) => form.append("arquivos", f));
            return enviarParaApi(form);
        })
    );

    try {
        await Promise.all(promises);
        alert("Todas as aulas criadas com sucesso!");
        await axios.post("https://apisubaulas.onrender.com/api/v1/users/activity", {
            userId: localStorage.getItem("id"),
            action: `Aulas criadas para os cursos: ${cursos.join(", ")} e turmas: ${turmas.join(", ")}`,
        });
        handleCancelar(); // Limpa todos os campos, incluindo os links
    } catch (err: any) {
        console.error(err.response?.data || err);
        alert("Erro ao criar as aulas: " + JSON.stringify(err.response?.data));
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
                <div className="link-section">
                    <label className="input-label">Links da Aula</label>
                    <LinkModal ref={linkModalRef} onLinksChange={handleStructuredLinksChange} />
                </div>
            </form>
        </div>
    );
}