// gateway.js - funciones para llamadas al API
const API_URL = "http://localhost:8080";

/**
 * apiFetch
 * - endpoint: string, ej. "/inventario/api/equipos"
 * - options:
 *     method: GET | POST | PUT | DELETE (por defecto GET)
 *     body: objeto JS (se convierte a JSON)
 *     auth: si true agrega el JWT de localStorage
 */
export async function apiFetch(
  endpoint,
  { method = "GET", body, auth = true } = {}
) {
  const headers = {
    "Content-Type": "application/json",
  };

  // Añadir token JWT si la ruta es protegida
  if (auth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const config = {
    method,
    headers,
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, config);

  if (!res.ok) {
    let message = `Error ${res.status}`;

    try {
      const errorData = await res.json();
      if (errorData && errorData.message) {
        message = errorData.message;
      }
    } catch (_) {
      // no había JSON, dejamos el mensaje por defecto
    }

    throw new Error(message);
  }

  // Si la respuesta es 200 pero sin JSON, devolvemos {}
  try {
    return await res.json();
  } catch (_) {
    return {};
  }
}

/**
 * apiFetchMultipart
 * - endpoint: string
 * - formData: instancia de FormData
 * - auth: boolean (por defecto true)
 *
 * Nota: No setea Content-Type (fetch lo hace automáticamente para multipart/form-data).
 */
export async function apiFetchMultipart(endpoint, formData, auth = true) {
  const headers = {};
  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    body: formData,
    headers,
  });

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData && errorData.message) message = errorData.message;
    } catch (_) {}
    throw new Error(message);
  }

  try {
    return await res.json();
  } catch (_) {
    return {};
  }
}
