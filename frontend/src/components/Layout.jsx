import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Iconos simples en SVG (sin dependencias externas)
function IconHome() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11L12 3l9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

function IconInventory() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="6" rx="1" />
      <rect x="3" y="14" width="18" height="6" rx="1" />
    </svg>
  );
}

function IconIn() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h9" />
      <path d="M10 7l4 5-4 5" />
      <path d="M5 5v14" />
    </svg>
  );
}

function IconOut() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 12h9" />
      <path d="M14 7l4 5-4 5" />
      <path d="M5 5v14" />
    </svg>
  );
}

function IconReport() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 21h10" />
      <path d="M9 17V8" />
      <path d="M13 17v-6" />
      <path d="M17 17v-4" />
      <path d="M5 3h14v4H5z" />
    </svg>
  );
}

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Usuario");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const menuItems = [
    { to: "/dashboard", label: "Inicio", icon: <IconHome /> },
    { to: "/inventario", label: "Inventario externo", icon: <IconInventory /> },
    { to: "/registro/ingreso", label: "Registro de ingreso", icon: <IconIn /> },
    { to: "/registro/egreso", label: "Registro de egreso", icon: <IconOut /> },
    { to: "/reportes", label: "Reportes", icon: <IconReport /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* SIDEBAR */}
      <aside className="hidden md:flex md:w-64 bg-slate-900 text-slate-100 flex-col shadow-2xl border-r border-slate-800/40">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-800/60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
          <img
            src="/imagenes/logo.png"
            alt="Logo Hospital San Rafael"
            className="h-12 w-auto object-contain drop-shadow-md"
          />
        </div>

        {/* Menú */}
        <nav className="flex-1 px-3 py-5 space-y-1 text-sm">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "group relative flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 transition-all duration-200",
                  "hover:bg-slate-800/80 hover:text-sky-200 hover:shadow-sm",
                  "focus:outline-none focus:ring-2 focus:ring-sky-500/70",
                  isActive
                    ? "bg-slate-800 text-sky-300 border-l-4 border-sky-500 shadow-md"
                    : "text-slate-200 border-l-4 border-transparent",
                ].join(" ")
              }
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800/80 text-sky-300 group-hover:bg-sky-600/20 group-hover:text-sky-200 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-px">
                  {item.icon}
                </span>
                <span className="font-medium tracking-tight">{item.label}</span>
              </div>

              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400 group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all">
                Ver
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Footer del sidebar */}
        <div className="px-5 py-4 border-t border-slate-800/60 text-[11px] text-slate-400 bg-slate-900/50">
          <p className="font-medium text-slate-300">Proyecto PDS-006</p>
          <p>MS-Registro • MS-Inventario • MS-Seguridad</p>
        </div>
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="h-16 bg-white/90 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shadow-sm">
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest">
              Sistema para control de ingreso de equipos
            </p>
            <p className="text-sm md:text-base font-semibold text-slate-800 mt-0.5">
              Equipos tecnológicos y biomédicos externos
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-sky-100 flex items-center justify-center text-sm font-semibold text-sky-700 shadow-sm">
                {username?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[11px] text-slate-400">Sesión activa</span>
                <span className="text-sm font-semibold text-slate-800 tracking-tight">
                  {username || "Usuario"}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-xs font-medium px-4 py-1.5 rounded-full border border-slate-300 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition shadow-sm"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* CONTENIDO */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
