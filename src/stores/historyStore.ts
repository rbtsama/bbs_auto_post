import { defineStore } from 'pinia';
import { HistoryRecord, StatusType } from '@/types';
import { useUserStore } from './userStore';

export const useHistoryStore = defineStore('history', {
  state: () => ({
    records: [] as HistoryRecord[]
  }),
  getters: {
    sortedRecords(): HistoryRecord[] {
      return [...this.records].sort((a, b) => {
        // 按照队列时间倒序排列（最新的在前面）
        return new Date(b.queueTime).getTime() - new Date(a.queueTime).getTime();
      });
    }
  },
  actions: {
    addRecord(record: HistoryRecord) {
      this.records.push(record);
    },
    
    // 取消发送帖子
    cancelPost(id: string) {
      const index = this.records.findIndex(record => record.id === id);
      if (index !== -1 && this.records[index].status === 'pending') {
        this.records[index].status = 'canceled';
      }
    },
    
    // 模拟获取历史记录
    async fetchHistory() {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 获取用户数据
      const userStore = useUserStore();
      if (userStore.users.length === 0) {
        await userStore.fetchUsers();
      }
      
      // 使用userStore中的真实用户数据
      const users = userStore.users;
      
      this.records = [
        {
          id: '1',
          vehicle: {
            id: 'WA1LHAF72KD018313',
            model: '2019 AUDI Q7 45 TFSI PREMIUM PLUS SPORT UTILITY 4D',
            details: 'SUV 2.0L Turbo',
            stockNumber: 'J-1857',
            mileage: '103,413 mi',
            price: '$17,988'
          },
          username: users[0]?.username || 'renhua22',
          title: '2019 奥迪 Q7 Premium Plus 低价出售',
          postUrl: 'https://example.com/post/1',
          queueTime: '2023-03-28 09:15:00',
          executeTime: '2023-03-28 09:15:00',
          status: 'success',
          content: '这款2019奥迪Q7车况极佳，里程仅103,413英里，价格优惠，现仅售$17,988。\n\n配置齐全，包括全景天窗、导航系统、真皮座椅、加热座椅等豪华配置。欢迎试驾！',
          images: [
            '/moke_photo/vehicle_10183_user_photo_1.jpeg',
            '/moke_photo/vehicle_10183_user_photo_2.jpeg',
            '/moke_photo/vehicle_10183_user_photo_3.jpeg'
          ]
        },
        {
          id: '2',
          vehicle: {
            id: 'JN8AZ2NC3J9232546',
            model: '2018 Nissan Armada Platinum',
            details: 'SUV 5.6L V8',
            stockNumber: 'J-2104',
            mileage: '87,251 mi',
            price: '$25,988'
          },
          username: users[1]?.username || 'yycclife',
          title: '2018 尼桑 Armada Platinum 特价优惠',
          postUrl: 'https://example.com/post/2',
          queueTime: '2023-03-29 14:30:00',
          executeTime: '2023-03-29 15:00:00',
          status: 'pending',
          content: '全新到店2018尼桑Armada Platinum，搭载强劲5.6L V8发动机，宽敞舒适的七座空间。\n\n配置包括：360度全景摄像头、自适应巡航、无钥匙进入、远程启动等。这台SUV性能强劲，适合家庭使用。',
          images: [
            '/moke_photo/vehicle_10183_user_photo_5.jpeg',
            '/moke_photo/vehicle_10183_user_photo_6.jpeg',
            '/moke_photo/vehicle_10183_user_photo_7.jpeg',
            '/moke_photo/vehicle_10183_user_photo_8.jpeg'
          ]
        },
        {
          id: '3',
          vehicle: {
            id: '5TDDZRBH8MS056184',
            model: '2021 Toyota Highlander XLE',
            details: 'SUV 3.5L V6',
            stockNumber: 'T-2135',
            mileage: '24,567 mi',
            price: '$38,995'
          },
          username: users[2]?.username || 'kdwong520',
          title: '2021 丰田 Highlander XLE 豪华7座SUV',
          postUrl: 'https://example.com/post/3',
          queueTime: '2023-03-30 10:45:00',
          executeTime: '2023-03-30 11:00:00',
          status: 'failed',
          content: '这款2021丰田Highlander XLE搭载3.5L V6发动机，配备了丰田最新的安全系统Toyota Safety Sense 2.0。\n\n特点包括：三区自动恒温空调、真皮座椅、无线充电、苹果CarPlay/安卓Auto、JBL高级音响系统等。',
          images: [
            '/moke_photo/vehicle_10183_user_photo_10.jpeg',
            '/moke_photo/vehicle_10183_user_photo_11.jpeg',
            '/moke_photo/vehicle_10183_user_photo_12.jpeg'
          ]
        },
        {
          id: '4',
          vehicle: {
            id: 'WA1LHAF72KD018313',
            model: '2019 AUDI Q7 45 TFSI PREMIUM PLUS SPORT UTILITY 4D',
            details: 'SUV 2.0L Turbo',
            stockNumber: 'J-1857',
            mileage: '103,413 mi',
            price: '$17,988'
          },
          username: users[3]?.username || 'Feichi88',
          title: '2019 奥迪 Q7 豪华SUV 特价销售',
          postUrl: 'https://example.com/post/4',
          queueTime: '2023-03-31 08:30:00',
          executeTime: '2023-03-31 09:00:00',
          status: 'canceled',
          content: '豪华SUV 2019 奥迪 Q7，搭载高效2.0L涡轮增压发动机，提供卓越的驾驶体验和燃油经济性。\n\n车况优秀，里程适中，配备高级驾驶辅助系统、四区恒温空调、Bang & Olufsen高级音响系统等。',
          images: [
            '/moke_photo/vehicle_10183_user_photo_13.jpeg',
            '/moke_photo/vehicle_10183_user_photo_14.jpeg',
            '/moke_photo/vehicle_10183_user_photo_15.jpeg'
          ]
        }
      ];
    }
  }
}); 