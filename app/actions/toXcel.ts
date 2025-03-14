"use server"

import * as XLSX from 'xlsx';

export async function toXcel(ocrResult: string) {
    // Split the input into sections if multiple sections exist
    const sections = ocrResult.split(/```\s*\n/);
    
    // Process each section and combine the data
    const allData: string[][] = [];
    
    for (const section of sections) {
        if (!section.trim()) continue;
        
        // Split the section into rows
        const rows = section.split('\n')
            .filter(row => row.trim())  // Remove empty rows
            .map(row => row.split(',').map(cell => cell.trim()));  // Split by comma and trim cells
            
        // Add a blank row between sections if there's already data
        if (allData.length > 0 && rows.length > 0) {
            allData.push([]);  // Add empty row as separator
        }
        
        // Add the rows from this section
        allData.push(...rows);
    }

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(allData);

    // Adjust column widths
    const maxWidth = 50;
    const colWidths: { [key: string]: number } = {};
    
    // Calculate maximum width for each column
    allData.forEach(row => {
        row.forEach((cell, colIndex) => {
            const width = String(cell).length;
            const col = XLSX.utils.encode_col(colIndex);
            colWidths[col] = Math.min(Math.max(colWidths[col] || 0, width), maxWidth);
        });
    });

    // Apply column widths
    ws['!cols'] = Object.keys(colWidths).map(col => ({
        wch: colWidths[col]
    }));

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Bon de livraison");

    // Generate array buffer instead of node buffer
    const excelBuffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    
    return excelBuffer;
}

    