import { useUser } from '@clerk/nextjs';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStorageUrl } from '@/lib/utils';
import { Download, FileSpreadsheet } from 'lucide-react';
import { Id } from "@/convex/_generated/dataModel";
import Image from 'next/image';

// Separate component for each file row
const FileRow = ({ file }: { file: { 
  _id: Id<"file">, 
  file: Id<"_storage">, 
  fileName: string,
  _creationTime: number,
  xcel?: Id<"_storage"> 
}}) => {
  const imageUrl = useStorageUrl(file.file);
  const excelUrl = useStorageUrl(file.xcel);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const downloadExcel = async () => {
    if (!file.xcel || !excelUrl) return;
    
    try {
      const response = await fetch(excelUrl);
      const blob = await response.blob();
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = downloadUrl;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Une erreur est survenue lors du téléchargement');
    }
  };

  return (
    <div 
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 gap-4 sm:gap-0"
    >
      <div className="flex items-center space-x-4 w-full sm:w-auto">
        {/* Image preview */}
        <div className="relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={file.fileName}
              fill
              className="object-cover"
            />
          )}
        </div>
        
        {/* File name and creation time */}
        <div className="flex flex-col min-w-0">
          <span className="text-neutral-900 font-medium truncate">{file.fileName}</span>
          <span className="text-sm text-neutral-500">
            Ajouté le {formatDate(file._creationTime)}
          </span>
        </div>
      </div>

      {/* Excel file section */}
      <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
        {file.xcel && (
          <>
            <div className="flex items-center text-neutral-600">
              <FileSpreadsheet size={18} className="mr-2 flex-shrink-0" />
              <span className="text-sm font-medium hidden sm:inline">Excel généré</span>
            </div>
            <button
              onClick={downloadExcel}
              className="p-2.5 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 rounded-lg transition-colors duration-200 flex-shrink-0"
              title="Télécharger Excel"
            >
              <Download size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Main History component
function History({ limit = 5 }: { limit?: number }) {
  const { user } = useUser();
  const files = useQuery(api.file.filesByUserId, user?.id ? { userId: user.id, limit: 6 } : "skip");

  if (!files) {
    return (
      <div className="flex items-center justify-center h-64 px-4">
        <p className="text-neutral-500 text-center">Chargement de votre historique...</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm mx-4">
        <p className="text-neutral-500 text-center">Aucun fichier trouvé</p>
      </div>
    );
  }

  const displayedFiles = files.slice(0, limit + 1);
  const hasMore = files.length > limit;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header section */}
      <div className="space-y-2 mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-neutral-900">
          Historique de vos documents
        </h2>
        <p className="text-base sm:text-lg text-neutral-600">
          Retrouvez ici tous vos documents analysés et leurs fichiers Excel associés
        </p>
      </div>

      {/* File list */}
      <div className="bg-neutral-50 rounded-xl sm:rounded-2xl p-3 sm:p-6 relative">
        <div className="space-y-3">
          {displayedFiles.map((file, index) => (
            <div key={file._id} className={index === limit ? "relative" : ""}>
              <FileRow file={file} />
              {index === limit && hasMore && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-50/80 to-neutral-50 pointer-events-none" />
                  <div className="absolute -bottom-16 sm:-bottom-20 inset-x-0 flex justify-center items-center">
                    <a
                      href="/history"
                      className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                      {"Voir l'historique complet"}
                    </a>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default History;