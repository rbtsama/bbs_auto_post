import { defineStore } from 'pinia';

export const useActiveTabStore = defineStore('activeTab', {
  state: () => ({
    activeTab: 'editor' as 'editor' | 'history'
  }),
  actions: {
    setActiveTab(tab: 'editor' | 'history') {
      this.activeTab = tab;
    }
  }
}); 