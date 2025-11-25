import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventario from "./pages/Inventario";
import RegistroIngreso from "./pages/RegistroIngreso";
import RegistroEgreso from "./pages/RegistroEgreso";
import Reportes from "./pages/Reportes";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección inicial */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login público */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas por JWT */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventario"
          element={
            <ProtectedRoute>
              <Inventario />
            </ProtectedRoute>
          }
        />

        <Route
          path="/registro/ingreso"
          element={
            <ProtectedRoute>
              <RegistroIngreso />
            </ProtectedRoute>
          }
        />

        <Route
          path="/registro/egreso"
          element={
            <ProtectedRoute>
              <RegistroEgreso />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <Reportes />
            </ProtectedRoute>
          }
        />

        {/* Cualquier otra ruta */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
