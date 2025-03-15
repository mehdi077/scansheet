import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, FileText } from 'lucide-react';
import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { processImage } from '@/app/actions/convert';
import { Id } from "@/convex/_generated/dataModel";
import OcrDisplay from '@/components/OcrDisplay';

export default function ImageProcessing() {
  const { user } = useUser();
  const convex = useConvex();
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const saveFile = useMutation(api.file.uploadFile);

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
  }, []);

  // Dropzone configuration
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    
    // L'upload est maintenant déplacé vers le bouton "Extraire le texte"
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
              <img
                src={preview}
                alt={`Aperçu de ${file?.name}`}
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
                  <div className="absolute inset-x-0 h-[2px] bg-blue-500/50 animate-scan-line" />
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
                ? 'Déposez l\'image ici...'
                : 'Glissez & déposez une image ici, ou cliquez pour sélectionner'}
            </p>
          </>
        )}
      </div>

      {/* Action buttons */}
      {preview && !isUploading && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            className="px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
          >
            <X size={16} />
            {"Supprimer l'image"}
          </button>

          {storageId && (
            <button
              onClick={async (e) => {
                e.stopPropagation();
                if (!storageId) return;
                setOcrResult(null);
                
                try {
                  setIsProcessing(true);
                  if (!getStorageUrl) throw new Error("URL de l'image non trouvée");
                  
                  const result = await processImage(getStorageUrl);
                  if (!result) {
                    throw new Error("Aucun résultat n'a été retourné par le traitement OCR");
                  }
                  console.log("Résultat OCR:", result);
                  setOcrResult(result as string);
                } catch (error) {
                  console.error("Erreur lors du traitement OCR:", error);
                  alert(error instanceof Error ? error.message : "Une erreur est survenue lors du traitement de l'image. Veuillez réessayer avec une image plus petite ou de meilleure qualité.");
                } finally {
                  setIsProcessing(false); 
                }
              }}
              disabled={isProcessing}
              className={`px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium ${isProcessing ? 'opacity-75 cursor-wait' : ''}`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <>
                  <FileText size={16} />
                  <span>Extraire le texte</span>
                </>
              )}
            </button>
          )}

          {file && !storageId && (
            <button
              onClick={async (e) => {
                e.stopPropagation();
                if (!file || !user) return;
                
                try {
                  setIsUploading(true);
                  setIsProcessing(true);
                  
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
                  
                  // 4. Once upload is complete, process the image with OCR
                  const storageUrl = await convex.query(api.storage.getUrl, { storageId: newStorageId });
                  if (!storageUrl) throw new Error("URL de l'image non trouvée");
                  
                  const ocrResult = await processImage(storageUrl);
                  if (!ocrResult) {
                    throw new Error("Aucun résultat n'a été retourné par le traitement OCR");
                  }
                  
                  console.log("Résultat OCR:", ocrResult);
                  setOcrResult(ocrResult as string);
                  
                } catch (error) {
                  console.error("Erreur lors du traitement:", error);
                  alert(error instanceof Error ? error.message : "Une erreur est survenue lors du traitement de l'image. Veuillez réessayer avec une image plus petite ou de meilleure qualité.");
                  handleReset();
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
                  <FileText size={16} />
                  <span>Extraire le texte</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* OCR Results */}
      {ocrResult && (
        <div className="mt-8">
          <OcrDisplay 
            ocrResult={ocrResult} 
            initialFileDocumentId={fileDocumentId || undefined} 
          />
        </div>
      )}
    </div>
  );
} 