'use client';

import { toXcel } from '@/app/actions/toXcel';
import { Download } from 'lucide-react';
import { useState } from 'react';

// Type declaration for IE/Edge specific features
interface INavigator extends Navigator {
  msSaveOrOpenBlob?: (blob: Blob, defaultName?: string) => boolean;
}

const OcrDisplay = ({ ocrResult }: { ocrResult: string }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadExcel = async () => {
    if (!ocrResult) {
      alert('Aucun résultat à télécharger');
      return;
    }

    setIsDownloading(true);
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

      // Get current date for filename
      const date = new Date().toISOString().split('T')[0];
      const filename = `bon-de-livraison-${date}.xlsx`;
      
      try {
        // Try the download attribute approach first
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
        }, 1000); // Increased timeout to ensure download starts
      } catch (downloadError) {
        console.error('Error with primary download method, trying fallback:', downloadError);
        
        // Fallback method using navigator.msSaveBlob for IE/Edge or direct blob URL
        const nav = window.navigator as INavigator;
        if (nav.msSaveOrOpenBlob) {
          nav.msSaveOrOpenBlob(blob, filename);
        } else {
          // Final fallback - open in new tab
          const blobUrl = window.URL.createObjectURL(blob);
          window.open(blobUrl, '_blank');
          setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
        }
      }

    } catch (error: unknown) {
      console.error("Erreur détaillée lors de la génération du fichier Excel:", error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`Une erreur est survenue lors du téléchargement: ${errorMessage}. Veuillez réessayer.`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900">Résultat de l'extraction</h2>
        <button
          onClick={downloadExcel}
          disabled={isDownloading}
          className={`inline-flex items-center px-4 py-2 ${
            isDownloading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded-lg transition-colors duration-200`}
        >
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? 'Téléchargement...' : 'Télécharger Excel'}
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="whitespace-pre-wrap">{ocrResult}</div>
      </div>
    </div>
  );
};

export default OcrDisplay;