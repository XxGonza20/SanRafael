import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/gateway";

export default function Login() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: { username, password },
        auth: false,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* LOGO EN LA ESQUINA SUPERIOR IZQUIERDA */}
      <img
        src="/imagenes/logo.png"
        alt="Logo"
        className="absolute top-4 left-4 w-52 h-auto drop-shadow-xl"
      />

      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/10 via-slate-900 to-slate-950" />
      <div className="pointer-events-none absolute -right-20 -bottom-32 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -top-32 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative max-w-4xl w-full grid md:grid-cols-2 gap-10 items-center">

        {/* Columna izquierda */}
        <div className="hidden md:flex flex-col gap-4 text-slate-100">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            <span className="block text-xs uppercase tracking-[0.25em] text-sky-400/80 mb-2">
              Hospital San Rafael de Tunja
            </span>
            <span className="block text-sky-400">
              Control de equipos externos
            </span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Sistema para registrar, monitorear y controlar el ingreso y egreso
            de equipos tecnológicos y biomédicos externos al Hospital San Rafael
            de Tunja, garantizando trazabilidad y seguridad operativa.
          </p>

          <ul className="text-xs text-slate-300 space-y-1">
            <li>• Equipos frecuentes con código QR y registro.</li>
            <li>• Equipos no frecuentes con serial y registro fotográfico.</li>
            <li>• Reportes por fecha y rango de fechas.</li>
          </ul>

          <div className="mt-4 h-px w-20 bg-gradient-to-r from-sky-400 to-transparent" />
        </div>

        {/* Columna derecha: Formulario */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/70 p-6 md:p-8 w-full">
          <h2 className="text-2xl font-semibold mb-1 text-slate-900 text-center tracking-tight">
            Iniciar sesión
          </h2>
          <p className="text-xs text-slate-500 text-center mb-6">
            Use sus credenciales asignadas para acceder al sistema
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-sm font-medium text-slate-700 mb-1"
                htmlFor="user"
              >
                Usuario
              </label>
              <input
                id="user"
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm md:text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-slate-700 mb-1"
                htmlFor="pass"
              >
                Contraseña
              </label>
              <input
                id="pass"
                type="password"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm md:text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-sky-600 text-white font-semibold py-2.5 rounded-lg shadow-md hover:bg-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transition-transform duration-150 hover:-translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-white"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
