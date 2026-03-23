import { apiRequest } from "./api";
import { API_BASE } from "../config/config";

export async function generateNotes(file) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest("/notes", {
    method: "POST",
    body: formData,
  });
}

export function getDownloadUrl(pdfPath) {
  return `${API_BASE}/download/${encodeURIComponent(pdfPath)}`;
}
