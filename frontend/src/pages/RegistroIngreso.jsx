import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import { apiFetch, apiFetchMultipart } from "../api/gateway";

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

// Icono pequeño para el título
function IconIn() {
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
      <path d="M5 12h9" />
      <path d="M10 7l4 5-4 5" />
      <path d="M5 5v14" />
    </svg>
  );
}

export default function RegistroIngreso() {
  const [equipos, setEquipos] = useState([]);
  const [loadingEquipos, setLoadingEquipos] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    equipoId: "",
    tipoEquipo: "TECNOLOGICO",
    serial: "",
    descripcionEquipo: "",
    frecuente: false,
    persona: "",
    documento: "",
    motivo: "",
    vigenciaHasta: "",
    fotoEquipoFile: null,
  });

  const [previewFotoUrl, setPreviewFotoUrl] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const loadEquipos = async () => {
    setLoadingEquipos(true);
    try {
      const data = await apiFetch("/inventario/api/equipos");
      setEquipos(data);
    } catch {
      // si falla, igual se puede registrar equipo manual
    } finally {
      setLoadingEquipos(false);
    }
  };

  useEffect(() => {
    loadEquipos();
  }, []);

  // limpiar URL de preview cuando cambie o se desmonta
  useEffect(() => {
    return () => {
      if (previewFotoUrl) {
        URL.revokeObjectURL(previewFotoUrl);
      }
    };
  }, [previewFotoUrl]);

  const handleEquipoChange = (e) => {
    const value = e.target.value;

    if (!value) {
      setForm((prev) => ({
        ...prev,
        equipoId: "",
        tipoEquipo: "TECNOLOGICO",
        serial: "",
        descripcionEquipo: "",
        frecuente: false,
        fotoEquipoFile: null,
      }));
      if (previewFotoUrl) {
        URL.revokeObjectURL(previewFotoUrl);
        setPreviewFotoUrl(null);
      }
      setShowCamera(false);
      return;
    }

    const eq = equipos.find((item) => String(item.id) === value);
    if (eq) {
      setForm((prev) => ({
        ...prev,
        equipoId: value,
        tipoEquipo: eq.tipo,
        serial: eq.serial || "",
        descripcionEquipo: eq.descripcion || "",
        frecuente: eq.frecuente ?? false,
        fotoEquipoFile: null,
      }));
    } else {
      setForm((prev) => ({ ...prev, equipoId: value }));
    }

    if (previewFotoUrl) {
      URL.revokeObjectURL(previewFotoUrl);
      setPreviewFotoUrl(null);
    }
    setShowCamera(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const fileName = file.name ? file.name.toLowerCase() : "";
      const isJpgExt = fileName.endsWith(".jpg") || fileName.endsWith(".jpeg");
      const isJpgMime = file.type === "image/jpeg" || file.type === "image/jpg";

      if (!isJpgExt && !isJpgMime) {
        setError("Solo se permiten imágenes en formato JPG / JPEG.");
        e.target.value = "";
        setForm((prev) => ({ ...prev, fotoEquipoFile: null }));
        if (previewFotoUrl) {
          URL.revokeObjectURL(previewFotoUrl);
          setPreviewFotoUrl(null);
        }
        return;
      }
    }

    setError("");
    setForm((prev) => ({ ...prev, fotoEquipoFile: file || null }));

    if (previewFotoUrl) {
      URL.revokeObjectURL(previewFotoUrl);
      setPreviewFotoUrl(null);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewFotoUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      let equipoId = form.equipoId ? Number(form.equipoId) : null;

      if (!equipoId) {
        const equipoBody = {
          tipo: form.tipoEquipo,
          serial: form.serial,
          descripcion: form.descripcionEquipo,
          frecuente: false,
        };

        const created = await apiFetch("/inventario/api/equipos", {
          method: "POST",
          body: equipoBody,
        });

        equipoId = created && created.id ? created.id : created;

        if (form.fotoEquipoFile && equipoId) {
          const formData = new FormData();
          formData.append("file", form.fotoEquipoFile);

          await apiFetchMultipart(
            `/inventario/api/equipos/${equipoId}/foto`,
            formData
          );
        }
      }

      const registroBody = {
        equipoId: equipoId ? Number(equipoId) : null,
        tipoEquipo: form.tipoEquipo,
        serial: form.serial,
        descripcionEquipo: form.descripcionEquipo,
        frecuente: !!form.frecuente,
        persona: form.persona,
        documento: form.documento,
        motivo: form.motivo,
        validoHasta: form.vigenciaHasta || null,
      };

      const data = await apiFetch("/registro/api/registros/ingreso", {
        method: "POST",
        body: registroBody,
      });

      setMensaje(
        `Ingreso registrado correctamente${
          data && data.id ? ` (ID ${data.id})` : ""
        }`
      );

      // limpiar form y preview
      if (previewFotoUrl) {
        URL.revokeObjectURL(previewFotoUrl);
      }

      setForm((prev) => ({
        ...prev,
        equipoId: "",
        tipoEquipo: "TECNOLOGICO",
        serial: "",
        descripcionEquipo: "",
        frecuente: false,
        persona: "",
        documento: "",
        motivo: "",
        vigenciaHasta: "",
        fotoEquipoFile: null,
      }));
      setPreviewFotoUrl(null);
      setShowCamera(false);

      loadEquipos();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al registrar ingreso");
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* ENCABEZADO */}
        <div className="mb-5 flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-sky-50 flex items-center justify-center">
            <IconIn />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              Registro de ingreso
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Registra el ingreso de equipos tecnológicos y biomédicos externos.
              Para equipos frecuentes usa el QR (equipo ya creado en inventario);
              para equipos no frecuentes, completa los datos manualmente y
              registra la foto.
            </p>
          </div>
        </div>

        {/* MENSAJES */}
        {mensaje && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 flex items-start gap-2">
            <span>✅</span>
            <span>{mensaje}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 flex items-start gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* CARD PRINCIPAL */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-5 md:p-6">
          <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
            {/* COLUMNA 1: EQUIPO FRECUENTE / NO FRECUENTE */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Equipo frecuente (registrado en inventario)
                </label>
                <select
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={form.equipoId}
                  onChange={handleEquipoChange}
                >
                  <option value="">
                    {loadingEquipos
                      ? "Cargando equipos..."
                      : "Nuevo equipo / no frecuente"}
                  </option>
                  {equipos.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      #{eq.id} · {eq.serial} · {eq.descripcion}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                  Para equipos frecuentes, normalmente se leería el código QR y
                  se cargaría el equipo automáticamente (en este prototipo se
                  selecciona manualmente).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs md:text-sm">
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                  <span className="block text-[11px] text-slate-500">
                    Tipo de equipo
                  </span>
                  <span className="font-semibold text-slate-800">
                    {form.tipoEquipo || "-"}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    checked={form.frecuente}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        frecuente: e.target.checked,
                      }))
                    }
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Frecuente (QR)
                  </span>
                </div>

                <div className="col-span-2 bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                  <span className="block text-[11px] text-slate-500">
                    Descripción (inventario)
                  </span>
                  <span className="font-semibold text-slate-800 text-xs">
                    {form.descripcionEquipo || "-"}
                  </span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-3">
                <p className="text-[11px] font-semibold text-slate-700 mb-1">
                  Equipo no frecuente
                </p>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Si el equipo no está en inventario, diligencia tipo, serial y
                  descripción manualmente. Puedes adjuntar una foto o tomarla
                  con la cámara.
                </p>
              </div>
            </div>

            {/* COLUMNA 2: DATOS MANUALES DEL EQUIPO */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de equipo (manual)
                </label>
                <select
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={form.tipoEquipo}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, tipoEquipo: e.target.value }))
                  }
                >
                  <option value="TECNOLOGICO">Tecnológico</option>
                  <option value="BIOMEDICO">Biomédico</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Serial del equipo (manual)
                </label>
                <input
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={form.serial}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, serial: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descripción del equipo
                </label>
                <input
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={form.descripcionEquipo}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      descripcionEquipo: e.target.value,
                    }))
                  }
                />
              </div>

              {/* FOTO SOLO PARA NUEVO EQUIPO (NO FRECUENTE) */}
              {!form.equipoId && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Foto del equipo (opcional)
                  </label>

                  {/* Input de archivo tradicional */}
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="text-[11px] md:text-xs"
                    />
                  </div>

                  {/* Botón para cámara */}
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 border border-sky-500 text-sky-600 rounded-full text-xs hover:bg-sky-50"
                      onClick={() => setShowCamera((v) => !v)}
                    >
                      {showCamera ? "Cerrar cámara" : "Tomar foto con la cámara"}
                    </button>
                    <span className="text-[11px] text-slate-500">
                      Puedes subir un archivo JPG o tomar la foto directamente.
                    </span>
                  </div>

                  {showCamera && (
                    <div className="mt-2 border border-slate-200 rounded-lg p-2">
                      <CameraCapture
                        onCapture={(file, url) => {
                          setForm((prev) => ({
                            ...prev,
                            fotoEquipoFile: file,
                          }));
                          if (previewFotoUrl) {
                            URL.revokeObjectURL(previewFotoUrl);
                          }
                          setPreviewFotoUrl(url);
                          setShowCamera(false);
                          setError(""); // limpia error de formato si lo había
                        }}
                        onCancel={() => setShowCamera(false)}
                      />
                    </div>
                  )}

                  {/* Vista previa */}
                  {previewFotoUrl && (
                    <div className="mt-3">
                      <span className="block text-[11px] text-slate-500 mb-1">
                        Vista previa (se guardará en inventario al registrar)
                      </span>
                      <img
                        src={previewFotoUrl}
                        alt="Vista previa equipo"
                        className="w-32 h-24 object-cover rounded-md border"
                      />
                    </div>
                  )}

                  <p className="mt-1 text-[11px] text-slate-500">
                    Solo formato JPG / JPEG.
                  </p>
                </div>
              )}
            </div>

            {/* COLUMNA INFERIOR: PERSONA, MOTIVO, VIGENCIA */}
            <div className="md:col-span-2 mt-2 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Persona
                </label>
                <input
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={form.persona}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, persona: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Documento
                </label>
                <input
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={form.documento}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, documento: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Motivo del ingreso
                </label>
                <textarea
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  rows={3}
                  value={form.motivo}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, motivo: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vigencia hasta
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={form.vigenciaHasta}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      vigenciaHasta: e.target.value,
                    }))
                  }
                  required
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Fecha máxima en la que el equipo puede permanecer en el
                  hospital.
                </p>
              </div>

              <div className="md:col-span-2 flex justify-end mt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2 text-xs md:text-sm font-semibold text-white shadow-sm hover:bg-sky-500 hover:-translate-y-0.5 transition-transform"
                >
                  <IconIn />
                  <span>Registrar ingreso</span>
                </button>
              </div>
            </div>
          </form>

          {loadingEquipos && (
            <p className="mt-3 text-[11px] text-slate-500 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-500 animate-ping" />
              <span>Cargando lista de equipos...</span>
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
