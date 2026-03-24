import { useRef, useState } from "react";
import {
  Header,
  HistorySection,
  ResultsSection,
  UploadSection,
} from "./components";
import { generateNotes, getDownloadUrl } from "./services";

export default function App() {
  const [view, setView] = useState("upload"); // upload | results | history
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("notes");
  const [history, setHistory] = useState([]);

  const abortRef = useRef(null);

  const handleSubmit = async () => {
    if (!file) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError("");

    try {
      const data = await generateNotes(file, controller.signal);
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
      if (err.name === "AbortError") {
        setError("Processing cancelled.");
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const handleDownload = () => {
    if (!result?.pdf) return;
    const url = getDownloadUrl(result.pdf);
    window.open(url, "_blank");
  };

  const handleCancel = () => {
    abortRef.current?.abort();
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
            handleCancel={handleCancel}
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
