import { defineStore } from 'pinia';
import { User } from '@/types';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    selectedUserId: null as string | null
  }),
  getters: {
    selectedUser(): User | null {
      if (!this.selectedUserId) return null;
      return this.users.find(u => u.id === this.selectedUserId) || null;
    }
  },
  actions: {
    setSelectedUserId(id: string) {
      this.selectedUserId = id;
    },
    // 模拟API调用
    async fetchUsers() {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      this.users = [
        { id: 'user1', username: 'renhua22', phone: '747-850-9564' },
        { id: 'user2', username: 'yycclife', phone: '213-456-7890' },
        { id: 'user3', username: 'kdwong520', phone: '310-555-1234' },
        { id: 'user4', username: 'Feichi88', phone: '415-222-3333' },
        { id: 'user5', username: 'honghu2025', phone: '650-888-9999' },
        { id: 'user6', username: '天路行者368', phone: '818-777-1212' }
      ];
      
      if (!this.selectedUserId && this.users.length > 0) {
        this.selectedUserId = this.users[0].id;
      }
    }
  }
}); 