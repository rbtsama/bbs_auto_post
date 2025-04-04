<template>
  <TabNavigation class="max-w-7xl mx-auto" :activeTab="activeTab" @change="activeTab = $event" />
  
  <div class="bg-white shadow-md rounded-lg p-4 max-w-7xl mx-auto mb-6">
    <PostEditorTab v-if="activeTab === 'editor'" @switchTab="activeTab = $event" />
    <HistoryTab v-else-if="activeTab === 'history'" />
  </div>
  
  <ToastContainer :messages="toastMessages" @remove="removeToast" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import TabNavigation from '@/components/TabNavigation.vue';
import PostEditorTab from '@/components/PostEditorTab.vue';
import HistoryTab from '@/components/HistoryTab.vue';
import ToastContainer from '@/components/ToastContainer.vue';

/**
 * 主页组件
 * 负责加载应用所需数据和管理标签页显示
 * @component Home
 */
export default defineComponent({
  name: 'Home',
  components: {
    TabNavigation,
    PostEditorTab,
    HistoryTab,
    ToastContainer
  },
  setup() {
    // 本地状态管理
    const activeTab = ref('editor');
    const toastMessages = ref<Array<{id: string, message: string, type: string}>>([]);
    
    // Toast处理
    const showToast = (message: string, type: string = 'info') => {
      const id = Date.now().toString();
      toastMessages.value.push({ id, message, type });
      
      setTimeout(() => {
        removeToast(id);
      }, 3000);
    };
    
    const removeToast = (id: string) => {
      const index = toastMessages.value.findIndex(m => m.id === id);
      if (index > -1) {
        toastMessages.value.splice(index, 1);
      }
    };
    
    return {
      activeTab,
      toastMessages,
      showToast,
      removeToast
    };
  }
});
</script> 