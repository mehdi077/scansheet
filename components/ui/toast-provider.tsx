"use client";

import { Toaster as SonnerToaster } from "sonner";

export function ToastProvider() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className: "group",
        duration: 5000,
        classNames: {
          toast:
            "group border-2 rounded-lg p-4 shadow-md bg-white dark:bg-gray-900 dark:border-gray-800",
          title: "text-sm font-medium dark:text-gray-50",
          description: "text-xs text-gray-500 dark:text-gray-400",
          success:
            "border-green-500 dark:border-green-600",
          error:
            "border-red-500 dark:border-red-600",
          warning:
            "border-yellow-500 dark:border-yellow-600",
          info:
            "border-blue-500 dark:border-blue-600",
        }
      }}
    />
  );
} 