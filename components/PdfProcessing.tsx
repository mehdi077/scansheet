import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, FileText } from 'lucide-react';
import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function PdfProcessing() {
  const { user } = useUser();
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const saveFile = useMutation(api.file.uploadFile);

  // State to store the uploaded file
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [storageId, setStorageId] = useState<Id<"_storage"> | null>(null);

  const getStorageUrl = useQuery(api.storage.getUrl, storageId ? { storageId } : "skip");

  const handleReset = useCallback(() => {
    setFile(null);
    setStorageId(null);
  }, []);

  // Dropzone configuration
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    
    if (!selectedFile || !user) return;
    
    try {
      setIsUploading(true);
      
      // 1. Get the upload URL
      const uploadUrl = await generateUploadUrl();
      
      // 2. Upload the file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });
      const { storageId } = await result.json();
      
      // 3. Save the file metadata
      await saveFile({
        userId: user.id,
        file: storageId,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
      });

      setStorageId(storageId);
      
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      // If upload fails, reset the form
      handleReset();
    } finally {
      setIsUploading(false);
    }
  }, [user, generateUploadUrl, saveFile, handleReset]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-8">
      {/* Dropzone UI */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-200 ease-in-out relative
          ${isDragActive ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-300'}
          ${isUploading ? 'opacity-50 cursor-wait' : ''}
        `}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-40 h-40 bg-neutral-50 rounded-lg shadow-sm flex items-center justify-center">
                <FileText className="w-16 h-16 text-neutral-400" />
              </div>
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                  <Loader2 size={24} className="animate-spin text-neutral-900" />
                </div>
              )}
            </div>
            <p className="text-sm text-neutral-600">
              {isUploading ? 'Téléchargement en cours...' : `Fichier sélectionné: ${file?.name}`}
            </p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-16 w-16 text-neutral-400" />
            <p className="mt-4 text-sm text-neutral-600">
              {isDragActive
                ? 'Déposez le PDF ici...'
                : 'Glissez & déposez un PDF ici, ou cliquez pour sélectionner'}
            </p>
          </>
        )}
      </div>

      {/* Action buttons */}
      {file && !isUploading && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            className="px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
          >
            <X size={16} />
            Supprimer le PDF
          </button>

          {storageId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // To be implemented later
                alert("La fonctionnalité d'extraction de texte pour les PDF sera bientôt disponible");
              }}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
            >
              <FileText size={16} />
              <span>Extraire le texte</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
} 