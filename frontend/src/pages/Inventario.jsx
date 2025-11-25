import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import { apiFetch } from "../api/gateway";

// --- Componente reutilizable de cámara ---
function CameraCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [camError, setCamError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCamError("Este navegador no soporta acceso a la cámara.");
          return;
        }

        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (!active) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }

        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error(err);
        setCamError("No se pudo acceder a la cámara.");
      }
    })();

    return () => {
      active = false;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTakePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `foto-equipo-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        const previewUrl = URL.createObjectURL(blob);
        onCapture(file, previewUrl);
      },
      "image/jpeg",
      0.9
    );
  };

  return (
    <div>
      {camError && (
        <div className="mb-2 text-[11px] text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
          {camError}
        </div>
      )}

      <div className="relative w-full bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full max-h-64 object-contain"
        />
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 border border-slate-300 rounded-full text-[11px] hover:bg-slate-100"
        >
          Cerrar cámara
        </button>
        <button
          type="button"
          onClick={handleTakePhoto}
          className="px-3 py-1.5 bg-emerald-500 text-white rounded-full text-[11px] hover:bg-emerald-600"
        >
          Tomar foto
        </button>
      </div>
    </div>
  );
}

// Iconos SVG (sin dependencias)
function IconInventory() {
  return (
    <svg
      className="h-5 w-5 text-sky-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="6" rx="1" />
      <rect x="3" y="14" width="18" height="6" rx="1" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Inventario() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingEquipo, setEditingEquipo] = useState(null);
  const [editForm, setEditForm] = useState({
    id: null,
    tipo: "TECNOLOGICO",
    serial: "",
    descripcion: "",
    frecuente: false,
  });

  const [editPhotoFile, setEditPhotoFile] = useState(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  const loadEquipos = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/inventario/api/equipos");
      setEquipos(data);
    } catch (err) {
      setError(err.message || "Error al cargar el inventario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipos();
  }, []);

  // limpiar URL de preview cuando cambie o se cierre
  useEffect(() => {
    return () => {
      if (previewPhotoUrl) {
        URL.revokeObjectURL(previewPhotoUrl);
      }
    };
  }, [previewPhotoUrl]);

  const fotoUrl = (id) =>
    `http://localhost:8080/inventario/api/equipos/${id}/foto`;

  const handleEditarClick = (eq) => {
    setEditingEquipo(eq);
    setEditForm({
      id: eq.id,
      tipo: eq.tipo,
      serial: eq.serial || "",
      descripcion: eq.descripcion || "",
      frecuente: !!eq.frecuente,
    });
    setEditPhotoFile(null);
    setPreviewPhotoUrl(null);
    setShowCamera(false);
  };

  const handleCerrarModal = () => {
    setEditingEquipo(null);
    setEditForm({
      id: null,
      tipo: "TECNOLOGICO",
      serial: "",
      descripcion: "",
      frecuente: false,
    });
    setEditPhotoFile(null);
    setPreviewPhotoUrl(null);
    setShowCamera(false);
  };

  const handleEditarSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.id) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await apiFetch(`/inventario/api/equipos/${editForm.id}`, {
        method: "PUT",
        body: {
          tipo: editForm.tipo,
          serial: editForm.serial,
          descripcion: editForm.descripcion,
          frecuente: editForm.frecuente,
        },
      });

      if (editPhotoFile) {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("file", editPhotoFile);

        await fetch(
          `http://localhost:8080/inventario/api/equipos/${editForm.id}/foto`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );
      }

      await loadEquipos();
      handleCerrarModal();

      setSuccess("Equipo actualizado correctamente.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Error al actualizar equipo");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (id) => setDeleteId(id);

  const confirmDelete = async () => {
    try {
      await apiFetch(`/inventario/api/equipos/${deleteId}`, {
        method: "DELETE",
      });

      setEquipos((prev) => prev.filter((e) => e.id !== deleteId));
      setSuccess("Equipo eliminado correctamente.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error eliminando equipo.");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto relative">
        {/* Título */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-9 w-9 bg-sky-50 rounded-lg flex items-center justify-center">
            <IconInventory />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            Inventario externo
          </h1>
        </div>

        {/* Alertas */}
        {error && (
          <div className="mb-4 bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
            {equipos.length} equipos registrados
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left">Foto</th>
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">Tipo</th>
                  <th className="px-3 py-2 text-left">Serial</th>
                  <th className="px-3 py-2 text-left">Descripción</th>
                  <th className="px-3 py-2 text-left">Frecuente</th>
                  <th className="px-3 py-2 text-center">Editar</th>
                  <th className="px-3 py-2 text-center">Eliminar</th>
                </tr>
              </thead>

              <tbody>
                {!loading &&
                  equipos.map((eq, i) => (
                    <tr
                      key={eq.id}
                      className={`border-t ${
                        i % 2 === 0 ? "bg-white" : "bg-slate-50"
                      } hover:bg-sky-50 transition`}
                    >
                      <td className="px-3 py-2">
                        {eq.fotoPath ? (
                          <img
                            src={fotoUrl(eq.id)}
                            className="w-16 h-16 object-cover rounded-lg border shadow-sm"
                            alt={eq.descripcion || `Equipo ${eq.id}`}
                          />
                        ) : (
                          <div className="w-16 h-16 border border-dashed rounded-lg bg-slate-50 flex items-center justify-center text-[10px] text-slate-400">
                            Sin foto
                          </div>
                        )}
                      </td>

                      <td className="px-3 py-2">{eq.id}</td>

                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                            eq.tipo === "BIOMEDICO"
                              ? "bg-violet-50 text-violet-700"
                              : "bg-sky-50 text-sky-700"
                          }`}
                        >
                          {eq.tipo}
                        </span>
                      </td>

                      <td className="px-3 py-2">{eq.serial}</td>
                      <td className="px-3 py-2">{eq.descripcion}</td>
                      <td className="px-3 py-2">
                        {eq.frecuente ? "Sí" : "No"}
                      </td>

                      <td className="text-center px-3 py-2">
                        <button
                          onClick={() => handleEditarClick(eq)}
                          className="px-3 py-1 bg-sky-50 text-sky-600 border border-sky-200 hover:bg-sky-100 rounded-full text-xs flex items-center gap-1"
                        >
                          <IconEdit />
                          Editar
                        </button>
                      </td>

                      <td className="text-center px-3 py-2">
                        <button
                          onClick={() => openDeleteModal(eq.id)}
                          className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-full text-xs flex items-center gap-1"
                        >
                          <IconTrash />
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}

                {!loading && equipos.length === 0 && (
                  <tr>
                    <td
                      className="py-6 text-center text-slate-500"
                      colSpan="8"
                    >
                      No hay equipos registrados.
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td
                      className="py-6 text-center text-slate-500"
                      colSpan="8"
                    >
                      Cargando...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---------- MODAL ELIMINAR ---------- */}
        {deleteId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold">Confirmar eliminación</h3>
                <button
                  className="text-slate-400 hover:text-slate-600"
                  onClick={() => setDeleteId(null)}
                >
                  <IconClose />
                </button>
              </div>

              <p className="text-sm text-slate-600 mb-4">
                ¿Seguro que deseas eliminar este equipo? Esta acción es
                irreversible.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded-full text-xs hover:bg-slate-100"
                >
                  Cancelar
                </button>

                <button
                  onClick={confirmDelete}
                  className="px-4 py-1.5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------- MODAL EDICIÓN ---------- */}
        {editingEquipo && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-xl max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold">
                  Editar equipo ID {editForm.id}
                </h2>

                <button
                  onClick={handleCerrarModal}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <IconClose />
                </button>
              </div>

              <form className="grid gap-4 text-sm" onSubmit={handleEditarSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Tipo</label>
                    <select
                      value={editForm.tipo}
                      onChange={(e) =>
                        setEditForm({ ...editForm, tipo: e.target.value })
                      }
                      className="mt-1 w-full border rounded-lg px-2 py-2"
                    >
                      <option value="TECNOLOGICO">Tecnológico</option>
                      <option value="BIOMEDICO">Biomédico</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold">Serial</label>
                    <input
                      value={editForm.serial}
                      onChange={(e) =>
                        setEditForm({ ...editForm, serial: e.target.value })
                      }
                      className="mt-1 w-full border rounded-lg px-2 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold">Descripción</label>
                  <input
                    value={editForm.descripcion}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        descripcion: e.target.value,
                      })
                    }
                    className="mt-1 w-full border rounded-lg px-2 py-2"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={editForm.frecuente}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        frecuente: e.target.checked,
                      })
                    }
                  />
                  Equipo frecuente (QR)
                </label>

                {/* FOTO: archivo + cámara + vista previa */}
                <div>
                  <label className="text-xs font-semibold">Foto</label>

                  {/* Selector tradicional como opción extra */}
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-xs mt-1"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setEditPhotoFile(file);

                      if (previewPhotoUrl) {
                        URL.revokeObjectURL(previewPhotoUrl);
                        setPreviewPhotoUrl(null);
                      }

                      if (file) {
                        const url = URL.createObjectURL(file);
                        setPreviewPhotoUrl(url);
                      }
                    }}
                  />

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 border border-sky-500 text-sky-600 rounded-full text-xs hover:bg-sky-50"
                      onClick={() => setShowCamera((v) => !v)}
                    >
                      {showCamera ? "Cerrar cámara" : "Usar cámara"}
                    </button>
                    <span className="text-[10px] text-slate-500">
                      Puedes elegir archivo o tomar foto con la cámara.
                    </span>
                  </div>

                  {showCamera && (
                    <div className="mt-3 border border-slate-200 rounded-lg p-2">
                      <CameraCapture
                        onCapture={(file, url) => {
                          setEditPhotoFile(file);
                          if (previewPhotoUrl) {
                            URL.revokeObjectURL(previewPhotoUrl);
                          }
                          setPreviewPhotoUrl(url);
                          setShowCamera(false);
                        }}
                        onCancel={() => setShowCamera(false)}
                      />
                    </div>
                  )}

                  <div className="mt-3 flex items-start gap-3">
                    {previewPhotoUrl && (
                      <div className="flex flex-col">
                        <span className="text-[11px] text-slate-500 mb-1">
                          Vista previa (aún sin guardar)
                        </span>
                        <img
                          src={previewPhotoUrl}
                          alt="Vista previa"
                          className="w-32 h-24 object-cover rounded-md border"
                        />
                      </div>
                    )}

                    {!previewPhotoUrl && editingEquipo?.fotoPath && (
                      <div className="flex flex-col">
                        <span className="text-[11px] text-slate-500 mb-1">
                          Foto actual
                        </span>
                        <img
                          src={fotoUrl(editingEquipo.id)}
                          alt={editingEquipo.descripcion}
                          className="w-32 h-24 object-cover rounded-md border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button
                    onClick={handleCerrarModal}
                    type="button"
                    className="px-3 py-1.5 border border-slate-300 rounded-full text-xs hover:bg-slate-100"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-1.5 bg-sky-500 text-white rounded-full text-xs hover:bg-sky-600"
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
