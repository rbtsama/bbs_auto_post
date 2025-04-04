<template>
  <div class="vehicle-info-compact bg-gradient-to-r from-blue-50 to-white p-5 rounded-lg border-l-4 border border-blue-200 mb-5 w-full">
    <div class="flex flex-col md:flex-row gap-4 items-start justify-between">
      <!-- 车辆基本信息 -->
      <div class="flex-1">
        <!-- 车型与详情 -->
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-gray-800">{{ selectedVehicle?.model || '未选择车辆' }}</h2>
        </div>
        <p class="text-base text-gray-500 mt-1">
          {{ selectedVehicle?.details || '' }}
        </p>
        
        <!-- 车辆数据 -->
        <div class="mt-4 grid grid-cols-4 gap-x-4">
          <div>
            <div class="text-sm text-gray-500">VIN</div>
            <div class="text-base text-gray-800">{{ selectedVehicle?.id || 'N/A' }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">库存编号</div>
            <div class="text-base text-gray-800">{{ selectedVehicle?.stockNumber || 'N/A' }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">里程</div>
            <div class="text-base text-blue-600 font-medium">{{ selectedVehicle?.mileage || 'N/A' }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">价格</div>
            <div class="text-base text-blue-600 font-medium">{{ selectedVehicle?.price || 'N/A' }}</div>
          </div>
        </div>
      </div>
      
      <!-- 右侧选项 -->
      <div class="flex flex-row md:flex-col gap-3 shrink-0">
        <!-- VIN选择 -->
        <div>
          <label class="text-sm text-gray-500 block mb-1">
            选择VIN
          </label>
          <select 
            v-model="selectedVinValue" 
            class="border border-gray-200 rounded px-3 py-1.5 min-w-[180px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-base"
            @change="handleVinChange"
          >
            <option 
              v-for="vehicle in vehicles" 
              :key="vehicle.id" 
              :value="vehicle.id"
            >
              {{ vehicle.id }}
            </option>
          </select>
        </div>
        
        <!-- 用户名选择 -->
        <div>
          <label class="text-sm text-gray-500 block mb-1">
            发帖用户名
          </label>
          <select 
            v-model="selectedUserIdValue" 
            class="border border-gray-200 rounded px-3 py-1.5 min-w-[180px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-base"
            @change="handleUserChange"
          >
            <option 
              v-for="user in users" 
              :key="user.id" 
              :value="user.id"
            >
              {{ user.username }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue';

/**
 * 车辆信息卡片组件
 * 展示选中车辆的基本信息并提供车辆和用户选择功能
 * @component VehicleInfoCard
 */
export default defineComponent({
  name: 'VehicleInfoCard',
  emits: ['update:selectedVehicleId', 'update:selectedUserId'],
  setup(props, { emit }) {
    // 车辆数据
    const vehicles = ref([
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
    ]);

    // 用户数据
    const users = ref([
      { id: 'user1', username: 'renhua22', phone: '747-850-9564' },
      { id: 'user2', username: 'yycclife', phone: '213-456-7890' },
      { id: 'user3', username: 'kdwong520', phone: '310-555-1234' },
      { id: 'user4', username: 'Feichi88', phone: '415-222-3333' },
      { id: 'user5', username: 'honghu2025', phone: '650-888-9999' },
      { id: 'user6', username: '天路行者368', phone: '818-777-1212' }
    ]);

    // 表单数据
    const formData = ref({
      title: '',
      content: '',
      tags: ''
    });
    
    // Toast消息状态
    const toastMessages = ref<Array<{id: string, message: string, type: string}>>([]);
    
    // 选择状态
    const selectedVinValue = ref('');
    const selectedUserIdValue = ref('');
    
    // 计算属性：选中的车辆
    const selectedVehicle = computed(() => {
      return vehicles.value.find(v => v.id === selectedVinValue.value) || null;
    });
    
    // 计算属性：选中的用户
    const selectedUser = computed(() => {
      return users.value.find(u => u.id === selectedUserIdValue.value) || null;
    });
    
    /**
     * 显示toast消息
     */
    const showToast = (message: string, type: string = 'info') => {
      const id = Date.now().toString();
      toastMessages.value.push({ id, message, type });
      
      setTimeout(() => {
        const index = toastMessages.value.findIndex(m => m.id === id);
        if (index > -1) {
          toastMessages.value.splice(index, 1);
        }
      }, 3000);
    };
    
    /**
     * 初始化组件数据
     * 加载车辆和用户信息，设置当前选中项
     */
    onMounted(async () => {
      console.log('VehicleInfoCard 组件已挂载');
      
      // 模拟API延迟
      await Promise.all([
        new Promise(resolve => setTimeout(resolve, 300)),
        new Promise(resolve => setTimeout(resolve, 300))
      ]);
      
      // 设置默认选中项
      if (vehicles.value.length > 0 && !selectedVinValue.value) {
        selectedVinValue.value = vehicles.value[0].id;
      }
      
      if (users.value.length > 0 && !selectedUserIdValue.value) {
        selectedUserIdValue.value = users.value[0].id;
      }
      
      // 发送初始选中值
      console.log('初始化选择：车辆ID =', selectedVinValue.value, '用户ID =', selectedUserIdValue.value);
      emit('update:selectedVehicleId', selectedVinValue.value);
      emit('update:selectedUserId', selectedUserIdValue.value);
    });
    
    /**
     * 处理车辆VIN变更
     * 保存表单内容，更新车辆信息，加载对应图片
     */
    const handleVinChange = () => {
      console.log('VIN变更为:', selectedVinValue.value);
      emit('update:selectedVehicleId', selectedVinValue.value);
      showToast('车辆信息已更新', 'success');
    };
    
    /**
     * 处理用户变更
     * 更新用户ID并根据用户电话更新表单默认内容
     */
    const handleUserChange = () => {
      console.log('用户变更为:', selectedUserIdValue.value, selectedUser.value?.username);
      emit('update:selectedUserId', selectedUserIdValue.value);
      
      // 更新表单默认内容
      if (selectedUser.value?.phone) {
        // 确保使用正确的格式：联系XXX-XXX-XXXX
        formData.value.content = `联系${selectedUser.value.phone}`;
      }
      
      showToast('已选择用户: ' + selectedUser.value?.username, 'success');
    };
    
    /**
     * 更新表单数据
     */
    const updateFormData = (data: any) => {
      formData.value = { ...formData.value, ...data };
    };
    
    return {
      vehicles,
      users,
      selectedVinValue,
      selectedUserIdValue,
      selectedVehicle,
      selectedUser,
      formData,
      handleVinChange,
      handleUserChange,
      updateFormData
    };
  }
});
</script> 