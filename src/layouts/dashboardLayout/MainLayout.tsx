import { Outlet } from "react-router-dom";
import { Box } from '@mui/material';

// 1. Importa tu Header
import HeaderTop from "./menuHeader/HeaderGPI";
// 2. Importa tu Footer (Asegúrate que la ruta coincida con donde lo guardaste)
import { PulgashopFooter } from "./menuHeader/PulgashopFooter"; 

function MainLayout() {
  return (
    // 1. ESTRUCTURA VERTICAL (SÁNDWICH)
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100%', 
      overflow: 'hidden' // Esto evita que la página entera tenga scroll
    }}>

      {/* 2. EL HEAD */}
      <HeaderTop />

      {/* 3. ZONA DE CONTENIDO SCROLLABLE */}
      {/* NOTA IMPORTANTE: He movido el Footer DENTRO de esta caja.
         Como tu footer es grande, debe scrollear junto con el contenido.
         Si lo dejas fuera, ocupará la mitad de la pantalla fijamente.
      */}
      <Box component="main" sx={{ 
        flex: 1, 
        bgcolor: '#f5f5f5', 
        // p: 3, // Quitamos el padding global para que el footer toque los bordes
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Contenedor para las páginas (Outlet) con padding */}
        <Box sx={{ flex: 1, p: 3 }}>
           <Outlet /> 
        </Box>

        {/* 4. EL FOOTER REAL */}
        {/* Reemplazamos el Box verde simple por tu componente */}
        <PulgashopFooter />

      </Box>

    </Box>
  );
}

export default MainLayout;