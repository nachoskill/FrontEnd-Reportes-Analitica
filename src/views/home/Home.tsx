import React from 'react';
import { Box, Grid, Paper, Typography, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@mui/material';

// Iconos
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import InventoryIcon from '@mui/icons-material/Inventory';

function Home() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      
      {/* 1. SALUDO Y FECHA */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="#333">
          ¡Hola, User! 👋
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Aquí tienes el resumen de lo que pasa hoy en Pulga Shop.
        </Typography>
      </Box>

      {/* 2. TARJETAS DE KPI (Resumen del día) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* Tarjeta 1: Ventas Hoy */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Ventas Hoy</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#A7C957' }}>$125.000</Typography>
            </Box>
            <Avatar sx={{ bgcolor: '#e8f5e9', color: '#A7C957', width: 56, height: 56 }}>
              <AttachMoneyIcon fontSize="large" />
            </Avatar>
          </Paper>
        </Grid>

        {/* Tarjeta 2: Pedidos */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Pedidos Nuevos</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#003c58' }}>18</Typography>
            </Box>
            <Avatar sx={{ bgcolor: '#e1f5fe', color: '#003c58', width: 56, height: 56 }}>
              <ShoppingCartIcon fontSize="large" />
            </Avatar>
          </Paper>
        </Grid>

        {/* Tarjeta 3: Clientes */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Clientes Nuevos</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#7b1fa2' }}>5</Typography>
            </Box>
            <Avatar sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2', width: 56, height: 56 }}>
              <GroupAddIcon fontSize="large" />
            </Avatar>
          </Paper>
        </Grid>
      </Grid>

      {/* 3. SECCIÓN DIVIDIDA: ACCIONES RÁPIDAS Y ACTIVIDAD */}
      <Grid container spacing={3}>
        
        {/* COLUMNA IZQUIERDA: Accesos Directos */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Accesos Rápidos</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
               <Button 
                 variant="contained" 
                 fullWidth 
                 size="large"
                 startIcon={<AddCircleIcon />}
                 sx={{ 
                   bgcolor: '#A7C957', 
                   height: '80px',
                   fontSize: '1.1rem',
                   '&:hover': { bgcolor: '#8da84a' } 
                 }}
               >
                 Nueva Venta
               </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
               <Button 
                 variant="outlined" 
                 fullWidth 
                 size="large"
                 startIcon={<InventoryIcon />}
                 sx={{ 
                   height: '80px',
                   fontSize: '1.1rem',
                   color: '#555',
                   borderColor: '#ccc'
                 }}
               >
                 Agregar Producto
               </Button>
            </Grid>
          </Grid>

          {/* Un gráfico pequeño o banner promocional podría ir aquí */}
          <Paper sx={{ mt: 3, p: 3, bgcolor: '#003c58', color: 'white', borderRadius: 2 }}>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUpIcon fontSize="large" />
                <Box>
                    <Typography variant="h6">Meta Mensual</Typography>
                    <Typography variant="body2">Has alcanzado el 75% de tu objetivo de ventas este mes. ¡Sigue así!</Typography>
                </Box>
             </Box>
          </Paper>
        </Grid>

        {/* COLUMNA DERECHA: Actividad Reciente (Feed) */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Actividad Reciente</Typography>
          <Paper elevation={1} sx={{ borderRadius: 2 }}>
            <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2 }}>
              
              <ListItem>
                <ListItemAvatar>
                  <Avatar src="/broken-image.jpg" />
                </ListItemAvatar>
                <ListItemText primary="Venta #1024" secondary="Hace 5 minutos - $12.500" />
              </ListItem>
              <Divider variant="inset" component="li" />
              
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'orange' }}>S</Avatar>
                </ListItemAvatar>
                <ListItemText primary="Stock Bajo" secondary="Producto: Collar Perro L" />
              </ListItem>
              <Divider variant="inset" component="li" />

              <ListItem>
                <ListItemAvatar>
                  <Avatar src="/broken-image.jpg" />
                </ListItemAvatar>
                <ListItemText primary="Nuevo Cliente" secondary="Maria Gonzalez registrada" />
              </ListItem>

            </List>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}

export default Home;