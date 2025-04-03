<template>
  <div class="vehicle-info-compact bg-gradient-to-r from-blue-50 to-white p-5 rounded-lg border-l-4 border border-blue-200 mb-5 w-full">
    <div class="flex flex-col md:flex-row gap-4 items-start justify-between">
      <!-- 车辆基本信息 -->
      <div class="flex-1">
        <!-- 车型与详情 -->
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-gray-800">{{ vehicleStore.selectedVehicle?.model || '未选择车辆' }}</h2>
        </div>
        <p class="text-base text-gray-500 mt-1">
          {{ vehicleStore.selectedVehicle?.details || '' }}
        </p>
        
        <!-- 车辆数据 -->
        <div class="mt-4 grid grid-cols-4 gap-x-4">
          <div>
            <div class="text-sm text-gray-500">VIN</div>
            <div class="text-base text-gray-800">{{ vehicleStore.selectedVehicle?.id || 'N/A' }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">库存编号</div>
            <div class="text-base text-gray-800">{{ vehicleStore.selectedVehicle?.stockNumber || 'N/A' }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">里程</div>
            <div class="text-base text-blue-600 font-medium">{{ vehicleStore.selectedVehicle?.mileage || 'N/A' }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">价格</div>
            <div class="text-base text-blue-600 font-medium">{{ vehicleStore.selectedVehicle?.price || 'N/A' }}</div>
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
            v-model="selectedVin" 
            class="border border-gray-200 rounded px-3 py-1.5 min-w-[180px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-base"
            @change="handleVinChange"
          >
            <option 
              v-for="vehicle in vehicleStore.vehicles" 
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
            v-model="selectedUserId" 
            class="border border-gray-200 rounded px-3 py-1.5 min-w-[180px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-base"
            @change="handleUserChange"
          >
            <option 
              v-for="user in userStore.users" 
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
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useVehicleStore, useUserStore, useToastStore, useFormStore } from '@/stores';

/**
 * 车辆信息卡片组件
 * 展示选中车辆的基本信息并提供车辆和用户选择功能
 * @component VehicleInfoCard
 */
export default defineComponent({
  name: 'VehicleInfoCard',
  setup() {
    const vehicleStore = useVehicleStore();
    const userStore = useUserStore();
    const toastStore = useToastStore();
    const formStore = useFormStore();
    
    const selectedVin = ref('');
    const selectedUserId = ref('');
    
    /**
     * 初始化组件数据
     * 加载车辆和用户信息，设置当前选中项
     */
    onMounted(async () => {
      await Promise.all([
        vehicleStore.fetchVehicles(),
        userStore.fetchUsers()
      ]);
      
      selectedVin.value = vehicleStore.selectedVehicleId || '';
      selectedUserId.value = userStore.selectedUserId || '';
    });
    
    /**
     * 处理车辆VIN变更
     * 保存表单内容，更新车辆信息，加载对应图片
     */
    const handleVinChange = () => {
      const formData = { ...formStore.formData };
      vehicleStore.setSelectedVehicleId(selectedVin.value);
      formStore.updateFormData(formData);
      vehicleStore.fetchImages();
      toastStore.showToast('车辆信息已更新', 'success');
    };
    
    /**
     * 处理用户变更
     * 更新用户ID并根据用户电话更新表单默认内容
     */
    const handleUserChange = () => {
      userStore.setSelectedUserId(selectedUserId.value);
      
      if (userStore.selectedUser?.phone) {
        formStore.updateFormData({
          content: `联系${userStore.selectedUser.phone}`
        });
      }
      
      toastStore.showToast('已选择用户: ' + userStore.selectedUser?.username, 'success');
    };
    
    /**
     * 监听车辆和用户状态变化，同步UI
     */
    watch(() => vehicleStore.selectedVehicleId, (newVal) => {
      if (newVal) selectedVin.value = newVal;
    });
    
    watch(() => userStore.selectedUserId, (newVal) => {
      if (newVal) selectedUserId.value = newVal;
    });
    
    return {
      vehicleStore,
      userStore,
      selectedVin,
      selectedUserId,
      handleVinChange,
      handleUserChange
    };
  }
});
</script> 