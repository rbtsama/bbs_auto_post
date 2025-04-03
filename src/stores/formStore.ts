import { defineStore } from 'pinia';
import { PostFormData } from '@/types';

export const useFormStore = defineStore('form', {
  state: () => ({
    formData: {
      title: '',
      content: '',
      tags: ''
    } as PostFormData,
    sendOption: 'scheduled' as 'immediate' | 'scheduled',
    scheduledTime: ''
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
      this.sendOption = 'scheduled';
      this.scheduledTime = '';
    },
    setSendOption(option: 'immediate' | 'scheduled') {
      this.sendOption = option;
    },
    setScheduledTime(time: string) {
      this.scheduledTime = time;
    }
  }
}); 