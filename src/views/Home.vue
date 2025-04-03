<template>
  <TabNavigation class="max-w-7xl mx-auto" />
  
  <div class="bg-white shadow-md rounded-lg p-4 max-w-7xl mx-auto mb-6">
    <PostEditorTab v-if="activeTabStore.activeTab === 'editor'" />
    <HistoryTab v-else-if="activeTabStore.activeTab === 'history'" />
  </div>
  
  <ToastContainer />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import TabNavigation from '@/components/TabNavigation.vue';
import PostEditorTab from '@/components/PostEditorTab.vue';
import HistoryTab from '@/components/HistoryTab.vue';
import ToastContainer from '@/components/ToastContainer.vue';
import { useActiveTabStore, useHistoryStore, useVehicleStore, useUserStore, useToastStore } from '@/stores';

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
    const activeTabStore = useActiveTabStore();
    const historyStore = useHistoryStore();
    const vehicleStore = useVehicleStore();
    const userStore = useUserStore();
    const toastStore = useToastStore();
    
    /**
     * 初始化并加载应用所需数据
     * 包括车辆、用户、图片和历史记录
     */
    onMounted(async () => {
      try {
        await Promise.all([
          vehicleStore.fetchVehicles(),
          userStore.fetchUsers(),
          historyStore.fetchHistory()
        ]);
        
        if (vehicleStore.selectedVehicleId) {
          await vehicleStore.fetchImages();
        }
      } catch (error) {
        toastStore.showToast('数据加载失败，请刷新页面重试', 'error');
      }
    });
    
    return {
      activeTabStore,
      historyStore,
      vehicleStore,
      userStore,
      toastStore
    };
  }
});
</script> 