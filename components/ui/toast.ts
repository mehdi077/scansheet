import { toast } from "sonner";
import { ReactNode } from "react";

export const toastService = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description: description,
    });
  },
  
  error: (message: string, description?: string) => {
    toast.error(message, {
      description: description,
    });
  },
  
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description: description,
    });
  },
  
  info: (message: string, description?: string) => {
    toast.info(message, {
      description: description,
    });
  },
  
  custom: (message: string, description?: string) => {
    toast(message, {
      description: description,
    });
  },
  
  loading: (message: string, description?: string) => {
    return toast.loading(message, {
      description: description,
    });
  },
  
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: {
      successDescription?: string;
      errorDescription?: string;
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },
}; 