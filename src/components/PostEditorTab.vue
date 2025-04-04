<template>
  <!-- 车辆信息展示区 - 简化版 -->
  <VehicleInfoCard 
    @update:selectedVehicleId="handleVehicleChange"
    @update:selectedUserId="handleUserChange"
  />
  
  <!-- 表单区域 -->
  <form id="post-form" class="mt-6 bg-gray-50 p-5 rounded-lg border border-gray-100" @submit.prevent>
    <!-- 帖子主题 -->
    <section class="mb-6">
      <div class="form-control w-full">
        <label class="label mb-1">
          <span class="label-text text-base font-medium">帖子主题<span class="text-red-500">*</span></span>
        </label>
        <input 
          type="text" 
          v-model="formData.title" 
          placeholder="请输入帖子主题" 
          class="border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" 
          required 
          @keydown.enter.prevent
        />
      </div>
    </section>

    <!-- 帖子内容 -->
    <section class="mb-6">
      <div class="form-control w-full">
        <label class="label mb-1">
          <span class="label-text text-base font-medium">帖子内容<span class="text-red-500">*</span></span>
        </label>
        <textarea 
          v-model="formData.content" 
          class="border border-gray-200 rounded-lg px-4 py-3 w-full h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" 
          placeholder="请输入帖子内容" 
          required
        ></textarea>
      </div>
    </section>
    
    <!-- 标签 -->
    <section class="mb-6">
      <div class="form-control w-full">
        <label class="label mb-1">
          <span class="label-text text-base font-medium">标签<span class="text-red-500">*</span></span>
        </label>
        <input 
          type="text" 
          v-model="formData.tags" 
          placeholder="请输入标签，多个标签用逗号分隔" 
          class="border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" 
          required 
          @keydown.enter.prevent
        />
      </div>
    </section>

    <!-- 图片选择 -->
    <section class="mb-8">
      <div class="mb-3 flex justify-between items-center">
        <label class="text-base font-medium">
          选择车辆图片
        </label>
        <span class="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
          已选择 {{ selectedImages.length }} 张
        </span>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <ImageSelector 
          :selectedVehicleId="selectedVehicleId"
          @update:selectedImages="handleImageSelection"
        />
      </div>
    </section>

    <!-- 发送选项和按钮 -->
    <section class="flex justify-end items-center gap-4 mt-8 pt-4 border-t border-gray-200">
      <div class="form-control">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="send-option" 
              class="w-4 h-4 text-blue-600 focus:ring-blue-500" 
              value="immediate"
              v-model="sendOption"
            />
            <span class="text-sm">立即发送</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="send-option" 
              class="w-4 h-4 text-blue-600 focus:ring-blue-500" 
              value="scheduled"
              v-model="sendOption"
            />
            <span class="text-sm">智能排期</span>
          </label>
        </div>
      </div>
      <button 
        type="button" 
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition duration-200" 
        @click="handleSendPost"
      >
        发送
      </button>
    </section>
  </form>
  
  <!-- Toast消息 -->
  <div class="fixed top-4 right-4 z-50">
    <div 
      v-for="toast in toastMessages" 
      :key="toast.id" 
      class="toast p-4 mb-2 rounded-lg shadow-lg max-w-md flex items-center border"
      :class="getToastClass(toast.type)"
    >
      <div class="toast-icon mr-3">
        <svg v-if="toast.type === 'success'" class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <svg v-else-if="toast.type === 'error'" class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        <svg v-else-if="toast.type === 'warning'" class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <svg v-else class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <div class="toast-content">{{ toast.message }}</div>
      <button 
        @click="removeToast(toast.id)" 
        class="ml-auto text-gray-500 hover:text-gray-700"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import VehicleInfoCard from './VehicleInfoCard.vue';
import ImageSelector from './ImageSelector.vue';
import { useHistoryStore } from '@/stores';

/**
 * 发帖编辑器组件
 * 提供发帖表单、图片选择和发送功能
 * @component PostEditorTab
 */
export default defineComponent({
  name: 'PostEditorTab',
  components: {
    VehicleInfoCard,
    ImageSelector
  },
  emits: ['switchTab'],
  setup(props, { emit }) {
    // historyStore用于存储发帖历史
    const historyStore = useHistoryStore();
    
    // 状态管理
    const selectedVehicleId = ref('');
    const selectedUserId = ref('');
    const selectedImages = ref<string[]>([]);
    const activeTab = ref('editor');
    
    // 表单数据
    const formData = ref({
      title: '',
      content: '',
      tags: ''
    });
    
    // 发送选项
    const sendOption = ref<'immediate' | 'scheduled'>('scheduled');
    
    // Toast消息状态
    const toastMessages = ref<Array<{id: string, message: string, type: string}>>([]);
    
    // 历史记录
    const historyRecords = ref<any[]>([]);
    
    // 车辆数据（仅用于创建历史记录）
    const vehicles = ref<Record<string, any>>({
      '5UXKR0C5XF0K59737': {
        id: '5UXKR0C5XF0K59737',
        model: '2015 BMW X5',
        details: 'XDRIVE35I SPORT UTILITY 4D',
        stockNumber: 'J-1866',
        mileage: '96,287 mi',
        price: '$15,988'
      }
    });
    
    // 用户数据
    const users = ref<Record<string, any>>({
      'user1': { id: 'user1', username: 'renhua22', phone: '747-850-9564' },
      'user2': { id: 'user2', username: 'yycclife', phone: '213-456-7890' },
      'user3': { id: 'user3', username: 'kdwong520', phone: '310-555-1234' },
      'user4': { id: 'user4', username: 'Feichi88', phone: '415-222-3333' },
      'user5': { id: 'user5', username: 'honghu2025', phone: '650-888-9999' },
      'user6': { id: 'user6', username: '天路行者368', phone: '818-777-1212' }
    });
    
    /**
     * 显示toast消息
     */
    const showToast = (message: string, type: string = 'info') => {
      const id = Date.now().toString();
      toastMessages.value.push({ id, message, type });
      
      setTimeout(() => {
        removeToast(id);
      }, 3000);
    };
    
    /**
     * 移除toast消息
     */
    const removeToast = (id: string) => {
      const index = toastMessages.value.findIndex(m => m.id === id);
      if (index > -1) {
        toastMessages.value.splice(index, 1);
      }
    };
    
    /**
     * 获取Toast消息类型对应的CSS类
     */
    const getToastClass = (type: string): string => {
      switch (type) {
        case 'success':
          return 'bg-green-50 border-green-200 text-green-800';
        case 'error':
          return 'bg-red-50 border-red-200 text-red-800';
        case 'warning':
          return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        case 'info':
        default:
          return 'bg-blue-50 border-blue-200 text-blue-800';
      }
    };
    
    /**
     * 处理车辆变更事件
     */
    const handleVehicleChange = (vehicleId: string) => {
      console.log('车辆已更改:', vehicleId);
      selectedVehicleId.value = vehicleId;
      showToast('车辆信息已更新', 'success');
    };
    
    /**
     * 处理用户变更事件
     */
    const handleUserChange = (userId: string) => {
      console.log('用户已更改:', userId);
      selectedUserId.value = userId;
      
      // 更新用户相关表单内容
      const selectedUser = users.value[userId];
      if (selectedUser?.phone) {
        formData.value.content = `联系${selectedUser.phone}`;
      }
      
      showToast(`已选择用户: ${selectedUser?.username || userId}`, 'success');
    };
    
    /**
     * 处理图片选择事件
     */
    const handleImageSelection = (images: string[]) => {
      console.log('已选择图片:', images.length, '张');
      selectedImages.value = images;
    };
    
    /**
     * 加载图片
     */
    const loadImages = () => {
      console.log('触发图片加载，车辆ID:', selectedVehicleId.value);
    };
    
    /**
     * 添加历史记录
     */
    const addHistoryRecord = (record: any) => {
      historyRecords.value.unshift(record);
    };
    
    /**
     * 重置表单
     */
    const resetForm = () => {
      formData.value = {
        title: '',
        content: '',
        tags: ''
      };
      selectedImages.value = [];
      sendOption.value = 'scheduled';
    };
    
    /**
     * 设置活动标签页
     */
    const setActiveTab = (tab: string) => {
      activeTab.value = tab;
    };
    
    /**
     * 处理发送帖子
     * 验证表单并创建新的历史记录
     */
    const handleSendPost = () => {
      // 表单验证
      if (!formData.value.title || !formData.value.content || !formData.value.tags) {
        showToast('请填写所有必填字段', 'warning');
        return;
      }
      
      if (selectedImages.value.length === 0) {
        showToast('请至少选择一张图片', 'warning');
        return;
      }
      
      // 创建历史记录
      const selectedVehicle = vehicles.value[selectedVehicleId.value] || { id: selectedVehicleId.value };
      const selectedUser = users.value[selectedUserId.value] || { username: 'unknown' };
      
      const newRecord = {
        id: Date.now().toString(),
        vehicle: selectedVehicle,
        username: selectedUser.username,
        title: formData.value.title,
        content: formData.value.content,
        postUrl: `https://example.com/post/${Date.now()}`,
        queueTime: new Date().toLocaleString(),
        executeTime: sendOption.value === 'immediate' 
          ? new Date().toLocaleString() 
          : new Date(Date.now() + 3600000).toLocaleString(),
        status: sendOption.value === 'immediate' ? 'success' : 'pending',
        images: selectedImages.value
      };
      
      // 直接添加到historyStore
      historyStore.addRecord(newRecord);
      
      // 重置状态
      resetForm();
      
      showToast('发帖成功!', 'success');
      
      // 通知父组件切换到历史标签页
      emit('switchTab', 'history');
    };
    
    // 初始化组件
    onMounted(() => {
      console.log('PostEditorTab 组件已挂载');
    });
    
    return {
      selectedVehicleId,
      selectedUserId,
      selectedImages,
      formData,
      sendOption,
      toastMessages,
      handleVehicleChange,
      handleUserChange,
      handleImageSelection,
      handleSendPost,
      loadImages,
      showToast,
      removeToast,
      getToastClass
    };
  }
});
</script>

<style scoped>
.label-text {
  font-weight: 500;
  font-size: 16px;
}

input, textarea, select {
  font-size: 16px;
}

.text-sm {
  font-size: 14px;
}

button {
  font-size: 16px;
}

.required-mark {
  color: #ff4d4f;
  margin-left: 4px;
}
</style> 