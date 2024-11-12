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
  bankName?: string; // Nova propriedade para armazenar o nome do banco
  aboveAverage?: boolean; // Nova propriedade
}

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [banks, setBanks] = useState<string[]>([]);


  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      const formattedData = result.map((item) => {
        // Extrair o nome do banco da propriedade 'name'
        // Supondo que o nome do banco está antes da palavra 'Consulta'
        const bankName = item.name.replace("Consulta", "");
        return {
          ...item,
          delay: parseInt(item.delay.replace("ms", "")),
          bankName,
        };
      });

      // Obter lista única de bancos
      const uniqueBanks = Array.from(new Set(formattedData.map((item) => item.bankName)));
      setBanks(uniqueBanks);
      setData(formattedData);
      setFilteredData(formattedData);
    };
    getData();
  }, []);

  useEffect(() => {
    // Filtrar dados com base no banco selecionado
    const filtered = selectedBank
      ? data.filter((item) => item.bankName === selectedBank)
      : data;

    if (filtered.length > 0) {
      const totalDelay = filtered.reduce((sum, item) => sum + item.delay, 0);
      const averageDelay = totalDelay / filtered.length;
      const threshold = averageDelay * 1.5;
      const dataWithFlags = filtered.map((item) => ({
        ...item,
        aboveAverage: item.delay > threshold,
      }));
      setFilteredData(dataWithFlags);
    } else {
      setFilteredData([]);
    }
  }, [selectedBank, data]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gráfico de Desempenho</h1>
      <div className="mb-4">
        
        <button
          onClick={() => setSelectedBank(null)}
          className={`px-4 py-2 mr-2 ${selectedBank === null ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
        >
          Todos
        </button>

        {banks.map((bank) => (

          <button
            key={bank}
            onClick={() => setSelectedBank(bank)}
            className={`px-4 py-2 mr-2 ${selectedBank === bank ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
          >
            {bank}
          </button>
        ))}
        
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="createdAt"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={120}
          />
          <YAxis />
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            iconType="rect"
            iconSize={12}
          />
          <Bar dataKey="delay" name="Delay (ms)" fill="#8884d8">
            {filteredData.map((entry, index) => (
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