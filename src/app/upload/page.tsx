"use client"; // 🟢 Required in Next.js App Router to enable useState and other client-side hooks

import PuppeteerRunner from "@/components/PuppeteerRunner";
import { arrayToCsv } from "@/utils/arrayToCsv";
import { useState } from "react"; // 🧠 We’re managing component state with React

export default function UploadPage() {
  // 🌟 Store the original parsed CSV rows
  const [data, setData] = useState<Record<string, string>[]>([]);

  // 🌟 Store the cleaned data (after running through the DOM cleaner)
  const [cleanedData, setCleanedData] = useState<Record<string, string>[]>([]);
  const [keywordsData, setKeywordsData] = useState<Record<string, string>[]>(
    []
  );

  // 🧠 This function parses the CSV text string
  const parseCsv = (text: string) => {
    // 📦 Split CSV into rows — first row is header, rest are product rows
    const [headerLine, ...lines] = text.trim().split("\n");
    const headers = headerLine.split(",");

    // 🔁 Convert each row to an object using header-value mapping
    const parsed = lines.map((line) => {
      const values = line.split(",");
      const row: Record<string, string> = {};
      headers.forEach((header, i) => {
        row[header] = values[i];
      });
      return row;
    });

    return parsed;
  };

  // 📥 Triggered when a user uploads a file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // 🧾 Grab the selected file
    if (!file) return;

    const reader = new FileReader(); // 🛠️ Native API to read file contents

    reader.onload = (event) => {
      const text = event.target?.result as string; // 📄 File content as string
      const parsed = parseCsv(text); // 🧠 Parse CSV into array of objects
      setData(parsed); // 🔄 Update state with original data
      setCleanedData([]); // 🧼 Reset cleaned data if re-uploading
    };

    reader.readAsText(file); // ⏩ Start reading the file as plain text
  };

  // 🧼 This triggers cleaning for each product's 商品説明 using the API
  const handleClean = async () => {
    const updated = await Promise.all(
      data.map(async (row) => {
        const res = await fetch("/api/clean-html", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ html: row["商品説明"] }), // 💬 Send 商品説明 to the DOM cleaner
        });
        const { cleaned } = await res.json(); // 🧹 Get the cleaned HTML back
        return { ...row, 商品説明: cleaned }; // 🆕 Return updated row with cleaned 商品説明
      })
    );
    setCleanedData(updated); // 💾 Store the cleaned results in state
  };

  const handleInjectKeywords = async () => {
    const keywords = ["SALE", "Free Shipping", "Limited Offer"];

    const updated = await Promise.all(
      cleanedData.map(async (row) => {
        const res = await fetch("/api/inject-keywords", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            html: row["商品説明"],
            keywords,
          }),
        });
        const { injected } = await res.json();
        return { ...row, 商品説明: injected };
      })
    );

    setKeywordsData(updated);
  };

  const handleDownload = () => {
    const csv = arrayToCsv(keywordsData); // ✅ yes, cleanedData is correct here
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "updated_item.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-4">Upload item.csv</h1>

      {/* 📤 File input to upload CSV */}
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="flex flex-row hover:bg-slate-200 hover:rounded-md p-2 mx-auto text-center"
      />

      {/* 🔎 Preview the original data */}
      {data.length > 0 && (
        <>
          <div className="mt-6">
            <h2 className="text-xl font-medium mb-2">Original Preview</h2>
            <table className="w-full text-sm border">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key} className="border px-2 py-1">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((cell, j) => (
                      <td key={j} className="border px-2 py-1">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✨ Button to trigger DOM cleaning */}
          <button
            onClick={handleClean}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Clean Descriptions
          </button>
        </>
      )}

      {/* ✅ Render the cleaned output if available */}
      {cleanedData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-medium mb-2">Cleaned Preview</h2>
          <table className="w-full text-sm border">
            <thead>
              <tr>
                {Object.keys(cleanedData[0]).map((key) => (
                  <th key={key} className="border px-2 py-1">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cleanedData.slice(0, 10).map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((cell, j) => (
                    <td key={j} className="border px-2 py-1">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {cleanedData.length > 0 && (
        <button
          onClick={handleInjectKeywords}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Inject SEO Keywords
        </button>
      )}
      {/* ✅ Render the keywords injected output if available */}
      {keywordsData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-medium mb-2">Cleaned Preview</h2>
          <table className="w-full text-sm border">
            <thead>
              <tr>
                {Object.keys(keywordsData[0]).map((key) => (
                  <th key={key} className="border px-2 py-1">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keywordsData.slice(0, 10).map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((cell, j) => (
                    <td key={j} className="border px-2 py-1">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {keywordsData.length > 0 && (
        <button
          onClick={handleDownload}
          className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Export CSV
        </button>
      )}
      <PuppeteerRunner />
    </div>
  );
}
