import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, FileText, RefreshCw } from 'lucide-react';
import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { processImage } from '@/app/actions/convert';
import { Id } from "@/convex/_generated/dataModel";
import OcrDisplay from '@/components/OcrDisplay';
import Image from 'next/image';
import { toast } from "@/components/ui";

export default function ImageProcessing() {
  const { user } = useUser();
  const convex = useConvex();
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const saveFile = useMutation(api.file.uploadFile);
  const userData = useQuery(api.users.getUserById, 
    user?.id ? { userId: user.id } : "skip"
  );

  // State to store the uploaded file
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [storageId, setStorageId] = useState<Id<"_storage"> | null>(null);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileDocumentId, setFileDocumentId] = useState<Id<"file"> | null>(null);

  const getStorageUrl = useQuery(api.storage.getUrl, storageId ? { storageId } : "skip");

  const handleReset = useCallback(() => {
    setFile(null);
    setPreview(null);
    setOcrResult(null);
    setStorageId(null);
    setFileDocumentId(null);
    toast.info("Réinitialisation", "Image supprimée avec succès");
  }, []);

  // Dropzone configuration
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    
    // Check file size (10MB = 10 * 1024 * 1024 bytes)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.avertissement(
        "Fichier trop volumineux",
        "La taille du fichier doit être inférieure à 10 Mo"
      );
      return;
    }
    
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
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
        {preview ? (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <Image
                src={preview}
                alt={`Aperçu de ${file?.name}`}
                width={160}
                height={160}
                className="w-40 h-40 object-cover rounded-lg shadow-sm"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                  <Loader2 size={24} className="animate-spin text-neutral-900" />
                </div>
              )}
              {isProcessing && (
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute inset-0 w-full h-[2px] bg-blue-500/50 animate-scan-line" />
                </div>
              )}
            </div>
            <p className="text-sm text-neutral-600">
              {isUploading ? "Téléchargement en cours..." : 
               isProcessing ? "Génération Excel en cours..." :
               `${file?.name}`}
            </p>
          </div>
        ) : (
          <>  
            <Upload className="mx-auto h-16 w-16 text-neutral-400" />
            <p className="mt-4 text-sm text-neutral-600">
              {isDragActive
                ? "Déposez l'image ici..."
                : 'Glissez & déposez une image ici, ou cliquez pour sélectionner'}
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              La taille de l'image ne doit pas dépasser <span className="font-bold">10 MB</span>
            </p>
          </>
        )}
      </div>

      {/* Action buttons */}
      {preview && !isUploading && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-neutral-900">
            {storageId ? (
              <>La <span className="font-bold">régénération</span> coûtera <span className="text-red-600 font-bold">1 crédit</span> de plus</>
            ) : (
              <>Cette opération consommera <span className="text-red-600 font-bold">1 crédit</span></>
            )}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            disabled={isUploading || isProcessing}
            className={`px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium ${
              (isUploading || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <X size={16} />
            {"Supprimer l'image"}
          </button>

          <button
            onClick={async (e) => {
              e.stopPropagation();
              if (!user || (!file && !storageId)) return;
              if (userData?.credits === 0) {
                toast.avertissement("Crédits épuisés", "Vous n'avez plus de crédits. Veuillez acheter des crédits pour continuer.");
                return;
              }

              try {
                setIsProcessing(true);
                
                // If no storageId exists, we need to upload the file first
                if (!storageId && file) {
                  setIsUploading(true);
                  
                  // 1. Get the upload URL
                  const uploadUrl = await generateUploadUrl();
                  
                  // 2. Upload the file to Convex storage
                  const result = await fetch(uploadUrl, {
                    method: "POST",
                    headers: {
                      "Content-Type": file.type,
                    },
                    body: file,
                  });
                  const { storageId: newStorageId } = await result.json();
                  
                  // 3. Save the file metadata and get the document ID
                  const documentId = await saveFile({
                    userId: user.id,
                    file: newStorageId,
                    fileName: file.name,
                    fileType: file.type,
                  });

                  setStorageId(newStorageId);
                  setFileDocumentId(documentId);
                  
                  // Get the storage URL for the newly uploaded file
                  const storageUrl = await convex.query(api.storage.getUrl, { storageId: newStorageId });
                  if (!storageUrl) throw new Error("URL de l'image non trouvée");
                  
                  // Process the image
                  const ocrResult = await processImage(storageUrl);
                  if (!ocrResult) {
                    throw new Error("Aucun résultat n'a été retourné par le traitement OCR");
                  }
                  
                  setOcrResult(ocrResult as string);
                  toast.succes("Traitement terminé", "Le texte a été extrait avec succès");
                } else {
                  // If storageId exists, just regenerate OCR
                  setOcrResult(null);
                  if (!getStorageUrl) throw new Error("URL de l'image non trouvée");
                  
                  const result = await processImage(getStorageUrl);
                  if (!result) {
                    throw new Error("Aucun résultat n'a été retourné par le traitement OCR");
                  }
                  setOcrResult(result as string);
                  toast.succes("Extraction réussie", "Le texte a été extrait avec succès");
                }
              } catch (error) {
                console.error("Erreur lors du traitement:", error);
                toast.erreur("Erreur de traitement", "Une erreur est survenue lors du traitement de l'image. Veuillez réessayer avec une image de meilleure qualité.");
                if (!storageId) handleReset();
              } finally {
                setIsUploading(false);
                setIsProcessing(false);
              }
            }}
            disabled={isUploading || isProcessing}
            className={`px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium ${(isUploading || isProcessing) ? 'opacity-75 cursor-wait' : ''}`}
          >
            {isUploading || isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Traitement en cours...</span>
              </>
            ) : (
              <>
                {storageId ? (
                  <>
                    <RefreshCw size={16} />
                    <span>Régénérer</span>
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    <span>Extraire le texte</span>
                  </>
                )}
              </>
            )}
          </button>
        </div>
      )}

      {/* OCR Results */}
      {ocrResult && (
        <div className="mt-8 ">
          <OcrDisplay 
            ocrResult={ocrResult} 
            initialFileDocumentId={fileDocumentId || undefined}
            fileName={file?.name}
          />
        </div>
      )}
    </div>
  );
} 