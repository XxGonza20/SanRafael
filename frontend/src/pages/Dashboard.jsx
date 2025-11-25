import Layout from "../components/Layout";
import { Link } from "react-router-dom";

// Iconos SVG modernos (sin dependencias)
function IconInventory() {
  return (
    <svg className="h-6 w-6 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="6" rx="1" />
      <rect x="3" y="14" width="18" height="6" rx="1" />
    </svg>
  );
}

function IconIn() {
  return (
    <svg className="h-6 w-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h9" />
      <path d="M10 7l4 5-4 5" />
      <path d="M5 5v14" />
    </svg>
  );
}

function IconOut() {
  return (
    <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 12h9" />
      <path d="M14 7l4 5-4 5" />
      <path d="M5 5v14" />
    </svg>
  );
}

function IconReport() {
  return (
    <svg className="h-6 w-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 21h10" />
      <path d="M9 17V8" />
      <path d="M13 17v-6" />
      <path d="M17 17v-4" />
      <path d="M5 3h14v4H5z" />
    </svg>
  );
}

export default function Dashboard() {
  return (
    <Layout>
      {/* TITULO */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-slate-900">
          Panel principal
        </h1>
        <p className="text-sm text-slate-600 max-w-xl">
          Gestiona el inventario, registra ingresos/egresos y consulta reportes del Hospital San Rafael.
        </p>
      </div>

      {/* TARJETAS */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {/* INVENTARIO */}
        <Link
          to="/inventario"
          className="group bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-200 p-5 flex flex-col cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl bg-sky-50 p-3 group-hover:bg-sky-100 transition">
              <IconInventory />
            </div>
            <span className="text-xs font-semibold uppercase text-sky-600 tracking-wide">
              Inventario externo
            </span>
          </div>

          <span className="text-lg font-semibold mb-1 text-slate-900">
            Equipos frecuentes y biomédicos
          </span>
          <span className="text-sm text-slate-500">
            Gestión completa de equipos externos, incluyendo QR asignado por TI.
          </span>
        </Link>

        {/* INGRESO */}
        <Link
          to="/registro/ingreso"
          className="group bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-200 p-5 flex flex-col cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl bg-green-50 p-3 group-hover:bg-green-100 transition">
              <IconIn />
            </div>
            <span className="text-xs font-semibold uppercase text-green-600 tracking-wide">
              Ingreso
            </span>
          </div>

          <span className="text-lg font-semibold mb-1 text-slate-900">
            Registro de ingreso
          </span>
          <span className="text-sm text-slate-500">
            Registra hora, responsable y motivo del ingreso de cada equipo.
          </span>
        </Link>

        {/* EGRESO */}
        <Link
          to="/registro/egreso"
          className="group bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-200 p-5 flex flex-col cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl bg-red-50 p-3 group-hover:bg-red-100 transition">
              <IconOut />
            </div>
            <span className="text-xs font-semibold uppercase text-red-600 tracking-wide">
              Egreso
            </span>
          </div>

          <span className="text-lg font-semibold mb-1 text-slate-900">
            Registro de egreso
          </span>
          <span className="text-sm text-slate-500">
            Controla que salga el mismo equipo que ingresó. Trazabilidad total.
          </span>
        </Link>

        {/* REPORTES */}
        <Link
          to="/reportes"
          className="group bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-200 p-5 flex flex-col cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl bg-purple-50 p-3 group-hover:bg-purple-100 transition">
              <IconReport />
            </div>
            <span className="text-xs font-semibold uppercase text-purple-600 tracking-wide">
              Reportes
            </span>
          </div>

          <span className="text-lg font-semibold mb-1 text-slate-900">
            Listados por fechas
          </span>
          <span className="text-sm text-slate-500">
            Consulta ingresos y egresos en fechas específicas o rangos.
          </span>
        </Link>

      </div>
    </Layout>
  );
}
