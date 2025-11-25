import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { apiFetch } from "../api/gateway";

function formatDateTime(value) {
  if (!value) return "-";
  // Ej: "2025-11-21T10:30:00" -> "2025-11-21 10:30"
  return value.replace("T", " ").slice(0, 16);
}

export default function Reportes() {
  const [vencidos, setVencidos] = useState([]);
  const [rango, setRango] = useState({ inicio: "", fin: "" });
  const [porFecha, setPorFecha] = useState([]);
  const [error, setError] = useState("");

  // --- VENCIDOS ---
  const loadVencidos = async () => {
    setError("");
    try {
      // Listado de registros con vigencia vencida
      const data = await apiFetch("/registro/api/registros/vencidos");
      setVencidos(data);
    } catch (err) {
      setError(err.message || "Error al cargar registros vencidos");
    }
  };

  // --- POR RANGO DE FECHAS ---
  const loadPorFecha = async () => {
    if (!rango.inicio || !rango.fin) {
      setError("Debes seleccionar fecha de inicio y fin");
      return;
    }
    setError("");
    try {
      // Ruta correcta según el ms-registro: /por-fecha
      const data = await apiFetch(
        `/registro/api/registros/por-fecha?inicio=${rango.inicio}&fin=${rango.fin}`
      );
      setPorFecha(data);
    } catch (err) {
      setError(err.message || "Error al consultar por fechas");
    }
  };

  useEffect(() => {
    loadVencidos();
  }, []);

  const handleChangeRango = (e) => {
    const { name, value } = e.target;
    setRango((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Reportes
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl">
          Genera reportes específicos para facilitar la validación y el control:
          registros con vigencia vencida y equipos que ingresaron en una fecha o
          rango de fechas específico, tal como solicita el hospital.
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <span className="mt-0.5 text-base">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {/* ================== VENCIDOS ================== */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-500 text-xs">
                  !
                </span>
                Registros con vigencia vencida
              </h2>
              <p className="text-[11px] text-slate-500 mt-1">
                Equipos que han superado la permanencia máxima definida en la
                política de seguridad.
              </p>
            </div>
            <button
              onClick={loadVencidos}
              className="shrink-0 bg-sky-500 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full hover:bg-sky-400 active:bg-sky-500 transition shadow-sm"
            >
              Actualizar lista
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50/80">
                <tr className="border-b border-slate-100">
                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600">
                    ID
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600">
                    Equipo ID
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600">
                    Persona
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600">
                    Documento
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600">
                    Fecha ingreso
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600">
                    Vigente hasta
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vencidos.map((reg) => (
                  <tr
                    key={reg.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-3 py-2">{reg.id}</td>
                    <td className="px-3 py-2">{reg.equipoId ?? "-"}</td>
                    <td className="px-3 py-2">{reg.persona}</td>
                    <td className="px-3 py-2">{reg.documento}</td>
                    <td className="px-3 py-2">
                      {formatDateTime(reg.fechaHoraIngreso)}
                    </td>
                    <td className="px-3 py-2">
                      {formatDateTime(reg.validoHasta)}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600 border border-red-100">
                        {reg.estado}
                      </span>
                    </td>
                  </tr>
                ))}

                {vencidos.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center text-slate-500 py-4 text-xs"
                    >
                      No hay registros vencidos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================== POR RANGO DE FECHAS ================== */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-5">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-1">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-50 text-sky-500 text-xs">
              ⌛
            </span>
            Registros por rango de fechas
          </h2>
          <p className="text-[11px] text-slate-500 mb-4">
            Reporte de equipos que ingresaron en una fecha específica o
            intervalo de fechas, útil para investigaciones o validación de
            incidentes.
          </p>

          <form
            className="flex flex-wrap items-end gap-3 mb-4 text-xs bg-slate-50/70 border border-slate-100 rounded-xl px-3 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              loadPorFecha();
            }}
          >
            <div className="space-y-1">
              <label
                className="block text-[11px] font-semibold text-slate-700"
                htmlFor="inicio"
              >
                Inicio
              </label>
              <input
                id="inicio"
                name="inicio"
                type="date"
                className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white min-w-[140px]"
                value={rango.inicio}
                onChange={handleChangeRango}
              />
            </div>

            <div className="space-y-1">
              <label
                className="block text-[11px] font-semibold text-slate-700"
                htmlFor="fin"
              >
                Fin
              </label>
              <input
                id="fin"
                name="fin"
                type="date"
                className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white min-w-[140px]"
                value={rango.fin}
                onChange={handleChangeRango}
              />
            </div>

            <button className="inline-flex items-center justify-center bg-sky-500 text-white text-[11px] font-semibold px-4 py-1.5 rounded-full hover:bg-sky-400 active:bg-sky-500 transition shadow-sm">
              Consultar
            </button>
          </form>

          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50/80">
                <tr className="border-b border-slate-100">
                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600">
                    ID
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600">
                    Equipo ID
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600">
                    Persona
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600">
                    Documento
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600">
                    Motivo
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600">
                    Fecha ingreso
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {porFecha.map((reg) => (
                  <tr
                    key={reg.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-3 py-2">{reg.id}</td>
                    <td className="px-3 py-2">{reg.equipoId ?? "-"}</td>
                    <td className="px-3 py-2">{reg.persona}</td>
                    <td className="px-3 py-2">{reg.documento}</td>
                    <td className="px-3 py-2">{reg.motivo}</td>
                    <td className="px-3 py-2">
                      {formatDateTime(reg.fechaHoraIngreso)}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 border border-emerald-100">
                        {reg.estado}
                      </span>
                    </td>
                  </tr>
                ))}

                {porFecha.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center text-slate-500 py-4 text-xs"
                    >
                      No hay registros en este rango.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
