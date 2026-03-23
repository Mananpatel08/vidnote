import { useState } from "react";
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

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      const data = await generateNotes(file);
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
    const url = getDownloadUrl(result.pdf);
    window.open(url, "_blank");
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
