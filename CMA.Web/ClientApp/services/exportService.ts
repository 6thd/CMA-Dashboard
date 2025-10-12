/**
 * Converts an array of objects to a CSV string and triggers a download.
 * @param data The array of objects to convert.
 * @param filename The name of the file to be downloaded.
 */
export function exportToCsv<T extends object>(data: T[], filename: string): void {
  if (!data || data.length === 0) {
    console.warn("Export to CSV failed: No data provided.");
    return;
  }

  const headers = Object.keys(data[0]) as (keyof T)[];
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(fieldName => {
        const value = row[fieldName];
        let stringValue = (value === null || value === undefined) ? '' : String(value);
        
        // Escape quotes and handle commas within fields
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          stringValue = `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ];

  const csvString = csvRows.join('\n');
  
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
