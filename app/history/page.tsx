'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import FileList from '@/components/FileList';
import Pagination from '@/components/Pagination';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 20;

export default function HistoryPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  
  // Reset to page 1 when user changes
  useEffect(() => {
    setCurrentPage(1);
  }, [user?.id]);

  // Query for total count - called only once
  const totalCountResult = useQuery(
    api.file.getTotalFilesCount,
    user?.id ? { userId: user.id } : "skip"
  );

  // Calculate total pages
  const totalPages = totalCountResult?.totalCount 
    ? Math.ceil(totalCountResult.totalCount / PAGE_SIZE) 
    : 0;

  // Calculate start and end indices for current page
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  // Query for the files in the current page range
  const filesInRange = useQuery(
    api.file.getFilesByRange,
    user?.id && totalCountResult
      ? {
          userId: user.id,
          startIndex,
          endIndex
        }
      : "skip"
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state when user or files are loading
  const isLoading = !isUserLoaded || (!totalCountResult && user?.id !== undefined) || (!filesInRange && user?.id !== undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <Button
        variant="ghost"
        size="icon"
        className="mb-6 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-neutral-900 transition-colors"
        onClick={() => router.push('./')}
        aria-label="Retour à la page précédente"
      >
        <ChevronLeft className="h-7 w-7" />
      </Button>

      {/* Header section */}
      <div className="space-y-3 mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-neutral-900">
          Historique de vos documents
        </h1>
        <p className="text-base sm:text-lg text-neutral-600">
          Retrouvez ici tous vos documents analysés et leurs fichiers Excel associés
        </p>
      </div>

      {/* Total count section */}
      {totalCountResult?.totalCount !== undefined && (
        <div className="mb-6">
          <p className="text-lg text-neutral-800">
            Vous avez un total de {totalCountResult.totalCount} documents.
          </p>
        </div>
      )}
      
      {/* Files section */}
      <div className="bg-neutral-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        {/* File list */}
        <FileList 
          files={filesInRange || []} 
          isLoading={Boolean(isLoading)} 
        />

        {/* Only show pagination if we have files and more than one page */}
        {totalPages > 0 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}