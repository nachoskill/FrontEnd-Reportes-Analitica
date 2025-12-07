export interface User {
  id: string;
  correo: string;
  nombre?: string;
  apellido?: string;
  rut?: string;
  roles: string[];  // Array de roles
  permisos: string[];
  foto?: string | null;
  activo: boolean;

  // Alias para compatibilidad
  email?: string;
  name?: string;
}