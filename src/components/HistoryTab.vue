<template>
  <table class="w-full border-collapse text-sm">
    <thead>
      <tr class="bg-gray-50 border-b border-gray-200">
        <th class="px-4 py-3 text-left font-medium text-gray-600">VIN</th>
        <th class="px-4 py-3 text-left font-medium text-gray-600">车辆信息</th>
        <th class="px-4 py-3 text-left font-medium text-gray-600">里程</th>
        <th class="px-4 py-3 text-left font-medium text-gray-600">价格</th>
        <th class="px-4 py-3 text-left font-medium text-gray-600">发帖用户</th>
        <th class="px-4 py-3 text-left font-medium text-gray-600">帖子主题</th>
        <th class="px-4 py-3 text-left font-medium text-gray-600">排队时间 (PST)</th>
        <th class="px-4 py-3 text-left font-medium text-gray-600">计划执行时间 (PST)</th>
        <th class="px-4 py-3 text-left font-medium text-gray-600 min-w-[96px]">状态</th>
        <th class="px-4 py-3 text-left font-medium text-gray-600 min-w-[120px]">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr 
        v-for="item in historyStore.sortedRecords" 
        :key="item.id"
        class="border-b border-gray-100 hover:bg-gray-50"
      >
        <td class="px-4 py-3 text-gray-700 whitespace-nowrap">{{ item.vehicle.id }}</td>
        <td class="px-4 py-3">
          <div class="flex flex-col">
            <span class="text-gray-800 font-medium">{{ formatVehicleModel(item.vehicle.model) }}</span>
            <span class="text-xs text-gray-500">{{ item.vehicle.details }}</span>
          </div>
        </td>
        <td class="px-4 py-3 text-gray-800 font-medium">{{ item.vehicle.mileage }}</td>
        <td class="px-4 py-3 text-gray-800 font-medium">{{ item.vehicle.price }}</td>
        <td class="px-4 py-3 text-gray-700">{{ item.username }}</td>
        <td class="px-4 py-3 text-gray-800">
          <a :href="item.postUrl" target="_blank" class="text-blue-600 hover:text-blue-800 hover:underline">{{ item.title }}</a>
        </td>
        <td class="px-4 py-3 text-gray-600">{{ formatDate(item.queueTime) }}</td>
        <td class="px-4 py-3 text-gray-600">{{ formatDate(item.executeTime) }}</td>
        <td class="px-4 py-3">
          <span :class="getStatusClass(item.status)" class="text-sm font-medium">
            {{ getStatusText(item.status) }}
          </span>
        </td>
        <td class="px-4 py-3 min-w-[120px]">
          <div class="flex gap-2">
            <button 
              @click="showSnapshot(item)"
              class="text-sm border border-blue-200 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition duration-200 whitespace-nowrap"
            >
              查看快照
            </button>
            <button 
              v-if="item.status === 'pending'" 
              @click="confirmCancel(item.id)"
              class="text-sm border border-red-200 text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition duration-200 whitespace-nowrap"
            >
              取消发帖
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  
  <!-- 发帖快照弹窗 -->
  <div v-if="snapshotVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-800">发帖快照</h3>
        <button @click="closeSnapshot" class="text-gray-500 hover:text-gray-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="p-6">
        <div v-if="selectedPost" class="space-y-6">
          <!-- 1. 车辆基本信息 -->
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h5 class="font-medium text-gray-800 mb-3">车辆基本信息</h5>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="text-gray-700">VIN: <span class="text-gray-900">{{ selectedPost.vehicle.id }}</span></div>
              <div class="text-gray-700">库存号: <span class="text-gray-900">{{ selectedPost.vehicle.stockNumber }}</span></div>
              <div class="text-gray-700">车型: <span class="text-gray-900">{{ formatVehicleModel(selectedPost.vehicle.model) }}</span></div>
              <div class="text-gray-700">详情: <span class="text-gray-900">{{ selectedPost.vehicle.details }}</span></div>
              <div class="text-gray-700">里程: <span class="text-blue-600 font-medium">{{ selectedPost.vehicle.mileage }}</span></div>
              <div class="text-gray-700">价格: <span class="text-blue-600 font-medium">{{ selectedPost.vehicle.price }}</span></div>
            </div>
          </div>
          
          <!-- 2. 排期时间、发布用户 -->
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div class="flex flex-wrap gap-4 text-sm">
              <div class="flex items-center">
                <span class="text-gray-500 mr-2">发布用户:</span>
                <span class="text-gray-900 font-medium">{{ selectedPost.username }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 mr-2">排队时间:</span>
                <span class="text-gray-900">{{ formatDate(selectedPost.queueTime) }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 mr-2">发布时间:</span>
                <span class="text-gray-900">{{ formatDate(selectedPost.executeTime) }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 mr-2">状态:</span>
                <span :class="getStatusClass(selectedPost.status)">{{ getStatusText(selectedPost.status) }}</span>
              </div>
            </div>
          </div>
          
          <!-- 3. 主题+标签+正文 -->
          <div class="space-y-3">
            <h4 class="font-medium text-lg text-gray-800 border-b border-gray-200 pb-2">{{ selectedPost.title }}</h4>
            <div class="bg-white p-4 rounded-lg border border-gray-200">
              <pre class="whitespace-pre-wrap text-sm text-gray-700">{{ selectedPost.content || '无内容' }}</pre>
            </div>
          </div>
          
          <!-- 4. 图片缩略图 -->
          <div>
            <h5 class="font-medium text-gray-800 mb-3 border-b border-gray-200 pb-2">图片列表</h5>
            <div class="grid grid-cols-4 gap-3">
              <div v-for="(image, index) in selectedPost.images" :key="index" class="aspect-\[4\/3\] border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200">
                <img :src="image" class="w-full h-full object-cover" :alt="`图片 ${index+1}`" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 取消确认弹窗 -->
  <div v-if="cancelConfirmVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-800">确认取消</h3>
      </div>
      <div class="p-6">
        <p class="text-gray-700">确定要取消发送这条帖子吗？此操作无法撤销。</p>
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="cancelConfirmVisible = false" 
            class="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            取消
          </button>
          <button 
            @click="confirmCancelPost" 
            class="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            确认取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useHistoryStore, useToastStore, useUserStore } from '@/stores';
import { StatusType, HistoryRecord } from '@/types';

/**
 * 历史记录标签页组件
 * 显示发帖历史记录，支持查看快照和取消发帖
 * @component HistoryTab
 */
export default defineComponent({
  name: 'HistoryTab',
  setup() {
    const historyStore = useHistoryStore();
    const toastStore = useToastStore();
    const userStore = useUserStore();
    
    const snapshotVisible = ref(false);
    const selectedPost = ref<HistoryRecord | null>(null);
    const cancelConfirmVisible = ref(false);
    const postIdToCancel = ref<string | null>(null);
    
    /**
     * 获取所有历史记录
     * 按时间倒序排列
     */
    const records = ref(historyStore.records);
    
    /**
     * 初始化组件
     * 加载历史记录数据
     */
    onMounted(async () => {
      // 确保用户数据已加载
      if (userStore.users.length === 0) {
        await userStore.fetchUsers();
      }
      
      // 确保历史记录已加载
      if (historyStore.records.length === 0) {
        await historyStore.fetchHistory();
      }
    });
    
    /**
     * 格式化车辆模型名称
     * 只显示品牌和型号，移除年份
     * @param {string} model - 完整的车辆模型名称
     * @return {string} 格式化后的车辆模型名称
     */
    const formatVehicleModel = (model: string): string => {
      const parts = model.split(' ');
      if (parts.length > 1) {
        // 移除年份部分（假设年份是第一个部分）
        return parts.slice(1).join(' ');
      }
      return model;
    };
    
    /**
     * 格式化日期时间
     * @param {string} dateString - 日期时间字符串
     * @return {string} 格式化后的日期时间
     */
    const formatDate = (dateStr: string): string => {
      // 简单返回原始日期，也可以在这里添加格式化逻辑
      return dateStr;
    };
    
    /**
     * 获取状态对应的文本颜色
     * @param {string} status - 状态值
     * @return {string} Tailwind CSS 文本颜色类
     */
    const getStatusClass = (status: StatusType): string => {
      switch (status) {
        case 'pending':
          return 'text-yellow-600';
        case 'success':
          return 'text-green-600';
        case 'failed':
          return 'text-red-600';
        case 'canceled':
          return 'text-gray-500';
        default:
          return '';
      }
    };
    
    /**
     * 获取状态文本
     * @param {string} status - 状态值
     * @return {string} 状态文本
     */
    const getStatusText = (status: StatusType): string => {
      switch (status) {
        case 'pending':
          return '待发送';
        case 'success':
          return '成功';
        case 'failed':
          return '失败';
        case 'canceled':
          return '取消发送';
        default:
          return '';
      }
    };
    
    /**
     * 取消发送帖子
     * @param {string} id - 帖子ID
     */
    const cancelPost = (id: string) => {
      historyStore.cancelPost(id);
      toastStore.showToast('已取消发送帖子', 'success');
    };
    
    /**
     * 显示发帖快照
     * @param {HistoryRecord} post - 要查看的帖子记录
     */
    const showSnapshot = (post: HistoryRecord) => {
      selectedPost.value = post;
      snapshotVisible.value = true;
    };
    
    /**
     * 关闭发帖快照
     */
    const closeSnapshot = () => {
      snapshotVisible.value = false;
      selectedPost.value = null;
    };
    
    /**
     * 显示取消确认弹窗
     * @param {string} id - 要取消的帖子ID
     */
    const confirmCancel = (id: string) => {
      postIdToCancel.value = id;
      cancelConfirmVisible.value = true;
    };
    
    /**
     * 确认取消发送帖子
     */
    const confirmCancelPost = () => {
      if (postIdToCancel.value) {
        historyStore.cancelPost(postIdToCancel.value);
        toastStore.showToast('已取消发送帖子', 'success');
        cancelConfirmVisible.value = false;
        postIdToCancel.value = null;
      }
    };
    
    return {
      historyStore,
      getStatusClass,
      getStatusText,
      cancelPost,
      confirmCancel,
      cancelConfirmVisible,
      confirmCancelPost,
      showSnapshot,
      closeSnapshot,
      snapshotVisible,
      selectedPost,
      formatVehicleModel,
      formatDate
    };
  }
});
</script>

<style scoped>
.aspect-\[4\/3\] {
  aspect-ratio: 4/3;
}
</style> 