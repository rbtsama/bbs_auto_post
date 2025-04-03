import { defineStore } from 'pinia';
import { Vehicle, VehicleImage } from '@/types';

export const useVehicleStore = defineStore('vehicle', {
  state: () => ({
    vehicles: {
      "WA1LHAF72KD018313": {
        id: "WA1LHAF72KD018313",
        model: "2019 AUDI Q7",
        details: "45 TFSI PREMIUM PLUS SPORT UTILITY 4D",
        stockNumber: "J-1857",
        mileage: "103,413 mi",
        price: "$17,988",
        images: Array(15).fill(null).map((_, i) => {
          if (i === 2) return null; // 跳过不存在的图片
          return {
            id: i + 1,
            url: `/images/vehicle/vehicle_10183_user_photo_${i+1}.jpeg`,
            selected: false,
            order: null
          };
        }).filter(Boolean) as VehicleImage[]
      },
      "3MZBM1U79FM127617": {
        id: "3MZBM1U79FM127617",
        model: "2015 MAZDA Mazda3",
        details: "I SPORT SEDAN 4D",
        stockNumber: "J-1864",
        mileage: "118,589 mi",
        price: "$8,988",
        images: Array(4).fill(null).map((_, i) => {
          return {
            id: i + 1,
            url: `/images/vehicle/vehicle_10183_user_photo_${i+1}.jpeg`,
            selected: false,
            order: null
          };
        }) as VehicleImage[]
      },
      "5UXKT0C39H0V96466": {
        id: "5UXKT0C39H0V96466",
        model: "2017 BMW X5",
        details: "XDRIVE40E IPERFORMANCE SPORT UTILITY 4D",
        stockNumber: "J-1867",
        mileage: "81,569 mi",
        price: "$19,988",
        images: Array(6).fill(null).map((_, i) => {
          return {
            id: i + 1,
            url: `/images/vehicle/vehicle_10183_user_photo_${i+5}.jpeg`,
            selected: false,
            order: null
          };
        }) as VehicleImage[]
      }
    } as Record<string, Vehicle>,
    currentVehicleId: "WA1LHAF72KD018313"
  }),
  
  getters: {
    currentVehicle: (state) => state.vehicles[state.currentVehicleId],
    vehicleImages: (state) => [...state.vehicles[state.currentVehicleId].images],
    allVehicles: (state) => Object.values(state.vehicles),
    vehicleIds: (state) => Object.keys(state.vehicles)
  },
  
  actions: {
    setCurrentVehicle(id: string) {
      if (this.vehicles[id]) {
        this.currentVehicleId = id;
      }
    },
    
    toggleImageSelection(imageId: number) {
      const images = this.vehicles[this.currentVehicleId].images;
      const imageIndex = images.findIndex(img => img.id === imageId);
      
      if (imageIndex > -1) {
        const selectedCount = images.filter(img => img.selected).length;
        
        if (!images[imageIndex].selected) {
          // 选择图片
          if (selectedCount < 30) {
            images[imageIndex].selected = true;
            images[imageIndex].order = selectedCount + 1;
          } else {
            return false; // 最多选30张
          }
        } else {
          // 取消选择
          const removedOrder = images[imageIndex].order;
          images[imageIndex].selected = false;
          images[imageIndex].order = null;
          
          // 重新调整序号
          images.forEach(img => {
            if (img.selected && img.order && img.order > (removedOrder as number)) {
              img.order--;
            }
          });
        }
        
        return true;
      }
      
      return false;
    },
    
    resetImageSelection() {
      this.vehicles[this.currentVehicleId].images.forEach(img => {
        img.selected = false;
        img.order = null;
      });
    },
    
    getSelectedCount() {
      return this.vehicles[this.currentVehicleId].images.filter(img => img.selected).length;
    }
  }
}); 