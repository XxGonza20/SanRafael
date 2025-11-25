import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { apiFetch } from "../api/gateway";

// Icono visual para el módulo
function IconOut() {
  return (
    <svg
      className="h-5 w-5 text-sky-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H10" />
      <path d="M15 7l4 5-4 5" />
      <path d="M5 5v14" />
    </svg>
  );
}

function RegistroEgreso() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // mapa idEquipo -> objeto Equipo
  const [equiposMap, setEquiposMap] = useState({});

  // ===== Cargar registros activos =====
  const loadActivos = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/registro/api/registros");
      const activos = data.filter((r) => r.estado === "ACTIVO");
      setRegistros(activos);
    } catch (err) {
      setError(err.message || "Error al cargar registros");
    } finally {
      setLoading(false);
    }
  };

  // ===== Cargar todos los equipos =====
  const loadEquipos = async () => {
    try {
      const data = await apiFetch("/inventario/api/equipos");
      const map = {};
      data.forEach((eq) => {
        map[eq.id] = eq; // id del equipo -> objeto Equipo
      });
      setEquiposMap(map);
    } catch (err) {
      console.error("Error al cargar equipos", err);
    }
  };

  useEffect(() => {
    loadActivos();
    loadEquipos();
  }, []);

  // ===== Registrar egreso =====
  const registrarEgreso = async (id) => {
    setMensaje("");
    setError("");
    try {
      await apiFetch(`/registro/api/registros/egreso/${id}`, {
        method: "POST",
      });
      setMensaje(`Egreso registrado para ID ${id}`);
      await loadActivos();
    } catch (err) {
      setError(err.message || "Error al registrar egreso");
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* ENCABEZADO */}
        <div className="mb-5 flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-sky-50 flex items-center justify-center">
            <IconOut />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold mb-1 text-slate-900">
              Registro de egreso
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Solo se muestran ingresos que aún no tienen egreso registrado.
            </p>
          </div>
        </div>

        {/* MENSAJES */}
        {mensaje && (
          <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {mensaje}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* TABLA */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">
              Registros activos
            </h2>
            <span className="text-[11px] text-slate-500">
              {registros.length} registro(s) pendiente(s) de egreso
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead className="bg-slate-50/60 border-b border-slate-100">
                <tr className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Equipo</th>
                  <th className="px-3 py-2">Persona</th>
                  <th className="px-3 py-2">Documento</th>
                  <th className="px-3 py-2">Motivo</th>
                  <th className="px-3 py-2">Estado</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((reg, index) => {
                  // obtenemos el equipo desde el mapa
                  const equipo = equiposMap[reg.equipoId];

                  // Texto “nombre” del equipo (igual que en RegistroIngreso)
                  let etiquetaEquipo = "-";

                  if (equipo) {
                    etiquetaEquipo = equipo.descripcion?.trim() || "-";
                  }


                  return (
                    <tr
                      key={reg.id}
                      className={`border-t border-slate-100 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                        } hover:bg-sky-50/70 transition-colors`}
                    >
                      <td className="px-3 py-2 align-top text-slate-800">
                        {reg.id}
                      </td>

                      {/* COLUMNA EQUIPO */}
                      <td className="px-3 py-2 align-top text-slate-700">
                        <div className="font-medium text-xs md:text-sm">
                          {etiquetaEquipo}
                        </div>
                      </td>

                      <td className="px-3 py-2 align-top text-slate-700">
                        {reg.persona}
                      </td>
                      <td className="px-3 py-2 align-top text-slate-600">
                        {reg.documento}
                      </td>
                      <td className="px-3 py-2 align-top text-slate-600 max-w-xs">
                        <span className="line-clamp-2">{reg.motivo}</span>
                      </td>

                      <td className="px-3 py-2 align-top">
                        {reg.egreso ? (
                          <span className="inline-flex items-center rounded-full text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[10px] font-semibold">
                            Egresado
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full text-amber-700 border border-amber-100 px-2 py-0.5 text-[10px] font-semibold">
                            En institución
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-2 align-top text-right">
                        {!reg.egreso && (
                          <button
                            onClick={() => registrarEgreso(reg.id)}
                            className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-sky-600 hover:-translate-y-0.5 transition-transform"
                          >
                            <svg
                              className="h-3 w-3"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h9" />
                              <path d="M10 7l4 5-4 5" />
                            </svg>
                            <span>Registrar egreso</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {!loading && registros.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center text-slate-500 py-4 text-xs md:text-sm"
                    >
                      No hay registros activos para egresar.
                    </td>
                  </tr>
                )}

                {loading && registros.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center text-slate-500 py-4 text-xs md:text-sm"
                    >
                      Cargando registros...
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

export default RegistroEgreso;
