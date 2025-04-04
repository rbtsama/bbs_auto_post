<template>
  <div class="bg-white rounded-lg overflow-hidden" v-if="images.length > 0">
    <!-- 图片预览模态框 -->
    <div v-if="previewImage" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" @click="closePreview">
      <div class="relative max-w-[900px] max-h-[90vh] flex items-center justify-center">
        <img :src="previewImage" class="max-w-full max-h-full object-contain" alt="预览图片" style="max-width: 900px; max-height: 900px;" />
        <button @click.stop="closePreview" class="absolute top-3 right-3 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white transition duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4 mt-2">
      <div 
        v-for="(image, index) in images" 
        :key="index" 
        class="relative rounded-lg border border-gray-200 hover:border-blue-500 flex justify-center items-center cursor-pointer aspect-square overflow-hidden p-2 transition duration-200 shadow-sm hover:shadow-md"
        @click="toggleImageSelection(image)"
      >
        <img 
          :src="image" 
          :alt="`车辆图片 ${index + 1}`" 
          class="max-w-full max-h-full object-contain" 
          @error="handleImageError(index)"
        />
        <div 
          v-if="isSelected(image)" 
          class="absolute top-2 right-2 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-md"
        >
          {{ getImageOrder(image) }}
        </div>
        <div 
          class="absolute inset-0 bg-blue-900/30 flex items-center justify-center transition-opacity duration-200"
          :class="{ 'opacity-0': !isSelected(image), 'opacity-100': isSelected(image) }"
        >
          <div v-if="isSelected(image)" class="text-white font-medium bg-blue-600/80 px-3 py-1.5 rounded-lg shadow-lg">
            已选择 {{ getImageOrder(image) }}
          </div>
        </div>
        <!-- 放大镜图标 -->
        <button 
          class="absolute bottom-2 right-2 bg-white hover:bg-gray-100 rounded-full p-1.5 text-gray-700 z-10 shadow-sm transition duration-200 opacity-70 hover:opacity-100"
          @click.stop="openPreview(image)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
  <div v-else class="py-12 text-center bg-gray-50 rounded-lg">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <p class="text-gray-500 font-medium">正在加载图片...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref, PropType } from 'vue';

/**
 * 图片选择器组件
 * 用于展示和选择车辆图片，支持多选
 * @component ImageSelector
 */
export default defineComponent({
  name: 'ImageSelector',
  props: {
    maxHeight: {
      type: String,
      default: '400px'
    },
    selectedVehicleId: {
      type: String,
      required: true
    }
  },
  emits: ['update:selectedImages'],
  setup(props, { emit }) {
    // Toast消息状态
    const toastMessages = ref<Array<{id: string, message: string, type: string}>>([]);
    
    // 图片状态
    const images = ref<string[]>([]);
    const selectedImages = ref<string[]>([]);
    const previewImage = ref<string | null>(null);
    
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
     * 初始化组件
     * 加载当前车辆对应的图片
     */
    onMounted(async () => {
      console.log('ImageSelector 组件已挂载，车辆ID:', props.selectedVehicleId);
      if (props.selectedVehicleId) {
        await loadImages();
      }
    });
    
    /**
     * 加载当前车辆的图片
     * 处理图片加载异常
     */
    const loadImages = async () => {
      try {
        console.log('正在加载图片，车辆ID:', props.selectedVehicleId);
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 从本地目录加载图片
        const imagePrefix = '/moke_photo';
        
        // 重置图片数组
        images.value = [];
        
        // 获取当前车辆对应的图片
        const imageMap: Record<string, number[]> = {
          '5UXKR0C5XF0K59737': [1, 2, 3, 4, 5], // BMW X5
          'ZAM57RTA6F1149408': [2, 3, 4, 5, 6], // Maserati Ghibli
          'WDDHF5KB6GB261473': [3, 4, 5, 6, 7], // Mercedes E-Class
          '1FTEW1EP1JKE07430': [4, 5, 6, 7, 8], // Ford F-150
          '5TDZA3EH8DS037305': [5, 6, 7, 8, 9], // Toyota Highlander 2013
          'WA1LFAFP6CA072271': [6, 7, 8, 9, 10], // Audi Q5
          '5TDZK3EH0BS043058': [7, 8, 9, 10, 11], // Toyota Highlander 2011
          'KNMAT2MT4HP583428': [8, 9, 10, 11, 12] // Nissan Rogue
        };
        
        // 获取当前车辆的图片集或使用默认图片集
        const imageIndexes = imageMap[props.selectedVehicleId] || [1, 2, 3, 4, 5];
        
        // 构建图片路径数组
        const newImages = imageIndexes.map(index => 
          `${imagePrefix}/vehicle_10183_user_photo_${index}.jpeg`
        );
        
        // 确保UI更新
        setTimeout(() => {
          images.value = newImages;
          console.log(`已加载 ${images.value.length} 张图片，车辆ID: ${props.selectedVehicleId}`);
        }, 0);
      } catch (error) {
        console.error('加载图片时出错:', error);
        images.value = []; // 出错时重置图片数组
        showToast('图片加载失败，请刷新页面重试', 'error');
      }
    };
    
    /**
     * 处理图片选择/取消选择
     * @param {string} imageUrl - 图片URL
     */
    const toggleImageSelection = (imageUrl: string) => {
      const index = selectedImages.value.indexOf(imageUrl);
      if (index > -1) {
        selectedImages.value.splice(index, 1);
      } else {
        selectedImages.value.push(imageUrl);
      }
      emit('update:selectedImages', selectedImages.value);
    };
    
    /**
     * 判断图片是否被选中
     * @param {string} imageUrl - 图片URL
     */
    const isSelected = (imageUrl: string) => {
      return selectedImages.value.includes(imageUrl);
    };
    
    /**
     * 获取图片选择顺序
     * @param {string} imageUrl - 图片URL
     */
    const getImageOrder = (imageUrl: string) => {
      return selectedImages.value.indexOf(imageUrl) + 1;
    };
    
    /**
     * 处理图片加载错误
     * @param {Event} event - 错误事件
     */
    const handleImageError = (index: number) => {
      console.error(`图片加载失败: ${images.value[index]}`);
      showToast('部分图片加载失败', 'warning');
    };
    
    /**
     * 打开预览
     * @param {string} imageUrl - 图片URL
     */
    const openPreview = (imageUrl: string) => {
      previewImage.value = imageUrl;
    };
    
    /**
     * 关闭预览
     */
    const closePreview = () => {
      previewImage.value = null;
    };
    
    /**
     * 监听车辆变化，重新加载对应图片
     */
    watch(() => props.selectedVehicleId, async (newVal, oldVal) => {
      console.log('车辆ID变更:', oldVal, '->', newVal);
      if (newVal && newVal !== oldVal) {
        await loadImages();
      }
    }, { immediate: true });
    
    return {
      images,
      selectedImages,
      toggleImageSelection,
      isSelected,
      getImageOrder,
      handleImageError,
      previewImage,
      openPreview,
      closePreview
    };
  }
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
</style> 