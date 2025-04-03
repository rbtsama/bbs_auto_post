import { defineStore } from 'pinia';
import { ToastMessage, ToastType } from '@/types';

export const useToastStore = defineStore('toast', {
  state: () => ({
    messages: [] as ToastMessage[]
  }),
  actions: {
    showToast(message: string, type: ToastType = 'info', duration: number = 3000) {
      const id = Date.now().toString();
      
      this.messages.push({
        id,
        message,
        type,
        visible: true
      });
      
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    },
    
    removeToast(id: string) {
      const index = this.messages.findIndex(m => m.id === id);
      if (index > -1) {
        this.messages.splice(index, 1);
      }
    }
  }
}); 