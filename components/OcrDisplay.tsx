'use client';

import { toXcel } from '@/app/actions/toXcel';
import { Download } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from '@clerk/nextjs';
import * as XLSX from 'xlsx';
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/components/ui";


const OcrDisplay = ({ 
  ocrResult, 
  initialFileDocumentId,
  fileName
}: { 
  ocrResult: string, 
  initialFileDocumentId?: Id<"file">,
  fileName?: string
}) => {
  const { user } = useUser();
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const uploadXcel = useMutation(api.file.updateFileWithXcel);
  const processingRef = useRef<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [excelFile, setExcelFile] = useState<{ blob: Blob; filename: string; data: string[][] } | null>(null);

  // Reset excel file when ocrResult changes
  useEffect(() => {
    setExcelFile(null);
  }, [ocrResult]);

  useEffect(() => {
    const processOcrResult = async () => {
      // Check if we're already processing this OCR result
      if (!ocrResult || !user || processingRef.current === ocrResult) return;
      
      // Mark this OCR result as being processed
      processingRef.current = ocrResult;
      setIsProcessing(true);

      try {
        console.log('Starting Excel generation with OCR result length:', ocrResult.length);
        const excelBuffer = await toXcel(ocrResult);
        console.log('Received Excel buffer:', excelBuffer);
        
        if (!excelBuffer) {
          throw new Error('Aucune donnée reçue du serveur');
        }

        // Create a Blob directly from the buffer
        const blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        console.log('Created blob, size:', blob.size);

        // Read the Excel file to get the data
        const workbook = XLSX.read(excelBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData: string[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Extract filename from first line of OCR result
        const firstLine = ocrResult.split('\n')[0].trim();
        const baseFileName = fileName ? 
          fileName.replace(/\.[^/.]+$/, '') : // Remove file extension if present
          firstLine
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        
        const filename = baseFileName ? `${baseFileName}.xlsx` : `document.xlsx`;
        
        let storageId: Id<"_storage"> | undefined;

        // Only upload if no initial storage ID was provided
        if (!storageId) {
          // Upload Excel file to Convex storage
          const uploadUrl = await generateUploadUrl();
          const uploadResult = await fetch(uploadUrl, {
            method: "POST",
            headers: {
              "Content-Type": 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            body: blob,
          });
          const uploadResponse = await uploadResult.json();
          storageId = uploadResponse.storageId;
        }

        // Save Excel file metadata if storage ID and document ID exist
        if (storageId && initialFileDocumentId) {
          await uploadXcel({
            fileDocumentId: initialFileDocumentId,
            xcelStorageId: storageId,
            fileName: filename,
          });
        }

        // Store the blob, filename, and parsed data
        setExcelFile({ blob, filename, data: excelData });
        
        // Show success toast when Excel is ready
        toast.succes("Extraction terminée", "L'extraction vers Excel est terminée. Le fichier est prêt à être téléchargé");
      } catch (error: unknown) {
        console.error("Erreur détaillée lors de la génération du fichier Excel:", error);
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        alert(`Une erreur est survenue lors du traitement: ${errorMessage}. Veuillez réessayer.`);
        // Reset processing ref on error so user can try again
        processingRef.current = null;
      } finally {
        setIsProcessing(false);
      }
    };

    if (ocrResult) {
      processOcrResult();
    }
  }, [ocrResult, user, initialFileDocumentId]); // Remove mutation dependencies

  const downloadExcel = () => {
    if (!excelFile) {
      alert('Aucun fichier Excel disponible');
      return;
    }

    try {
      const { blob, filename } = excelFile;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log('Download cleanup completed');
      }, 1000);
    } catch (downloadError) {
      console.error('Erreur lors du téléchargement:', downloadError);
      alert('Une erreur est survenue lors du téléchargement');
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium text-neutral-900">{"Résultat de l'extraction"}</h2>
        <button
          onClick={downloadExcel}
          disabled={!excelFile || isProcessing}
          className={`inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
            !excelFile || isProcessing 
            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
            : 'bg-neutral-900 hover:bg-neutral-800 text-white'
          }`}
        >
          <Download className="h-4 w-4 mr-2" />
          {isProcessing ? 'Traitement...' : excelFile ? 'Télécharger Excel' : 'En attente'}
        </button>
      </div>
      
      {excelFile && (
        <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                {excelFile.data[0]?.map((header, index) => (
                  <th key={index} className="px-4 py-2 border">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelFile.data.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex} className="bg-white border-b hover:bg-gray-50">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-2 border">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OcrDisplay;