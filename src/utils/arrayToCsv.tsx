export function arrayToCsv(data: Record<string, string>[]): string {
  if (data.length === 0) return "";

  // ← This grabs the column names from the first object in your array
  const headers = Object.keys(data[0]);

  // Build each CSV row by iterating over your data…
  const lines = data.map(
    (row) =>
      // …and for each header, pull out the matching value from the row
      headers
        .map((field) => {
          const value = row[field] ?? "";
          // wrap in quotes and escape any interior quotes
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",") // join each cell with commas
  );

  // Finally, stitch your header line + all data lines together with newlines
  return [headers.join(","), ...lines].join("\n");
}
