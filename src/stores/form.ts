import { defineStore } from 'pinia';
import { PostFormData } from '@/types';
import { useToastStore } from './toast';

export const useFormStore = defineStore('form', {
  state: () => ({
    formData: {
      title: '',
      content: '',
      tags: ''
    } as PostFormData,
    sendOption: 'immediate' // 'immediate' 或 'scheduled'
  }),
  
  actions: {
    updateFormData(data: Partial<PostFormData>) {
      this.formData = { ...this.formData, ...data };
    },
    
    resetForm() {
      this.formData = {
        title: '',
        content: '',
        tags: ''
      };
    },
    
    setSendOption(option: 'immediate' | 'scheduled') {
      this.sendOption = option;
    },
    
    validateForm(): boolean {
      const toastStore = useToastStore();
      
      if (!this.formData.title.trim()) {
        toastStore.show('请填写帖子主题', 'error');
        return false;
      }
      
      if (!this.formData.content.trim()) {
        toastStore.show('请填写帖子内容', 'error');
        return false;
      }
      
      if (!this.formData.tags.trim()) {
        toastStore.show('请填写标签', 'error');
        return false;
      }
      
      return true;
    },
    
    isImmediate(): boolean {
      return this.sendOption === 'immediate';
    }
  }
}); 