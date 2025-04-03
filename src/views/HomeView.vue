<template>
  <!-- 选项卡导航 -->
  <TabNavigation class="max-w-7xl mx-auto px-0 py-6" />

  <!-- 内容区域 -->
  <div class="bg-white rounded-lg p-4 max-w-7xl mx-auto">
    <PostEditorTab v-if="activeTab === 'editor'" />
    <HistoryTab v-else-if="activeTab === 'history'" />
  </div>

  <!-- Toast消息容器 -->
  <ToastContainer />
</template>

<script lang="ts">
import { defineComponent, ref, provide } from 'vue';
import TabNavigation from '@/components/TabNavigation.vue';
import PostEditorTab from '@/components/PostEditorTab.vue';
import HistoryTab from '@/components/HistoryTab.vue';
import ToastContainer from '@/components/ToastContainer.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    TabNavigation,
    PostEditorTab,
    HistoryTab,
    ToastContainer
  },
  setup() {
    const activeTab = ref('editor'); // 默认显示发帖编辑器
    
    const switchTab = (tab: string) => {
      activeTab.value = tab;
    };
    
    // 提供给子组件的方法
    provide('switchTab', switchTab);
    
    return {
      activeTab
    };
  }
});
</script> 