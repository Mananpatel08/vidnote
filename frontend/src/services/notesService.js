import { apiRequest } from "./api";
import { API_BASE } from "../config/config";
import { Signal } from "lucide-react";

export async function generateNotes(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest("/notes", {
    method: "POST",
    signal: onProgress,
    body: formData,
  });
}

export function getDownloadUrl(pdfPath) {
  return `${API_BASE}/download/${encodeURIComponent(pdfPath)}`;
}
