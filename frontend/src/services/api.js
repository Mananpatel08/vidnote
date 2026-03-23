import { API_BASE } from "../config/config";

export async function apiRequest(url, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${url}`, options);

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}