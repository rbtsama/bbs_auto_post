import { defineStore } from 'pinia';
import { Vehicle } from '@/types';

export const useVehicleStore = defineStore('vehicle', {
  state: () => ({
    vehicles: [] as Vehicle[],
    selectedVehicleId: null as string | null,
    images: [] as string[],
    selectedImageIds: [] as string[]
  }),
  getters: {
    selectedVehicle(): Vehicle | null {
      if (!this.selectedVehicleId) return null;
      return this.vehicles.find(v => v.id === this.selectedVehicleId) || null;
    }
  },
  actions: {
    setSelectedVehicleId(id: string) {
      this.selectedVehicleId = id;
      // 重置选中的图片
      this.selectedImageIds = [];
    },
    toggleImageSelection(imageId: string) {
      const index = this.selectedImageIds.indexOf(imageId);
      if (index > -1) {
        this.selectedImageIds.splice(index, 1);
      } else {
        this.selectedImageIds.push(imageId);
      }
      return true;
    },
    // 这里模拟从API获取数据，实际应用中应替换为真实API调用
    async fetchVehicles() {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.vehicles = [
        {
          id: '5UXKR0C5XF0K59737',
          model: '2015 BMW X5',
          details: 'XDRIVE35I SPORT UTILITY 4D',
          stockNumber: 'J-1866',
          mileage: '96,287 mi',
          price: '$15,988'
        },
        {
          id: 'ZAM57RTA6F1149408',
          model: '2015 MASERATI Ghibli',
          details: 'S Q4 SEDAN 4D',
          stockNumber: 'J-1862',
          mileage: '73,956 mi',
          price: '$14,988'
        },
        {
          id: 'WDDHF5KB6GB261473',
          model: '2016 MERCEDES-BENZ E-Class',
          details: 'E 350 SEDAN 4D',
          stockNumber: 'J-1686',
          mileage: '105,819 mi',
          price: '$13,988'
        },
        {
          id: '1FTEW1EP1JKE07430',
          model: '2018 FORD F-150',
          details: 'XLT PICKUP 4D 5 1/2 FT',
          stockNumber: 'J-1099',
          mileage: '971 mi',
          price: '$129,888'
        },
        {
          id: '5TDZA3EH8DS037305',
          model: '2013 TOYOTA Highlander',
          details: 'SPORT UTILITY 4D',
          stockNumber: 'J-1860',
          mileage: '144,518 mi',
          price: '$12,988'
        },
        {
          id: 'WA1LFAFP6CA072271',
          model: '2012 AUDI Q5',
          details: '2.0T QUATTRO PREMIUM SPORT UTILITY 4D',
          stockNumber: 'J-1855',
          mileage: '89,348 mi',
          price: '$9,988'
        },
        {
          id: '5TDZK3EH0BS043058',
          model: '2011 TOYOTA Highlander',
          details: 'SPORT UTILITY 4D',
          stockNumber: 'J-1849',
          mileage: '143,265 mi',
          price: '$11,988'
        },
        {
          id: 'KNMAT2MT4HP583428',
          model: '2017 NISSAN Rogue',
          details: 'S (2017.5) SPORT UTILITY 4D',
          stockNumber: 'J-1846',
          mileage: '118,630 mi',
          price: '$10,988'
        }
      ];
      
      if (!this.selectedVehicleId && this.vehicles.length > 0) {
        this.selectedVehicleId = this.vehicles[0].id;
      }
    },
    async fetchImages() {
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 从本地目录加载图片
        const imagePrefix = '/moke_photo';
        
        // 重置图片数组
        this.images = [];
        
        // 获取当前车辆对应的图片
        const imageMap = {
          '5UXKR0C5XF0K59737': [1, 2, 3, 4, 5], // BMW X5
          'ZAM57RTA6F1149408': [2, 3, 4, 5, 6], // Maserati Ghibli
          'WDDHF5KB6GB261473': [3, 4, 5, 6, 7], // Mercedes E-Class
          '1FTEW1EP1JKE07430': [4, 5, 6, 7, 8], // Ford F-150
          '5TDZA3EH8DS037305': [5, 6, 7, 8, 9], // Toyota Highlander 2013
          'WA1LFAFP6CA072271': [6, 7, 8, 9, 10], // Audi Q5
          '5TDZK3EH0BS043058': [7, 8, 9, 10, 11], // Toyota Highlander 2011
          'KNMAT2MT4HP583428': [8, 9, 10, 11, 12] // Nissan Rogue
        };
        
        // 获取当前车辆的图片集或使用默认图片集
        const imageIndexes = imageMap[this.selectedVehicleId as keyof typeof imageMap] || [1, 2, 3, 4, 5];
        
        // 构建图片路径数组
        this.images = imageIndexes.map(index => 
          `${imagePrefix}/vehicle_10183_user_photo_${index}.jpeg`
        );
        
        console.log(`已加载 ${this.images.length} 张图片，车辆ID: ${this.selectedVehicleId}`);
      } catch (error) {
        console.error('加载图片时出错:', error);
        this.images = []; // 出错时重置图片数组
      }
    }
  }
}); 