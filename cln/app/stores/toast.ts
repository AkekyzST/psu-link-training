import { create } from 'zustand';

export type ToastSeverity = 'success' | 'info' | 'warning' | 'error';

// Define possible positions
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface ToastState {
  open: boolean;
  message: string;
  severity: ToastSeverity;
  duration: number;
  position: ToastPosition; // Add position state
  timeoutId: NodeJS.Timeout | null;
  
  // Update showToast signature
  showToast: (
    message: string,
    severity?: ToastSeverity,
    duration?: number,
    position?: ToastPosition // Add position parameter
  ) => void;
  hideToast: () => void;
  // Helper methods
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  open: false,
  message: '',
  severity: 'info',
  duration: 5000, // Default duration: 5 seconds
  position: 'bottom-right', // Default position
  timeoutId: null,
  
  showToast: (message, severity = 'info', duration = 5000, position = 'bottom-right') => {
    // Clear any existing timeout
    set(state => {
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }
      // Keep existing state but clear timeout ID before setting new one
      return { ...state, timeoutId: null }; 
    });
    
    // Create a new timeout
    const timeoutId = setTimeout(() => {
      set({ open: false, timeoutId: null });
    }, duration);
    
    // Show the toast with all details including position
    set({
      open: true,
      message,
      severity,
      duration,
      position, // Set the position
      timeoutId,
    });
  },
  
  hideToast: () => {
    set(state => {
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }
      // Only reset open and timeoutId on hide
      return { open: false, timeoutId: null }; 
    });
  },
  
  // Helper methods
  showSuccess: (message, duration = 5000) => {
    useToastStore.getState().showToast(message, 'success', duration);
  },
  
  showError: (message, duration = 5000) => {
    useToastStore.getState().showToast(message, 'error', duration);
  },
  
  showWarning: (message, duration = 5000) => {
    useToastStore.getState().showToast(message, 'warning', duration);
  },
  
  showInfo: (message, duration = 5000) => {
    useToastStore.getState().showToast(message, 'info', duration);
  },
})); 