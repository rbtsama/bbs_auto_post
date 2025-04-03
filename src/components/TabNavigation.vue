<template>
  <div class="flex border-b mb-6">
    <button 
      class="py-2 px-4 font-medium"
      :class="activeTabStore.activeTab === 'editor' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'"
      @click="setActiveTab('editor')"
    >
      发帖编辑器
    </button>
    <button 
      class="py-2 px-4 font-medium"
      :class="activeTabStore.activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'"
      @click="setActiveTab('history')"
    >
      发帖历史
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useActiveTabStore } from '@/stores';

/**
 * 标签导航组件
 * 提供应用主要功能页面切换
 * @component TabNavigation
 */
export default defineComponent({
  name: 'TabNavigation',
  setup() {
    const activeTabStore = useActiveTabStore();
    
    /**
     * 设置当前活动标签页
     * @param {string} tab - 标签页ID
     */
    const setActiveTab = (tab: 'editor' | 'history') => {
      activeTabStore.setActiveTab(tab);
    };
    
    return {
      activeTabStore,
      setActiveTab
    };
  }
});
</script> 