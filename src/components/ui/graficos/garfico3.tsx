import React from 'react';
import '../../../Styles/graficos/Gafico3.css';

interface Grafico3Props {
  value: number;
  maxValue?: number;
  label?: string;
  subtitle?: string;
}

const Grafico3: React.FC<Grafico3Props> = ({
  value,
  maxValue = 20,
  label = "Aulas",
  subtitle = "Concluídas",
}) => {
  const radius = 70;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percentage = Math.min((value / maxValue) * 100, 100);
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="grafico3-container">
      <h3 className="grafico3-title">{subtitle}</h3>
      <div className="flex flex-col items-center justify-center h-full py-4">
        <div className="relative flex items-center justify-center">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90"
          >
            {/* Círculo de fundo */}
            <circle
              stroke="#374151"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Círculo de progresso */}
            <circle
              stroke="#ef4444"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-gray-400">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grafico3;