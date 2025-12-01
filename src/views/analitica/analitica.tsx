import React, { useState, useEffect } from "react"; 
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useAuth } from "../../hooks/useAuth"; 
import Dashboard from "./dashboard/dashboard";
import { useNavigate } from "react-router-dom";
import { 
  analiticasService, 
  EnviosPorRegion, 
  IngresosMensuales, 
  EstadoCarrito, 
  TendenciaProductos 
} from "../../db/services/analiticasServices";

interface KpiState {
  ingresos: number;
  porcentajeIngresos: number;
  mejorRegion: string;
  porcentajeRegion: number;
}

const Analitica: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estados para los gráficos
  const [dataRegiones, setDataRegiones] = useState<EnviosPorRegion[]>([]);
  const [dataIngresosMensuales, setDataIngresosMensuales] = useState<IngresosMensuales[]>([]);
  const [dataEstados, setDataEstados] = useState<EstadoCarrito[]>([]);
  
  // [NUEVO] Estado para guardar los productos top
  const [dataProductos, setDataProductos] = useState<TendenciaProductos>({ 
    completado: [], 
    abandonado: [], 
    cancelado: [] 
  });

  const [kpis, setKpis] = useState<KpiState>({
    ingresos: 0,
    porcentajeIngresos: 0,
    mejorRegion: "-",
    porcentajeRegion: 0
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Ejecutamos todas las promesas en paralelo
        const [regiones, ingresos, ingresosData, mejorRegionData, estadosData, productosData] = await Promise.all([
          analiticasService.obtenerEnviosPorRegion(),
          analiticasService.obtenerIngresosMensuales(),
          analiticasService.obtenerKpiIngresos(),
          analiticasService.obtenerKpiMejorRegion(),
          analiticasService.obtenerEstadoCarritos(),
          analiticasService.obtenerTendenciaProductos() // <--- Llamada de productos
        ]);

        // Guardamos en el estado
        setDataRegiones(regiones);
        setDataIngresosMensuales(ingresos);
        setDataEstados(estadosData);
        setDataProductos(productosData);

        setKpis({
          ingresos: ingresosData.ingresos,
          porcentajeIngresos: ingresosData.porcentaje,
          mejorRegion: mejorRegionData.mejorRegion,
          porcentajeRegion: mejorRegionData.porcentajeRegion
        });

      } catch (error) {
        console.error("Error cargando analíticas:", error);
      } finally {
        setLoading(false); 
      }
    };

    cargarDatos();
  }, []);

  const handleIrABusqueda = () => {
    navigate('/busqueda'); 
  };

  const esGerenteOAdmin = user && (user.role === "gerente" || user.role === "admin");

  if (!user) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;

 if (!esGerenteOAdmin) {
  return (
    <Box sx={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center",px: 2}}>
      <Box sx={{maxWidth: 400, width: "100%", textAlign: "center", p: 4, borderRadius: 3, boxShadow: 3, bgcolor: "background.paper"}}>
        <Typography variant="h4" color="error" sx={{ fontWeight: "bold", mb: 2 }}> Acceso Denegado </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          No tienes permisos para acceder a esta sección.  
          Solo los usuarios con roles de <strong>Gerente</strong> o <strong>Administrador</strong> pueden continuar.
        </Typography>

        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ mt: 1 }}
        >
          Volver al Inicio
        </Button>
      </Box>
    </Box>
  );
}


  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;

  return (
    <>
      <Dashboard 
        kpis={kpis} 
        dataIngresosMensuales={dataIngresosMensuales} 
        dataRegiones={dataRegiones}
        dataEstadosCarrito={dataEstados} 
        dataProductos={dataProductos} // Pasamos la data de productos
        onSearchClick={handleIrABusqueda}
      />
    </>
  );
};

export default Analitica;