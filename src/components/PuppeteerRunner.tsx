"use client";

import { useState } from "react";

export default function PuppeteerRunner() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runJob = async () => {
    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const res = await fetch("/api/mock-login", { method: "POST" });
      const data = await res.json();

      if (data.status === "ok") {
        setImage(data.screenshot);
      } else {
        throw new Error(data.message || "Unexpected error");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <button
        onClick={runJob}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Running…" : "Run Puppeteer Script"}
      </button>

      {error && <p className="text-red-500">❌ {error}</p>}
      {image && (
        <div>
          <p className="text-sm text-gray-500">Screenshot:</p>
          <img
            src={image}
            alt="Screenshot from Puppeteer"
            className="mt-2 border rounded shadow"
          />
        </div>
      )}
    </div>
  );
}
