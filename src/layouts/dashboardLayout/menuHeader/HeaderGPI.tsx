<<<<<<< HEAD
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button } from '@mui/material';
import logo from "../../../assets/LOGO1.svg";
=======
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Box, Typography, IconButton, Drawer, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, Avatar 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from "../../../assets/logo.jpg";
>>>>>>> 51ae5e0228ddfbc6bc1f50aed23baf869c0c044d

function HeaderGPI() {
  const navigate = useNavigate();
  const location = useLocation();
<<<<<<< HEAD

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
=======
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDrawer(newOpen);
  };

  const icons = {
    home: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 24, height: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    analitica: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 24, height: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    reporte: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 24, height: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
      </svg>
    ),
    logout: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 30, height: 30 }}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
      </svg>
    )
  };

  const menuItems = [
    { name: "Home", path: "/home", icon: icons.home },
    { name: "Analítica", path: "/analitica", icon: icons.analitica },
    { name: "Reporte", path: "/reporte", icon: icons.reporte },
  ];

  return (
    <>
      {/* --- BARRA VERDE SUPERIOR --- */}
      <Box component="header" sx={{ 
        bgcolor: '#386641', height: '90px', display: 'flex', alignItems: 'center', 
        justifyContent: 'space-between', px: 3, flexShrink: 0, boxShadow: 3, zIndex: 10 
      }}>
        
        {/* IZQUIERDA: Botón Menú + Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={toggleDrawer(true)} sx={{ color: 'white', border: '1px solid rgba(255,255,255,0.5)' }}>
                <MenuIcon />
            </IconButton>
            <img src={logo} alt="logo" style={{ height: '45px', borderRadius: '5px', border: '2px solid white' }} />
            <Typography variant="h6" fontWeight="bold" color="white" sx={{ display: { xs: 'none', sm: 'block'} }}>
              Pulga Shop
            </Typography>
        </Box>

        {/* DERECHA: Perfil de Usuario + Botón Salir (Estilo Original) */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            
            {/* Contenedor "User Card" como lo tenías antes */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                p: 1, 
                borderRadius: 2, 
                border: '2px solid transparent',
                cursor: 'default',
                transition: 'all 0.2s',
                '&:hover': { 
                    border: '2px solid white', // Efecto hover original
                    bgcolor: 'rgba(255,255,255,0.1)'
                }
            }}>
                {/* Avatar y Nombre */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'white', color: '#A7C957', width: 40, height: 40 }}>BO</Avatar>
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column' }}>
                        {/* Nombre de usuario */}
                        <Typography variant="body1" color="white" fontWeight="500" lineHeight={1.2}>
                           user
                        </Typography>
                    </Box>
                </Box>

                {/* Botón de Salir (Logout) */}
                <IconButton 
                   onClick={() => navigate('/auth/login')} 
                   sx={{ 
                       color: 'white', 
                       p: 0.5,
                       '&:hover': { color: '#f2f2f2' } 
                   }}
                >
                    {icons.logout}
                </IconButton>

            </Box>

        </Box>
      </Box>

      {/* --- MENU LATERAL (DRAWER) --- */}
      <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250, height: '100%', bgcolor: '#A7C957', color: 'white' }} role="presentation" onClick={toggleDrawer(false)}>
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
            <img src={logo} alt="Pulga Shop Logo" style={{ height: '60px', borderRadius: '8px' }} />
            <Typography variant="h6" fontWeight="bold">Pulga Shop</Typography>
          </Box>
          <List sx={{ mt: 2 }}>
            {menuItems.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)} sx={{
                    bgcolor: location.pathname.includes(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                    mb: 1, mx: 1, borderRadius: 1,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}>
                  <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
>>>>>>> 51ae5e0228ddfbc6bc1f50aed23baf869c0c044d
  );
}

export default HeaderGPI;