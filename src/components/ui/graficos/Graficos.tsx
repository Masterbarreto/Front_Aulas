import React, { useState, useEffect } from 'react';
import Grafico1 from './garfico1';
import Grafico2 from './garfico2';
import Grafico3 from './garfico3';
import '../../../Styles/graficos/garaficos.css'; // Importa o CSS

const Graficos = () => {
  const [relatorioSemanal, setRelatorioSemanal] = useState([]);
  const [materiasMaisSubstituicoes, setMateriasMaisSubstituicoes] = useState([]);
  const [totalAulasConcluidas, setTotalAulasConcluidas] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDados = async () => {
    setLoading(true);
    try {
      const [relatorioRes, materiasRes, concluidasRes] = await Promise.all([
        fetch('https://apisubaulas.onrender.com/api/v1/relatorios/relatorio-semanal'),
        fetch('https://apisubaulas.onrender.com/api/v1/relatorios/materias-mais-substituicoes'),
        fetch('https://apisubaulas.onrender.com/api/v1/relatorios/total-aulas-concluidas'),
      ]);

      const relatorioData = await relatorioRes.json();
      const materiasData = await materiasRes.json();
      const concluidasData = await concluidasRes.json();

      setRelatorioSemanal(relatorioData);
      setMateriasMaisSubstituicoes(materiasData);
      setTotalAulasConcluidas(concluidasData.totalConcluidas);
    } catch (error) {
      console.error('Erro ao buscar dados:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando gráficos...</div>
      </div>
    );
  }

  return (
    <div className="container-graficos">
      <div className="graficos-container">
        <div className="grafico1-item">
          <Grafico1 data={relatorioSemanal} />
        </div>
        <div className="grafico2-item">
          <Grafico2 data={materiasMaisSubstituicoes} />
        </div>
        <div className="grafico3-item">
          <Grafico3 value={totalAulasConcluidas} />
        </div>
      </div>
    </div>
  );
};

export default Graficos;