import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "./Loadable";

/* ***Layouts**** */
const BlankLayout = Loadable(
  lazy(() => import("../layouts/blank-layout/BlankLayout"))
);
const AuthLayout = Loadable(lazy(() => import("../layouts/auth/AuthLayout")));
const MainLayout = Loadable(
  lazy(() => import("../layouts/dashboardLayout/MainLayout"))
);

/* ***End Layouts**** */
const Error = Loadable(lazy(() => import("../views/authentication/Error")));

/* ****Pages***** */
const Home = Loadable(lazy(() => import("../views/home/Home")));
const Login = Loadable(lazy(() => import("../views/authentication/Login")));
const Register = Loadable(
  lazy(() => import("../views/authentication/Register"))
);
const ResetPass = Loadable(
  lazy(() => import("../views/authentication/ResetPass"))
);

// Estas rutas coinciden con tu imagen
const Analitica = Loadable(
  lazy(() => import("../views/analitica/analitica"))
);
const ReporteVentas = Loadable(
  lazy(() => import("../views/reporte/reporte"))
);

/* ****End Pages***** */

const Router = [
  {
    path: "/error",
    element: <BlankLayout />,
    children: [{ path: "404", element: <Error /> }],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "", element: <Navigate to="/auth/login" /> },
      { path: "login", element: <Login/> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ResetPass /> },
      { path: "*", element: <Navigate to="/error/404" /> },
      { path: "404", element: <Error /> },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "analitica",
        element: <Analitica />,
      },
      {
        path: "reporte", // El nombre de tu archivo es 'reporte.tsx'
        element: <ReporteVentas />,
      },
      {
        path: "analisis", // Redirección
        element: <Navigate to="/analitica" />,
      },
      { path: "*", element: <Navigate to="/error/404" /> },
    ],
  },
];

export default Router;