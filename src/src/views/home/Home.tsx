import React from 'react'

// src/views/home/Home.tsx


import { Box } from "@mui/material";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Los datos pueden estar fuera del componente si no cambian.
const salesData = [
  { month: 'Ene', ventas: 4000, compras: 2400 },
  { month: 'Feb', ventas: 3000, compras: 1398 },
  { month: 'Mar', ventas: 2000, compras: 9800 },
  { month: 'Abr', ventas: 2780, compras: 3908 },
  { month: 'May', ventas: 1890, compras: 4800 },
  { month: 'Jun', ventas: 2390, compras: 3800 },
  { month: 'Jul', ventas: 3490, compras: 4300 },
  { month: 'Ago', ventas: 4000, compras: 2400 },
  { month: 'Sep', ventas: 3000, compras: 1398 },
  { month: 'Oct', ventas: 2000, compras: 9800 },
];

function Home() {
  // Los hooks useState DEBEN estar DENTRO del componente.

  return (
    <Box>
      {/* Contenedor para los selectores de fecha */}
      

      {/* Contenedor para el nuevo gráfico */}
      <Box sx={{ height: 400, width: '100%', mt: 4 }}>
        <ResponsiveContainer>
          <BarChart
            data={salesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ventas" fill="#3E5247" />
            <Bar dataKey="compras" fill="#A3B899" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default Home;