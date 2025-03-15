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
      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center space-x-4">
        {/* Image preview */}
        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-neutral-100">
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
        <div className="flex flex-col">
          <span className="text-sm text-neutral-700">{file.fileName}</span>
          <span className="text-xs text-neutral-500">
            Ajouté le {formatDate(file._creationTime)}
          </span>
        </div>
      </div>

      {/* Excel file section */}
      <div className="flex items-center space-x-4">
        {file.xcel && (
          <>
            <div className="flex items-center text-neutral-500">
              <FileSpreadsheet size={16} className="mr-2" />
              <span className="text-sm">Excel généré</span>
            </div>
            <button
              onClick={downloadExcel}
              className="p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-full transition-colors duration-200"
              title="Télécharger Excel"
            >
              <Download size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Main History component
function History() {
  const { user } = useUser();
  const files = useQuery(api.file.filesByUserId, user?.id ? { userId: user.id } : "skip");

  if (!files) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral-500">Chargement de votre historique...</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral-500">Aucun fichier trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-neutral-800">
          Historique de vos documents
        </h2>
        <p className="text-sm text-neutral-600">
          Retrouvez ici tous vos documents analysés et leurs fichiers Excel associés
        </p>
      </div>

      {/* File list */}
      <div className="space-y-2">
        {files.map((file) => (
          <FileRow key={file._id} file={file} />
        ))}
      </div>
    </div>
  );
}

export default History;