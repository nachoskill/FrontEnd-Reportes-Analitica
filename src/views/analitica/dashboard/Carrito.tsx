import React, { useState, useMemo } from "react";
import { Box, Grid, Paper, Typography, Stack, TextField, Button, Divider } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import CancelIcon from '@mui/icons-material/Cancel';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Tipos requeridos (o importalos desde tu archivo de tipos)
interface CarritosProps {
  dataEstadosCarrito: { name: string; value: number }[];
}

const PRIMARY_COLOR = "#1F4D5D";
const COLORES_ESTADOS: Record<string, string> = { "Completado": "#2e7d32", "Abandonado": "#ed6c02", "Cancelado": "#d32f2f" };
const cardStyle = { borderRadius: "20px", boxShadow: "0px 5px 25px rgba(0, 0, 0, 0.05)", bgcolor: "#FFFFFF", p: 3, height: "100%", display: "flex", flexDirection: "column" as const };
const formatearDinero = (valor: number) => `$${valor.toLocaleString('es-CL')}`;

// Subcomponente interno para la barra
const StatBarBlock = ({ label, count, total, color, icon, trendLabel, trendUp }: any) => {
  const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : "0";
  return (
    <Box sx={{ width: '100%', mb: 2, borderRadius: '12px', overflow: 'hidden', position: 'relative', bgcolor: `${color}20`, border: `1px solid ${color}40` }}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${percentage}%`, bgcolor: color, transition: 'width 1s ease-in-out', zIndex: 0 }} />
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1, p: 2, color: '#fff' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
           <Box sx={{ color: 'white' }}>{icon}</Box>
           <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1, color: 'white', textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}>{label.toUpperCase()}</Typography>
        </Stack>
        <Stack direction="column" alignItems="flex-end">
            <Typography variant="h5" sx={{ fontWeight: 800, color: parseInt(percentage) > 90 ? 'white' : '#333' }}>{percentage}%</Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
               <Typography variant="body2" sx={{ fontWeight: 600, color: parseInt(percentage) > 90 ? 'white' : '#555' }}>{count} carritos</Typography>
               {trendLabel && (<Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.2)', px: 0.5, borderRadius: 1 }}>{trendUp ? <TrendingUpIcon sx={{ fontSize: 14, color: '#fff' }}/> : <TrendingDownIcon sx={{ fontSize: 14, color: '#fff' }}/>}<Typography variant="caption" sx={{ color: '#fff', ml: 0.5 }}>{trendLabel}</Typography></Box>)}
            </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

const CarritosTab: React.FC<CarritosProps> = ({ dataEstadosCarrito }) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const totalCarritos = useMemo(() => dataEstadosCarrito.reduce((acc, curr) => acc + curr.value, 0), [dataEstadosCarrito]);
  const completados = dataEstadosCarrito.find(d => d.name === "Completado")?.value || 0;
  const abandonados = dataEstadosCarrito.find(d => d.name === "Abandonado")?.value || 0;
  const cancelados = dataEstadosCarrito.find(d => d.name === "Cancelado")?.value || 0;
  const ingresoPerdido = abandonados * 25000; // Logica de ejemplo

  return (
    <Stack spacing={3}>
      {/* FILTROS */}
      <Paper sx={{ ...cardStyle, p: 2, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              <FilterListIcon sx={{ color: PRIMARY_COLOR }} />
              <Typography variant="subtitle2" fontWeight={700} color={PRIMARY_COLOR}>Filtro por Precio:</Typography>
          </Box>
          <TextField size="small" placeholder="$ 50.000" label="Desde" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} sx={{ width: 150 }} InputProps={{ sx: { borderRadius: 2 } }} />
          <TextField size="small" placeholder="$ 500.000" label="Hasta" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} sx={{ width: 150 }} InputProps={{ sx: { borderRadius: 2 } }} />
          <Button variant="contained" sx={{ bgcolor: PRIMARY_COLOR, borderRadius: 2, textTransform: 'none' }}>Aplicar Filtro</Button>
      </Paper>

      <Grid container spacing={3}>
          {/* ESTADO CARRITOS */}
          <Grid item xs={12} lg={8}>
              <Paper sx={cardStyle}>
                  <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Box>
                          <Typography variant="h6" fontWeight={700} color={PRIMARY_COLOR}>Estado de Carritos</Typography>
                          <Typography variant="caption" color="textSecondary">Visualización porcentual</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" display="block" color="textSecondary">Total Carritos</Typography>
                          <Typography variant="h6" fontWeight={800}>{totalCarritos}</Typography>
                      </Box>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                      <StatBarBlock label="Completado" count={completados} total={totalCarritos} color={COLORES_ESTADOS["Completado"]} icon={<CheckCircleIcon fontSize="large"/>} trendLabel="+5% (Mejora)" trendUp={true} />
                      <StatBarBlock label="Abandonado" count={abandonados} total={totalCarritos} color={COLORES_ESTADOS["Abandonado"]} icon={<RemoveShoppingCartIcon fontSize="large"/>} trendLabel="-2 (Empeora)" trendUp={false} />
                      <StatBarBlock label="Cancelado" count={cancelados} total={totalCarritos} color={COLORES_ESTADOS["Cancelado"]} icon={<CancelIcon fontSize="large"/>} />
                  </Box>
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="textSecondary">Actualizado: Hace 5 minutos</Typography>
                      <Typography variant="body2" fontWeight={600} color="error.main">Ingreso Estimado Perdido: {formatearDinero(ingresoPerdido)}</Typography>
                  </Box>
              </Paper>
          </Grid>


      </Grid>
    </Stack>
  );
};

export default CarritosTab;