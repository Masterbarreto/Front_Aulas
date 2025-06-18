import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import '../../../Styles/graficos/Grafico2.css'; // Importa o CSS separado

interface MateriaSubstituicaoData {
  materia: string;
  total: number;
}

interface Grafico2Props {
  data: MateriaSubstituicaoData[];
}

const Grafico2: React.FC<Grafico2Props> = ({ data }) => {
  return (
    <div className="grafico2-container">
      <h3 className="grafico2-titulo">Aulas Com Mais Substituição</h3>
      <div style={{ height: '100%', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: -0, right: 500, bottom: 51, left: -30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="materia"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              domain={[0, 8]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#fff',
              }}
            />
            <Bar dataKey="total" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Grafico2;