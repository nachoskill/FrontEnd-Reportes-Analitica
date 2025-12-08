import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Stack, Typography, Button, Tooltip as MuiTooltip, ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
    AreaChart, Area, LineChart, Line, LabelList
} from "recharts";
import { useApi } from "../../../hooks/useApi";

// --- ICONOS ---
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PublicIcon from '@mui/icons-material/Public';
import BadgeIcon from '@mui/icons-material/Badge';
import DateRangeIcon from '@mui/icons-material/DateRange'; // Icono para Cohortes
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';

// --- COLORES ---
const PURPLE_ACTIVE = "#7367F0";
const PURPLE_LIGHT = "#E0E0FC";
const PRIMARY_TEAL = "#0d9488"; // Color principal
const COLORS_ROLES = ["#7367F0", "#FF9F43"];

// --- TIPOS ---
interface NuevoUsuario {
    name: string;
    cantidad: number;
    active: boolean;
}

// --- DATOS MOCK ---

// 2. SESIONES HOY
const dataSesionesHoy = [
    { hora: '00:00', usuarios: 120 },
    { hora: '04:00', usuarios: 45 },
    { hora: '08:00', usuarios: 350 },
    { hora: '10:00', usuarios: 890 },
    { hora: '12:00', usuarios: 1200 },
    { hora: '14:00', usuarios: 1100 },
    { hora: '16:00', usuarios: 950 },
    { hora: '18:00', usuarios: 1400 },
    { hora: '20:00', usuarios: 1100 },
    { hora: '22:00', usuarios: 600 },
];

// 3. ROLES Y GEO
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

// 4. DATOS DE COHORTES (NUEVO)
const dataCohorts = [
    { month: 'Feb', users: 4500, rates: [100, 42, 35, 32, 28, 25] },
    { month: 'Mar', users: 5000, rates: [100, 38, 32, 28, 24] },
    { month: 'Abr', users: 2600, rates: [100, 35, 30, 25] },
    { month: 'May', users: 4200, rates: [100, 32, 28] },
    { month: 'Jun', users: 1800, rates: [100, 30] },
    { month: 'Jul', users: 3100, rates: [100] },
];

// --- ESTILOS COMUNES ---
const cardStyle = {
    borderRadius: "20px", boxShadow: "0px 5px 25px rgba(0, 0, 0, 0.05)",
    bgcolor: "#FFFFFF", p: 3, height: "100%", display: "flex", flexDirection: "column"
};

// --- SUB-COMPONENTE: HEATMAP DE RETENCIÓN ---
const RetentionCohort = () => {
    // Escala de color basada en el porcentaje
    const getBgColor = (percent: number) => {
        if (percent === 100) return '#f0fdfa'; // Base muy clara
        const opacity = Math.max(0.2, percent / 60);
        return `rgba(13, 148, 136, ${opacity})`; // PRIMARY_TEAL dinámico
    };

    const getTextColor = (percent: number) => {
        return percent > 45 ? '#ffffff' : '#1f2937';
    };

    return (
        <Paper sx={cardStyle}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ p: 1, bgcolor: '#f0fdfa', borderRadius: '10px' }}>
                        <DateRangeIcon sx={{ color: PRIMARY_TEAL }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" color="#333" fontWeight={800}>Retención de Usuarios (Cohortes)</Typography>
                        <Typography variant="body2" color="textSecondary">¿Vuelven los usuarios después del primer mes?</Typography>
                    </Box>
                </Stack>
            </Stack>

            <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 600 }}>
                    {/* Header Tabla */}
                    <Stack direction="row" spacing={1} sx={{ mb: 1.5, px: 1 }}>
                        <Typography variant="caption" sx={{ width: 80, fontWeight: 700, color: '#999' }}>COHORTE</Typography>
                        <Typography variant="caption" sx={{ width: 80, fontWeight: 700, color: '#999' }}>USUARIOS</Typography>
                        {dataCohorts[0].rates.map((_, i) => (
                            <Typography key={i} variant="caption" sx={{ flex: 1, textAlign: 'center', fontWeight: 700, color: '#999' }}>
                                {i === 0 ? "MES 0" : `+${i} MES`}
                            </Typography>
                        ))}
                    </Stack>

                    {/* Filas */}
                    {dataCohorts.map((row, idx) => (
                        <Stack key={idx} direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center', px: 1 }}>
                            {/* Nombre Mes */}
                            <Typography variant="body2" fontWeight={700} sx={{ width: 80, color: '#444' }}>
                                {row.month}
                            </Typography>
                            {/* Total Usuarios */}
                            <Typography variant="caption" sx={{ width: 80, color: '#666' }}>
                                {row.users.toLocaleString()}
                            </Typography>

                            {/* Celdas Heatmap */}
                            {row.rates.map((rate, i) => (
                                <MuiTooltip key={i} title={`${rate}% retenido (${Math.round(row.users * (rate / 100))} usuarios)`} arrow>
                                    <Box sx={{
                                        flex: 1,
                                        height: 35,
                                        bgcolor: getBgColor(rate),
                                        borderRadius: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: getTextColor(rate),
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        cursor: 'default',
                                        transition: 'all 0.2s',
                                        '&:hover': { transform: 'scale(1.05)', boxShadow: 2 }
                                    }}>
                                        {rate}%
                                    </Box>
                                </MuiTooltip>
                            ))}

                            {/* Relleno para efecto escalera */}
                            {Array.from({ length: 6 - row.rates.length }).map((_, i) => (
                                <Box key={`empty-${i}`} sx={{ flex: 1 }} />
                            ))}
                        </Stack>
                    ))}
                </Box>
            </Box>
        </Paper>
    );
};

// --- COMPONENTE PRINCIPAL ---
const ActividadUsuarioTab: React.FC = () => {
    const { get } = useApi();
    const [dataNewUsersBar, setDataNewUsersBar] = useState<NuevoUsuario[]>([]);
    const [rolesData, setRolesData] = useState<{ clientes: number; vendedores: number }>({ clientes: 0, vendedores: 0 });
    const [periodo, setPeriodo] = useState<'dia' | 'semana'>('dia');
    const [tipoGrafico, setTipoGrafico] = useState<'bar' | 'line'>('bar');
    const [loadingUsuarios, setLoadingUsuarios] = useState(true);

    // Cargar datos de nuevos usuarios
    useEffect(() => {
        const fetchNuevosUsuarios = async () => {
            setLoadingUsuarios(true);
            const data = await get<NuevoUsuario[]>(`/analiticas/actividad-usuarios/nuevos-usuarios?periodo=${periodo}`);
            if (data) {
                setDataNewUsersBar(data);
            }
            setLoadingUsuarios(false);
        };

        fetchNuevosUsuarios();
    }, [periodo, get]);

    // Cargar datos de roles
    useEffect(() => {
        const fetchRolesCount = async () => {
            const data = await get<{ clientes: number; vendedores: number }>('/analiticas/actividad-usuarios/roles-count');
            if (data) {
                setRolesData(data);
            }
        };

        fetchRolesCount();
    }, [get]);

    return (
        <Box>
            {/* SECCIÓN 1: SEGMENTACIÓN */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: PRIMARY_TEAL }}>
                Segmentación y Calidad
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* 1. ROLES */}
                <Grid item xs={12}>
                    <Paper sx={cardStyle}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                            <BadgeIcon sx={{ color: PRIMARY_TEAL }} />
                            <Typography variant="subtitle1" fontWeight={700}>Roles (Comparativa)</Typography>
                        </Stack>

                        {/* Comparativa Numérica */}
                        <Grid container spacing={3}>
                            {/* Clientes */}
                            <Grid item xs={6}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f0fdfa', borderRadius: 2 }}>
                                    <Typography variant="caption" color="textSecondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        Clientes
                                    </Typography>
                                    <Typography variant="h3" fontWeight={800} sx={{ color: PURPLE_ACTIVE, mt: 1 }}>
                                        {rolesData.clientes.toLocaleString()}
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Vendedores */}
                            <Grid item xs={6}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff5f0', borderRadius: 2 }}>
                                    <Typography variant="caption" color="textSecondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        Vendedores
                                    </Typography>
                                    <Typography variant="h3" fontWeight={800} sx={{ color: '#FF9F43', mt: 1 }}>
                                        {rolesData.vendedores.toLocaleString()}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* SECCIÓN 2: GRÁFICO NUEVOS USUARIOS */}
            <Grid container spacing={3} sx={{ mb: 3 }}>

                {/* GRÁFICO 1: NUEVOS USUARIOS */}
                <Grid item xs={12}>
                    <Paper sx={cardStyle}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                            <Box>
                                <Typography variant="h6" color="#333" fontWeight={800}>Nuevos Usuarios</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {periodo === 'dia' ? 'Por día del mes actual' : 'Por semanas del mes actual'}
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={1}>
                                {/* Botones para cambiar tipo de gráfico */}
                                <Button
                                    onClick={() => setTipoGrafico('bar')}
                                    sx={{
                                        minWidth: 40,
                                        p: 1,
                                        bgcolor: tipoGrafico === 'bar' ? PURPLE_ACTIVE : '#F5F5F5',
                                        color: tipoGrafico === 'bar' ? '#FFF' : '#888',
                                        '&:hover': { bgcolor: tipoGrafico === 'bar' ? PURPLE_ACTIVE : '#E0E0E0' }
                                    }}
                                >
                                    <BarChartIcon />
                                </Button>
                                <Button
                                    onClick={() => setTipoGrafico('line')}
                                    sx={{
                                        minWidth: 40,
                                        p: 1,
                                        bgcolor: tipoGrafico === 'line' ? PURPLE_ACTIVE : '#F5F5F5',
                                        color: tipoGrafico === 'line' ? '#FFF' : '#888',
                                        '&:hover': { bgcolor: tipoGrafico === 'line' ? PURPLE_ACTIVE : '#E0E0E0' }
                                    }}
                                >
                                    <ShowChartIcon />
                                </Button>
                                {/* Botones para cambiar período */}
                                <ToggleButtonGroup
                                    value={periodo}
                                    exclusive
                                    onChange={(e, newValue) => newValue && setPeriodo(newValue)}
                                    size="small"
                                    sx={{
                                        '& .MuiToggleButton-root': {
                                            border: 'none',
                                            borderRadius: '8px !important',
                                            mx: 0.5,
                                            px: 2,
                                            textTransform: 'none',
                                            color: '#888',
                                            bgcolor: '#F5F5F5',
                                            '&.Mui-selected': {
                                                bgcolor: PURPLE_ACTIVE,
                                                color: '#FFF',
                                                '&:hover': { bgcolor: PURPLE_ACTIVE }
                                            },
                                            '&:hover': { bgcolor: '#E0E0E0' }
                                        }
                                    }}
                                >
                                    <ToggleButton value="dia">Día</ToggleButton>
                                    <ToggleButton value="semana">Semana</ToggleButton>
                                </ToggleButtonGroup>
                            </Stack>
                        </Stack>
                        <ResponsiveContainer width="100%" height={250}>
                            {tipoGrafico === 'bar' ? (
                                <BarChart data={dataNewUsersBar}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="cantidad" radius={[10, 10, 10, 10]} barSize={22}>
                                        {dataNewUsersBar.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.active ? PURPLE_ACTIVE : PURPLE_LIGHT} />
                                        ))}
                                        <LabelList
                                            dataKey="cantidad"
                                            position="top"
                                            style={{ fill: '#333', fontWeight: 700, fontSize: 11 }}
                                            formatter={(value: any) => (value > 0 ? value : '')}
                                        />
                                    </Bar>
                                </BarChart>
                            ) : (
                                <LineChart data={
                                    // Filtrar datos para el gráfico lineal: solo mostrar hasta el último día con datos
                                    (() => {
                                        // Encontrar el índice del último elemento con cantidad > 0 o que sea active
                                        let lastIndexWithData = -1;
                                        for (let i = dataNewUsersBar.length - 1; i >= 0; i--) {
                                            if (dataNewUsersBar[i].cantidad > 0 || dataNewUsersBar[i].active) {
                                                lastIndexWithData = i;
                                                break;
                                            }
                                        }
                                        // Retornar solo los datos hasta ese índice
                                        return lastIndexWithData >= 0
                                            ? dataNewUsersBar.slice(0, lastIndexWithData + 1)
                                            : dataNewUsersBar;
                                    })()
                                }>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#000" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
                                    <Line
                                        type="monotone"
                                        dataKey="cantidad"
                                        stroke={PURPLE_ACTIVE}
                                        strokeWidth={3}
                                        dot={{ fill: PURPLE_ACTIVE, r: 5 }}
                                        activeDot={{ r: 7 }}
                                    />
                                </LineChart>
                            )}
                        </ResponsiveContainer>
                        {loadingUsuarios && (
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Typography variant="body2" color="textSecondary">Cargando datos...</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ActividadUsuarioTab;