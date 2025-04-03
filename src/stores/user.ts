import { defineStore } from 'pinia';
import { UserAccount } from '@/types';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [
      { id: 10025, username: "renhua22", email: "renhua22@gmail.com" },
      { id: 10026, username: "yycclife", email: "yycclife@outlook.com" },
      { id: 10027, username: "kdwong520", email: "kdwong520@ucla.edu" },
      { id: 10028, username: "Feichi88", email: "feichi88@gmail.com" },
      { id: 10029, username: "honghu2025", email: "honghu2025@gmail.com" },
      { id: 10030, username: "天路行者368", email: "skyliner68@gmail.com" },
      { id: 10031, username: "mia3587", email: "mia3587@gmail.com" },
      { id: 10032, username: "Chen427", email: "chen.mark427@gmail.com" },
      { id: 10033, username: "快乐星球5", email: "happystar567@163.com" },
      { id: 10034, username: "LilyWang823", email: "lilyw823@gmail.com" }
    ] as UserAccount[],
    currentUserId: 10025
  }),
  
  getters: {
    currentUser: (state): UserAccount => {
      return state.users.find(user => user.id === state.currentUserId) || state.users[0];
    },
    allUsers: (state): UserAccount[] => state.users
  },
  
  actions: {
    setCurrentUser(id: number) {
      const userExists = this.users.some(user => user.id === id);
      if (userExists) {
        this.currentUserId = id;
      }
    }
  }
}); 