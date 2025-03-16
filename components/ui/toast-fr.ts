import { toastService } from "./toast";

export const toast = {
  /**
   * Affiche une notification de succès
   */
  succes: (message: string, description?: string) => {
    toastService.success(message, description);
  },
  
  /**
   * Affiche une notification d'erreur
   */
  erreur: (message: string, description?: string) => {
    toastService.error(message, description);
  },
  
  /**
   * Affiche une notification d'avertissement
   */
  avertissement: (message: string, description?: string) => {
    toastService.warning(message, description);
  },
  
  /**
   * Affiche une notification d'information
   */
  info: (message: string, description?: string) => {
    toastService.info(message, description);
  },
  
  /**
   * Affiche une notification personnalisée
   */
  personnalise: (message: string, description?: string) => {
    toastService.custom(message, description);
  },
  
  /**
   * Affiche une notification de chargement
   */
  chargement: (message: string, description?: string) => {
    return toastService.loading(message, description);
  },
  
  /**
   * Affiche des notifications en fonction de l'état d'une promesse
   */
  promesse: <T>(
    promesse: Promise<T>,
    messages: {
      chargement: string;
      succes: string;
      erreur: string;
    }
  ) => {
    return toastService.promise(
      promesse,
      {
        loading: messages.chargement,
        success: messages.succes,
        error: messages.erreur,
      }
    );
  },
}; 