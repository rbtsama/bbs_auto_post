<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

/**
 * 应用根组件
 * 提供整体页面布局和样式
 * @component App
 */
export default defineComponent({
  name: 'App'
});
</script> 