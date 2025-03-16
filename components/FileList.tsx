import { useStorageUrl } from '@/lib/utils';
import { Download, FileSpreadsheet } from 'lucide-react';
import { Id } from "@/convex/_generated/dataModel";
import Image from 'next/image';

interface FileProps {
  _id: Id<"file">;
  userId: string;
  file: Id<"_storage">;
  fileName: string;
  fileType: string;
  _creationTime: number;
  xcel?: Id<"_storage">;
}

// File row component similar to the one in History.tsx
const FileRow = ({ file }: { file: FileProps }) => {
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

// Main FileList component 
interface FileListProps {
  files: FileProps[];
  isLoading: boolean;
}

const FileList = ({ files, isLoading }: FileListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 px-4">
        <p className="text-neutral-500 text-center">Chargement de votre historique...</p>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm mx-4">
        <p className="text-neutral-500 text-center">Aucun fichier trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <FileRow key={file._id} file={file} />
      ))}
    </div>
  );
};

export default FileList; 