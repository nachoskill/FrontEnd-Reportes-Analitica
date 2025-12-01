import React from "react";
import { Box, Grid, Paper, Stack, Typography, Button, Chip } from "@mui/material";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
  LineChart, Line, AreaChart, Area
} from "recharts";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PublicIcon from '@mui/icons-material/Public';
import BadgeIcon from '@mui/icons-material/Badge';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'; // Icono puntito

// --- COLORES ---
const PURPLE_ACTIVE = "#7367F0";
const PURPLE_LIGHT = "#E0E0FC";
const PRIMARY_TEAL = "#0d9488"; // Color principal para actividad diaria
const COLORS_ROLES = ["#7367F0", "#FF9F43"]; 

const COLORS_ACTIVITY = {
  High: "#28C76F",   
  Medium: "#00CFE8", 
  Low: "#A8AAAE"     
};

// --- DATOS MOCK ---

// 1. NUEVOS USUARIOS (Macro - Mensual)
const dataNewUsersBar = [
  { name: 'Feb', value: 4500, active: false },
  { name: 'Mar', value: 5000, active: true },
  { name: 'Abr', value: 2600, active: false },
  { name: 'May', value: 4200, active: false },
  { name: 'Jun', value: 1800, active: false },
  { name: 'Jul', value: 3100, active: false },
];

// 2. SESIONES HOY (Micro - Diario por Hora) <--- NUEVO
const dataSesionesHoy = [
  { hora: '00:00', usuarios: 120 },
  { hora: '04:00', usuarios: 45 },
  { hora: '08:00', usuarios: 350 },
  { hora: '10:00', usuarios: 890 },
  { hora: '12:00', usuarios: 1200 }, // Peak mediodía
  { hora: '14:00', usuarios: 1100 },
  { hora: '16:00', usuarios: 950 },
  { hora: '18:00', usuarios: 1400 }, // Peak tarde
  { hora: '20:00', usuarios: 1100 },
  { hora: '22:00', usuarios: 600 },
];

const dataRoles = [
  { name: 'Clientes', value: 8500 },
  { name: 'Vendedores', value: 1200 },
];

const dataGeo = [
  { ciudad: 'Santiago', usuarios: 4500 },
  { ciudad: 'Viña', usuarios: 1200 },
  { ciudad: 'Conce', usuarios: 980 },
  { ciudad: 'Antof.', usuarios: 650 },
  { ciudad: 'Ext.', usuarios: 300 },
];

const dataUserQuality = [
  { name: 'Compradores (Acción Alta)', value: 1500, color: COLORS_ACTIVITY.High, desc: 'Compraron o añadieron al carrito' },
  { name: 'Exploradores (Acción Media)', value: 4200, color: COLORS_ACTIVITY.Medium, desc: 'Usaron buscador o vieron >3 ítems' },
  { name: 'Observadores (Acción Baja)', value: 3100, color: COLORS_ACTIVITY.Low, desc: 'Solo visitaron la página de inicio' },
];

const cardStyle = {
  borderRadius: "20px", boxShadow: "0px 5px 25px rgba(0, 0, 0, 0.05)",
  bgcolor: "#FFFFFF", p: 3, height: "100%", display: "flex", flexDirection: "column"
};

const ActividadUsuarioTab: React.FC = () => {
  return (
    <Box>
      {/* SECCIÓN 1: GRÁFICOS SUPERIORES */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        
        {/* GRÁFICO 1: NUEVOS USUARIOS (MENSUAL) */}
        <Grid item xs={12} md={6}>
          <Paper sx={cardStyle}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Box>
                  <Typography variant="h6" color="#333" fontWeight={800}>Nuevos Usuarios</Typography>
                  <Typography variant="body2" color="textSecondary">Registros mensuales</Typography>
              </Box>
              <Button endIcon={<KeyboardArrowDownIcon />} sx={{ color: '#888', textTransform: 'none', bgcolor: '#F5F5F5', borderRadius: 2, px: 2 }}>6 Meses</Button>
            </Stack>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dataNewUsersBar}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888' }} dy={10} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}/>
                    <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={30}>
                      {dataNewUsersBar.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.active ? PURPLE_ACTIVE : PURPLE_LIGHT} />
                      ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* GRÁFICO 2: USUARIOS ACTIVOS HOY (DIARIO) */}
        <Grid item xs={12} md={6}>
          <Paper sx={cardStyle}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h6" color="#333" fontWeight={800}>Actividad Diaria</Typography>
                      {/* Indicador LIVE */}
                      
                  </Stack>
                  <Typography variant="body2" color="textSecondary">Usuarios activos por dia</Typography>
              </Box>
              <Typography variant="h4" fontWeight={800} color={PRIMARY_TEAL}>1.4k</Typography>
            </Stack>
            
            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={dataSesionesHoy}>
                    <defs>
                        <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={PRIMARY_TEAL} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={PRIMARY_TEAL} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="hora" axisLine={false} tickLine={false} tick={{ fill: '#888' }} dy={10} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
                    <Area 
                        type="monotone" 
                        dataKey="usuarios" 
                        stroke={PRIMARY_TEAL} 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorUsuarios)" 
                    />
                </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* SECCIÓN 2: SEGMENTACIÓN */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: PRIMARY_TEAL }}>
          Segmentación de Usuarios
      </Typography>

      <Grid container spacing={3}>
        {/* 1. ROLES */}
        <Grid item xs={12} md={4}>
            <Paper sx={cardStyle}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <BadgeIcon sx={{ color: PRIMARY_TEAL }} />
                    <Typography variant="subtitle1" fontWeight={700}>Roles (Comparativa)</Typography>
                </Stack>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dataRoles} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '10px' }} />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                            {dataRoles.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS_ROLES[index % COLORS_ROLES.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        </Grid>

        {/* 2. GEOGRAFÍA */}
        <Grid item xs={12} md={4}>
            <Paper sx={cardStyle}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <PublicIcon sx={{ color: PRIMARY_TEAL }} />
                    <Typography variant="subtitle1" fontWeight={700}>Top Geografía</Typography>
                </Stack>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart layout="vertical" data={dataGeo} margin={{ left: 10, right: 10 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="ciudad" type="category" width={70} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '10px' }} />
                        <Bar dataKey="usuarios" fill="#00CFE8" radius={[0, 10, 10, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        </Grid>

       

      </Grid>
    </Box>
  );
};

export default ActividadUsuarioTab;