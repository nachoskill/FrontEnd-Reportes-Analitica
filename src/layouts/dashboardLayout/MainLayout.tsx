import { Outlet } from "react-router-dom";
import { Box } from '@mui/material';

// Importamos el componente que acabamos de crear
import HeaderTop from "./menuHeader/HeaderGPI";

function MainLayout() {
  return (
    // 1. ESTRUCTURA VERTICAL (SÁNDWICH)
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100%', 
      overflow: 'hidden' 
    }}>

      {/* 2. EL HEAD (Lógica visual importada) */}
      <HeaderTop />



      {/* 3. EL MAIN (Se encarga de la ruta) */}
      <Box component="main" sx={{ 
        flex: 1, // Ocupa el centro
        bgcolor: '##f5f5f5', 
        p: 3, 
        overflowY: 'auto' 
      }}>
        <Outlet /> 
      </Box>

      {/* 4. EL FOOTER (Verde abajo) */}
      <Box component="footer" sx={{ 
        bgcolor: '#386641', 
        height: '50px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexShrink: 0 
      }}>
      
      </Box>

    </Box>
  );
}

export default MainLayout;