import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button } from '@mui/material';
import logo from "../../../assets/LOGO1.svg";

function HeaderGPI() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. TUS RUTAS ORIGINALES
  const menuItems = [
    { name: "Home", path: "/home" },
    { name: "Analítica", path: "/analitica" },
    { name: "Reporte", path: "/reporte" },
  ];

  // Función para saber si el enlace está activo (para la rayita inferior)
  const isActive = (path: string) => location.pathname === path;

  // Estilo para los botones de navegación
  const navButtonStyle = (path: string) => ({
    color: 'white',
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '1rem',
    mx: 1,
    // Rayita blanca debajo si es la ruta actual
    borderBottom: isActive(path) ? '3px solid white' : '3px solid transparent',
    borderRadius: 0,
    paddingBottom: '4px',
    '&:hover': {
      bgcolor: 'transparent',
      opacity: 0.9
    }
  });

  return (
    <Box component="header" sx={{ 
      bgcolor: '#23C55E', // Tu color original
      height: '70px',     
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      px: 4, 
      flexShrink: 0, 
      boxShadow: 'none',
      zIndex: 10 
    }}>
      
      {/* --- IZQUIERDA: Logo + Tus Rutas --- */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
          
          {/* Logo */}
          <img 
            src={logo} 
            alt="logo" 
            style={{ 
              height: '40px', 
              borderRadius: '5px', 
              marginRight: '30px', 
              cursor: 'pointer',
              border: '2px solid white' // Mantuve el borde blanco que tenías, queda bien
            }} 
            onClick={() => navigate('/home')}
          />

          {/* Renderizamos tus rutas aquí */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {menuItems.map((item) => (
              <Button 
                key={item.name}
                onClick={() => navigate(item.path)} 
                sx={navButtonStyle(item.path)}
                disableRipple
              >
                {item.name}
              </Button>
            ))}
          </Box>
      </Box>

      {/* --- DERECHA: Botón Salir --- */}
      <Box>
         <Button 
            variant="outlined"
            onClick={() => navigate('/auth/login')} 
            sx={{ 
                color: 'white', 
                border: '1px solid rgba(255,255,255,0.6)', 
                bgcolor: 'rgba(255,255,255,0.1)', 
                textTransform: 'none',
                borderRadius: '20px', 
                px: 3,
                height: '36px',
                '&:hover': { 
                   bgcolor: 'rgba(255,255,255,0.25)',
                   border: '1px solid white'
                } 
            }}
         >
            Salir
         </Button>
      </Box>

    </Box>
  );
}

export default HeaderGPI;