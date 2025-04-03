import { defineStore } from 'pinia';
import { HistoryRecord, PostFormData, StatusType } from '@/types';
import { useVehicleStore } from './vehicle';
import { useUserStore } from './user';

export const useHistoryStore = defineStore('history', {
  state: () => {
    const vehicleStore = useVehicleStore();
    const userStore = useUserStore();
    
    return {
      records: [
        {
          vehicle: vehicleStore.vehicles["WA1LHAF72KD018313"],
          queueTime: "2023-04-01 14:30:00",
          executeTime: "2023-04-01 15:00:00",
          status: "success" as StatusType,
          username: userStore.users[0].username,
          title: "2019奥迪Q7豪华SUV，车况良好",
          postUrl: "https://example.com/bbs/post/12345",
          id: 1
        },
        {
          vehicle: vehicleStore.vehicles["3MZBM1U79FM127617"],
          queueTime: "2023-04-02 09:15:00",
          executeTime: "2023-04-02 10:00:00",
          status: "pending" as StatusType,
          username: userStore.users[2].username,
          title: "2015年马自达3，价格实惠",
          postUrl: "https://example.com/bbs/post/12346",
          id: 2
        },
        {
          vehicle: vehicleStore.vehicles["5UXKT0C39H0V96466"],
          queueTime: "2023-04-02 11:30:00",
          executeTime: "2023-04-02 12:15:00",
          status: "failed" as StatusType,
          username: userStore.users[4].username,
          title: "2017 宝马X5混动版，豪华配置",
          postUrl: "https://example.com/bbs/post/12347",
          id: 3
        }
      ] as HistoryRecord[],
      nextId: 4
    };
  },
  
  getters: {
    sortedRecords: (state) => {
      return [...state.records].sort((a, b) => 
        new Date(b.queueTime).getTime() - new Date(a.queueTime).getTime()
      );
    }
  },
  
  actions: {
    addRecord(formData: PostFormData, isImmediate: boolean) {
      const vehicleStore = useVehicleStore();
      const userStore = useUserStore();
      
      const now = new Date();
      const executeTime = isImmediate 
        ? now 
        : new Date(now.getTime() + 3600000); // 智能排期1小时后
      
      const newRecord: HistoryRecord = {
        vehicle: vehicleStore.currentVehicle,
        queueTime: this.formatDate(now),
        executeTime: this.formatDate(executeTime),
        status: isImmediate ? "success" : "pending",
        username: userStore.currentUser.username,
        title: formData.title,
        content: formData.content,
        postUrl: "https://example.com/bbs/post/" + Math.floor(Math.random() * 100000),
        id: this.nextId
      };
      
      this.records.unshift(newRecord);
      this.nextId++;
      
      return newRecord;
    },
    
    formatDate(date: Date): string {
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/Los_Angeles'
      }) + ' (PST)';
    },
    
    getStatusClass(status: StatusType): string {
      const statusClasses: Record<StatusType, string> = {
        'pending': 'status-pending',
        'success': 'status-success',
        'failed': 'status-failed'
      };
      return statusClasses[status] || '';
    },
    
    getStatusText(status: StatusType): string {
      const statusTexts: Record<StatusType, string> = {
        'pending': '待发送',
        'success': '成功',
        'failed': '失败'
      };
      return statusTexts[status] || status;
    }
  }
}); 