import React, { useState, useEffect } from "react"; 
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useAuth } from "../../hooks/useAuth"; 
import Dashboard from "./dashboard/dashboard";
import { useNavigate } from "react-router-dom";
import { analiticasService, DistribucionRegional, TendenciaSemestral } from "../../db/services/analiticasServices";

// Definimos la interfaz del Estado de los KPIs
interface KpiState {
  ingresos: number;
  porcentajeIngresos: number;
  pedidos: number;
  mejorRegion: string;
  porcentajeRegion: number;
}

const Analitica: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. ESTADO PARA GRÁFICOS
  const [dataRegiones, setDataRegiones] = useState<DistribucionRegional[]>([]);
  const [dataTendencias, setDataTendencias] = useState<TendenciaSemestral[]>([]);
  
  // 2. ESTADO PARA KPIs
  const [kpis, setKpis] = useState<KpiState>({
    ingresos: 0,
    porcentajeIngresos: 0,
    pedidos: 86,
    mejorRegion: "-",
    porcentajeRegion: 0
  });

  const [loading, setLoading] = useState<boolean>(true);

  // 3. useEffect: Carga de datos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [regiones, tendencias, ingresosData, mejorRegionData] = await Promise.all([
          analiticasService.obtenerDistribucionRegional(),
          analiticasService.obtenerTendenciaSemestral(),
          analiticasService.obtenerKpiIngresos(),
          analiticasService.obtenerKpiMejorRegion()
        ]);

        setDataRegiones(regiones);
        setDataTendencias(tendencias);

        setKpis(prev => ({
          ...prev,
          ingresos: ingresosData.ingresos,
          porcentajeIngresos: ingresosData.porcentaje,
          mejorRegion: mejorRegionData.mejorRegion,
          porcentajeRegion: mejorRegionData.porcentajeRegion
        }));

      } catch (error) {
        console.error("Error cargando analíticas:", error);
      } finally {
        setLoading(false); 
      }
    };

    cargarDatos();
  }, []);

  // --- LÓGICA DE SEGURIDAD ---
  const esGerenteOAdmin = user && (user.role === "gerente" || user.role === "admin");

  // Si aún no sabemos quién es el usuario (esperando validación del token)
  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Si sabemos quién es y NO tiene permisos
  if (!esGerenteOAdmin) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: 2 }}>
        <Typography variant="h4" color="error" sx={{ fontWeight: 'bold' }}>Acceso Denegado</Typography>
        <Typography variant="body1" color="textSecondary">No tienes los permisos para ver analitica.</Typography>
        <Button variant="contained" onClick={() => navigate('/')}>Volver al Inicio</Button>
      </Box>
    );
  }

  // 4. Loading
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 5. Renderizamos
  return (
    <>
      <Dashboard 
        kpis={kpis} 
        dataTendencias={dataTendencias} 
        dataRegiones={dataRegiones}     
      />
    </>
  );
};

export default Analitica;
