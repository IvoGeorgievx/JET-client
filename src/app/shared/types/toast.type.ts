type ToastType = 'info' | 'success' | 'error';

export interface ToastInfo {
  text: string;
  type?: ToastType; // Changed from 'ToastType | string' to 'ToastType?'
  duration?: number;
}
