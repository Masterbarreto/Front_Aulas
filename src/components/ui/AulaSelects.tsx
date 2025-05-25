import React from "react";
import { Controller } from "react-hook-form";
import "../../Styles/AulaSelects.css";

interface AulaSelectsProps {
  control: any;
}

export function AulaSelects({ control }: AulaSelectsProps) {
  return (
    <div className="container-selectss">
      <div>
        <label htmlFor="ano-escolar">Ano Escolar</label>
        <Controller
          control={control}
          name="ano-escolar"
          defaultValue=""
          render={({ field }) => (
            <select className="input" {...field}>
              <option value="">Selecione o ano</option>
              <option value="1ano">1 Ano</option>
              <option value="2ano">2 Ano</option>
              <option value="3ano">3 Ano</option>
            </select>
          )}
        />
      </div>
      <div>
        <label htmlFor="curso">Curso</label>
        <Controller
          control={control}
          name="curso"
          defaultValue=""
          render={({ field }) => (
            <select className="input" {...field}>
              <option value="">Selecione o curso</option>
              <option value="all">Todos os cursos</option> 
              <option value="iot">iot</option>
              <option value="MMD">MMD</option>
              <option value="ADM">ADM</option>
              <option value="TI">t.i</option>
              <option value="CDD">cdd</option>
              <option value="MKT">mkt</option>
              <option value="IA">IA</option>
            </select>
          )}
        />
      </div>
      <div>
        <label htmlFor="turma">Turma</label>
        <Controller
          control={control}
          name="turma"
          defaultValue=""
          render={({ field }) => (
            <select className="input" {...field}>
              <option value="">Selecione a turma</option>
              <option value="all">Todas As Turmas</option> 
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          )}
        />
      </div>
      <div>
        <label htmlFor="materia">Matéria</label>
        <Controller
          control={control}
          name="materia"
          defaultValue=""
          render={({ field }) => (
            <select className="input" {...field}>
              <option value="">Selecione a matéria</option>
              <option value="portugues">português</option>
              <option value="matematica">matemática</option>
              <option value="historia">história</option>
              <option value="geografia">geografia</option>
              <option value="ingles">inglês</option>
              <option value="fisica">física</option>
              <option value="FTP">FTP</option>
              <option value="quimica">química</option>
              <option value="biologia">biologia</option>
              <option value="filosofia">filosofia</option>
              <option value="arte">arte</option>
              <option value="sociologia">sociologia</option>
              <option value="educacao fisica">educação física</option>
            </select>
          )}
        />
      </div>
    </div>
  );
}