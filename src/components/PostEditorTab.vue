<template>
  <!-- 车辆信息展示区 - 简化版 -->
  <VehicleInfoCard />
  
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
          v-model="formStore.formData.title" 
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
          v-model="formStore.formData.content" 
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
          v-model="formStore.formData.tags" 
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
          已选择 {{ vehicleStore.selectedImageIds.length }} 张
        </span>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <ImageSelector />
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
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useVehicleStore, useFormStore, useUserStore, useHistoryStore, useToastStore, useActiveTabStore } from '@/stores';
import VehicleInfoCard from './VehicleInfoCard.vue';
import ImageSelector from './ImageSelector.vue';

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
  setup() {
    const vehicleStore = useVehicleStore();
    const formStore = useFormStore();
    const historyStore = useHistoryStore();
    const toastStore = useToastStore();
    const activeTabStore = useActiveTabStore();
    const userStore = useUserStore();
    
    /**
     * 计算已选图片数量
     * @returns {number} 选中的图片数量
     */
    const selectedCount = computed(() => vehicleStore.selectedImageIds.length);
    
    /**
     * 发送选项计算属性
     * 提供双向绑定支持
     */
    const sendOption = computed({
      get: () => formStore.sendOption,
      set: (value: 'immediate' | 'scheduled') => formStore.setSendOption(value)
    });
    
    /**
     * 处理发送帖子
     * 验证表单并创建新的历史记录
     */
    const handleSendPost = () => {
      // 表单验证
      if (!formStore.formData.title || !formStore.formData.content || !formStore.formData.tags) {
        toastStore.showToast('请填写所有必填字段', 'warning');
        return;
      }
      
      if (vehicleStore.selectedImageIds.length === 0) {
        toastStore.showToast('请至少选择一张图片', 'warning');
        return;
      }
      
      // 创建历史记录
      const newRecord = {
        id: Date.now().toString(),
        vehicle: vehicleStore.selectedVehicle!,
        username: userStore.selectedUser?.username || 'unknown',
        title: formStore.formData.title,
        content: formStore.formData.content,
        postUrl: `https://example.com/post/${Date.now()}`,
        queueTime: new Date().toLocaleString(),
        executeTime: formStore.sendOption === 'immediate' 
          ? new Date().toLocaleString() 
          : new Date(Date.now() + 3600000).toLocaleString(),
        status: formStore.sendOption === 'immediate' ? 'success' : 'pending',
        images: vehicleStore.selectedImageIds
      };
      
      historyStore.addRecord(newRecord);
      
      // 重置状态
      formStore.resetForm();
      vehicleStore.selectedImageIds = [];
      
      toastStore.showToast('发帖成功!', 'success');
      activeTabStore.setActiveTab('history');
    };
    
    return {
      vehicleStore,
      formStore,
      userStore,
      selectedCount,
      sendOption,
      handleSendPost
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