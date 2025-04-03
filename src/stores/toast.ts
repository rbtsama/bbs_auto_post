import { defineStore } from 'pinia';
import { ToastMessage, ToastType } from '@/types';

export const useToastStore = defineStore('toast', {
  state: () => ({
    messages: [] as ToastMessage[],
    nextId: 1
  }),
  
  actions: {
    show(message: string, type: ToastType = 'error') {
      const toast: ToastMessage = {
        id: this.nextId,
        message,
        type
      };
      
      this.messages.push(toast);
      this.nextId++;
      
      // 3秒后自动移除
      setTimeout(() => {
        this.remove(toast.id);
      }, 3000);
      
      return toast.id;
    },
    
    remove(id: number) {
      const index = this.messages.findIndex(toast => toast.id === id);
      if (index !== -1) {
        this.messages.splice(index, 1);
      }
    },
    
    getIcon(type: ToastType): string {
      switch (type) {
        case 'error':
          return '⚠️';
        case 'success':
          return '✅';
        case 'warning':
          return '⚠️';
        case 'info':
        default:
          return 'ℹ️';
      }
    }
  }
}); 