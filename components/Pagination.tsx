import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Function to generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show current page
    // For small number of pages, show all
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // For larger numbers, show a window around current page
      pages.push(1); // Always show first page
      
      if (currentPage > 3) {
        pages.push(null); // Ellipsis
      }
      
      // Pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push(null); // Ellipsis
      }
      
      pages.push(totalPages); // Always show last page
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-8 mb-4 gap-1">
      {/* Previous button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center h-10 w-10 rounded-md 
          ${currentPage === 1 
            ? 'text-neutral-400 cursor-not-allowed' 
            : 'text-neutral-700 hover:bg-neutral-100'
          }`}
        aria-label="Page précédente"
      >
        <ChevronLeft size={18} />
      </button>
      
      {/* Page numbers */}
      {getPageNumbers().map((page, index) => (
        page === null ? (
          // Ellipsis
          <span key={`ellipsis-${index}`} className="flex items-center justify-center h-10 w-10 text-neutral-500">
            ...
          </span>
        ) : (
          // Page number button
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page as number)}
            className={`flex items-center justify-center h-10 w-10 rounded-md font-medium transition-colors
              ${currentPage === page 
                ? 'bg-neutral-900 text-white' 
                : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        )
      ))}
      
      {/* Next button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className={`flex items-center justify-center h-10 w-10 rounded-md
          ${currentPage === totalPages || totalPages === 0
            ? 'text-neutral-400 cursor-not-allowed' 
            : 'text-neutral-700 hover:bg-neutral-100'
          }`}
        aria-label="Page suivante"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination; 