"use client";
import { useEffect, useState } from "react";
import { fetchData } from "./data/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DataPoint {
  createdAt: string;
  status: string;
  delay: number; // Alterado para number
  error: string | null;
  name: string;
  aboveAverage?: boolean; // Nova propriedade
}

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([]);
  
  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      // Convertendo 'delay' de string para número
      const formattedData = result.map((item) => ({
        ...item,
        delay: parseInt(item.delay.replace("ms", "")),
      }));
      // Calculando a média dos delays
      const totalDelay = formattedData.reduce(
        (sum, item) => sum + item.delay,
        0
      );
      const averageDelay = totalDelay / formattedData.length;
      // Definindo um limite para considerar 'muito acima da média' (por exemplo, 20% acima)
      const threshold = averageDelay * 1.5;
      // Marcando os itens que estão acima do limite
      const dataWithFlags = formattedData.map((item) => ({
        ...item,
        aboveAverage: item.delay > threshold,
      }));
      setData(dataWithFlags);
    };
    getData();
  }, []);
  
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gráfico de Desempenho</h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart  data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="createdAt"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={120}
          />
          <YAxis />
          <Tooltip  />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            iconType="rect"
            iconSize={16}
          />
          <Bar dataKey="delay" name="Delay (ms)" fill="#8884d8">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.aboveAverage ? "red" : "#8884d8"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </main>
  );
}