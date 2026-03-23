import { useState } from "react";
import {
  Header,
  HistorySection,
  ResultsSection,
  UploadSection,
} from "./components";

const API_BASE = "http://localhost:8000";

export default function App() {
  const [view, setView] = useState("upload"); // upload | results | history
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("notes");
  const [history, setHistory] = useState([]);

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
      setHistory((prev) => [
        {
          id: Date.now(),
          name: file.name,
          size: file.size,
          time: Date.now(),
          data,
        },
        ...prev,
      ]);
      setView("results");
      setActiveTab("notes");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result?.pdf) return;
    const filename = result.pdf.split("/").pop();
    window.open(`${API_BASE}/download/${filename}`, "_blank");
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError("");
    setView("upload");
  };

  return (
    <>
      <div className="app">
        {/* Header */}
        <Header view={view} setView={setView} result={result} />

        {/* Upload View */}
        {view === "upload" && (
          <UploadSection
            file={file}
            setFile={setFile}
            error={error}
            setError={setError}
            loading={loading}
            handleSubmit={handleSubmit}
          />
        )}

        {/* Results View */}
        {view === "results" && result && (
          <ResultsSection
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            result={result}
            handleDownload={handleDownload}
            reset={reset}
          />
        )}

        {/* History View */}
        {view === "history" && (
          <HistorySection
            history={history}
            setResult={setResult}
            setView={setView}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    </>
  );
}
