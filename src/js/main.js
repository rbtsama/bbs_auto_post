/**
 * BBS自动发帖系统主脚本
 * 负责页面交互逻辑和数据处理
 * @module bbs-autopost/main
 */

/**
 * 车辆数据对象，包含所有可选的车辆信息
 * @type {Object.<string, Object>}
 */
const vehicleData = {
  "WA1LHAF72KD018313": {
    id: "WA1LHAF72KD018313",
    model: "2019 AUDI Q7",
    details: "45 TFSI PREMIUM PLUS SPORT UTILITY 4D",
    stockNumber: "J-1857",
    mileage: "103,413 mi",
    price: "$17,988",
    images: Array(15).fill().map((_, i) => {
      if (i === 2) return null; // 跳过不存在的图片
      return {
        id: i + 1,
        url: `./src/assets/images/vehicle/vehicle_10183_user_photo_${i+1}.jpeg`,
        selected: false,
        order: null
      };
    }).filter(Boolean)
  },
  "3MZBM1U79FM127617": {
    id: "3MZBM1U79FM127617",
    model: "2015 MAZDA Mazda3",
    details: "I SPORT SEDAN 4D",
    stockNumber: "J-1864",
    mileage: "118,589 mi",
    price: "$8,988",
    images: Array(4).fill().map((_, i) => {
      return {
        id: i + 1,
        url: `./src/assets/images/vehicle/vehicle_10183_user_photo_${i+1}.jpeg`,
        selected: false,
        order: null
      };
    })
  },
  "5UXKT0C39H0V96466": {
    id: "5UXKT0C39H0V96466",
    model: "2017 BMW X5",
    details: "XDRIVE40E IPERFORMANCE SPORT UTILITY 4D",
    stockNumber: "J-1867",
    mileage: "81,569 mi",
    price: "$19,988",
    images: Array(6).fill().map((_, i) => {
      return {
        id: i + 1,
        url: `./src/assets/images/vehicle/vehicle_10183_user_photo_${i+5}.jpeg`,
        selected: false,
        order: null
      };
    })
  }
};

// 当前选中的车辆
let currentVehicle = vehicleData["WA1LHAF72KD018313"];
let vehicleImages = [...currentVehicle.images];

/**
 * 可选用户列表
 * @type {Array.<{id: number, username: string, email: string}>}
 */
const userAccounts = [
  { id: 10025, username: "renhua22", email: "renhua22@gmail.com" },
  { id: 10026, username: "yycclife", email: "yycclife@outlook.com" },
  { id: 10027, username: "kdwong520", email: "kdwong520@ucla.edu" },
  { id: 10028, username: "Feichi88", email: "feichi88@gmail.com" },
  { id: 10029, username: "honghu2025", email: "honghu2025@gmail.com" },
  { id: 10030, username: "天路行者368", email: "skyliner68@gmail.com" },
  { id: 10031, username: "mia3587", email: "mia3587@gmail.com" },
  { id: 10032, username: "Chen427", email: "chen.mark427@gmail.com" },
  { id: 10033, username: "快乐星球5", email: "happystar567@163.com" },
  { id: 10034, username: "LilyWang823", email: "lilyw823@gmail.com" }
];

/**
 * 示例历史记录数据
 * @type {Array.<Object>}
 */
const historyData = [
  {
    vehicle: vehicleData["WA1LHAF72KD018313"],
    queueTime: "2023-04-01 14:30:00",
    executeTime: "2023-04-01 15:00:00",
    status: "success",
    username: userAccounts[0].username,
    title: "2019奥迪Q7豪华SUV，车况良好",
    postUrl: "https://example.com/bbs/post/12345"
  },
  {
    vehicle: vehicleData["3MZBM1U79FM127617"],
    queueTime: "2023-04-02 09:15:00",
    executeTime: "2023-04-02 10:00:00",
    status: "pending",
    username: userAccounts[2].username,
    title: "2015年马自达3，价格实惠",
    postUrl: "https://example.com/bbs/post/12346"
  },
  {
    vehicle: vehicleData["5UXKT0C39H0V96466"],
    queueTime: "2023-04-02 11:30:00",
    executeTime: "2023-04-02 12:15:00",
    status: "failed",
    username: userAccounts[4].username,
    title: "2017 宝马X5混动版，豪华配置",
    postUrl: "https://example.com/bbs/post/12347"
  }
];

// 对历史数据按排队时间倒序排序
historyData.sort((a, b) => new Date(b.queueTime) - new Date(a.queueTime));

/**
 * 初始化页面内容
 * 设置页面基本结构和事件监听
 */
function initPage() {
  renderEditorTab();
  renderHistoryTab();
  setupTabSwitching();
  setupToastContainer();
}

/**
 * 创建toast消息容器
 * 用于展示系统消息和操作反馈
 */
function setupToastContainer() {
  const toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);
}

/**
 * 显示toast消息
 * @param {string} message - 消息内容
 * @param {string} [type='error'] - 消息类型（error, success, warning）
 */
function showToast(message, type = 'error') {
  const container = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconClass = type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
  
  toast.innerHTML = `
    <span class="toast-icon">${iconClass}</span>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  // 3秒后移除toast
  setTimeout(() => {
    container.removeChild(toast);
  }, 3000);
}

/**
 * 渲染发帖编辑器Tab
 * 生成发帖表单和车辆信息展示区域
 */
function renderEditorTab() {
  const editorContent = document.getElementById('editor-content');
  editorContent.innerHTML = `
    <div class="mb-6">
      <!-- 车辆信息展示区 - 简化版 -->
      <div class="vehicle-info-compact">
        <div class="flex flex-col sm:flex-row gap-4 items-start">
          <!-- 车辆基本信息 -->
          <div class="flex-1 flex flex-col gap-1">
            <div class="flex items-baseline gap-2">
              <h2 class="font-bold text-xl">${currentVehicle.model}</h2>
              <span class="text-gray-500 text-sm">${currentVehicle.details}</span>
            </div>
            
            <div class="vehicle-info-fields mt-3">
              <div class="vehicle-info-field">VIN: ${currentVehicle.id}</div>
              <div class="vehicle-info-field">库存号: ${currentVehicle.stockNumber}</div>
              <div class="vehicle-info-field"><span class="vehicle-highlight-info">${currentVehicle.mileage}</span></div>
              <div class="vehicle-info-field"><span class="vehicle-highlight-info">${currentVehicle.price}</span></div>
            </div>
          </div>
          
          <!-- 右侧选项 -->
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- VIN选择 -->
            <div class="form-control">
              <label class="label-sm">
                <span class="label-text">选择VIN</span>
              </label>
              <select id="vin-select" class="input-sm">
                ${Object.keys(vehicleData).map(vin => `
                  <option value="${vin}" ${vin === currentVehicle.id ? 'selected' : ''}>${vin}</option>
                `).join('')}
              </select>
            </div>
            
            <!-- 用户名选择 -->
            <div class="form-control">
              <label class="label-sm">
                <span class="label-text">发帖用户名</span>
              </label>
              <select id="username-select" class="input-sm">
                ${userAccounts.map(user => `
                  <option value="${user.id}">${user.username}</option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 表单区域 -->
    <form id="post-form" class="mt-6">
      <!-- 帖子主题 -->
      <section class="mb-6">
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">帖子主题<span class="required-mark">*</span></span>
          </label>
          <input type="text" id="post-title" placeholder="请输入帖子主题" 
                class="input w-full" required />
        </div>
      </section>

      <!-- 帖子内容 -->
      <section class="mb-6">
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">帖子内容<span class="required-mark">*</span></span>
          </label>
          <textarea id="post-content" class="textarea w-full h-36" 
                  placeholder="请输入帖子内容" required></textarea>
        </div>
      </section>
      
      <!-- 标签 -->
      <section class="mb-6">
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">标签<span class="required-mark">*</span></span>
          </label>
          <input type="text" id="post-tags" placeholder="请输入标签" 
                class="input w-full" required />
        </div>
      </section>

      <!-- 图片选择 -->
      <section class="mb-6">
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">选择车辆图片</span>
            <span class="label-text-alt">已选择 <span id="selected-count">0</span>/30</span>
          </label>
          <div class="image-selector" id="image-container">
            ${renderImageGrid(vehicleImages)}
          </div>
        </div>
      </section>

      <!-- 发送选项和按钮 -->
      <section class="flex justify-end items-center gap-4 mt-8">
        <div class="form-control">
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="send-option" class="radio" checked />
              <span class="text-sm">立即发送</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="send-option" class="radio" />
              <span class="text-sm">智能排期</span>
            </label>
          </div>
        </div>
        <button type="button" class="btn btn-primary" id="send-button">发送</button>
      </section>
    </form>
  `;

  // 设置图片选择逻辑
  setupImageSelection();
  
  // 防止回车提交表单
  const postForm = document.getElementById('post-form');
  postForm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.id !== 'post-content') {
      e.preventDefault();
      return false;
    }
  });
  
  // 设置发送按钮点击事件
  const sendButton = document.getElementById('send-button');
  if (sendButton) {
    sendButton.addEventListener('click', () => {
      if (validateForm()) {
        handleSendPost();
      }
    });
  }
  
  // 设置VIN选择变更事件
  const vinSelect = document.getElementById('vin-select');
  if (vinSelect) {
    vinSelect.addEventListener('change', (e) => {
      const selectedVin = e.target.value;
      // 保存当前表单内容
      const formData = {
        title: document.getElementById('post-title').value,
        content: document.getElementById('post-content').value,
        tags: document.getElementById('post-tags').value
      };
      
      // 更新当前车辆信息
      currentVehicle = vehicleData[selectedVin];
      vehicleImages = [...currentVehicle.images];
      
      // 重新渲染编辑器，但保留表单内容
      renderEditorTab();
      
      // 恢复表单内容
      document.getElementById('post-title').value = formData.title;
      document.getElementById('post-content').value = formData.content;
      document.getElementById('post-tags').value = formData.tags;
      
      showToast('车辆信息已更新', 'success');
    });
  }
  
  // 设置用户名选择变更事件
  const usernameSelect = document.getElementById('username-select');
  if (usernameSelect) {
    usernameSelect.addEventListener('change', (e) => {
      const selectedUser = userAccounts.find(u => u.id === parseInt(e.target.value));
      if (selectedUser) {
        showToast('已选择用户: ' + selectedUser.username, 'success');
      }
    });
  }
}

/**
 * 验证表单数据
 * @returns {boolean} 表单是否有效
 */
function validateForm() {
  const postTitle = document.getElementById('post-title');
  const postContent = document.getElementById('post-content');
  const postTags = document.getElementById('post-tags');
  
  let isValid = true;
  let errorMessage = '';
  
  // 验证标题
  if (!postTitle.value.trim()) {
    isValid = false;
    errorMessage = '请填写帖子主题';
  }
  // 验证内容
  else if (!postContent.value.trim()) {
    isValid = false;
    errorMessage = '请填写帖子内容';
  }
  // 验证标签
  else if (!postTags.value.trim()) {
    isValid = false;
    errorMessage = '请填写标签';
  }
  
  if (!isValid) {
    showToast(errorMessage, 'error');
  }
  
  return isValid;
}

/**
 * 渲染图片网格
 * @param {Array} images - 图片数据数组
 * @returns {string} 图片网格HTML
 */
function renderImageGrid(images) {
  return images.map(image => `
    <div class="image-item" data-id="${image.id}">
      <img src="${image.url}" alt="车辆图片 ${image.id}" class="w-full h-auto aspect-video object-cover" />
      ${image.selected ? 
        `<div class="image-number">${image.order}</div>` : ''}
      <div class="absolute inset-0 bg-black/30 flex items-center justify-center ${image.selected ? '' : 'hidden'}">
        <div class="text-white">已选择</div>
      </div>
    </div>
  `).join('');
}

/**
 * 设置图片选择交互
 * 允许用户选择和排序车辆图片
 */
function setupImageSelection() {
  const imageContainer = document.getElementById('image-container');
  const selectedCountEl = document.getElementById('selected-count');
  let selectedCount = 0;
  
  // 初始化已选择计数
  vehicleImages.forEach(img => {
    if (img.selected) selectedCount++;
  });
  if (selectedCountEl) selectedCountEl.textContent = selectedCount;
  
  if (imageContainer) {
    imageContainer.addEventListener('click', (e) => {
      const imageItem = e.target.closest('.image-item');
      if (!imageItem) return;
      
      const imageId = parseInt(imageItem.dataset.id);
      const imageIndex = vehicleImages.findIndex(img => img.id === imageId);
      
      if (imageIndex > -1) {
        if (!vehicleImages[imageIndex].selected) {
          // 选择图片
          if (selectedCount < 30) {
            vehicleImages[imageIndex].selected = true;
            vehicleImages[imageIndex].order = selectedCount + 1;
            selectedCount++;
          } else {
            showToast('最多选择30张图片', 'warning');
            return;
          }
        } else {
          // 取消选择
          const removedOrder = vehicleImages[imageIndex].order;
          vehicleImages[imageIndex].selected = false;
          vehicleImages[imageIndex].order = null;
          selectedCount--;
          
          // 重新调整序号
          vehicleImages.forEach(img => {
            if (img.selected && img.order > removedOrder) {
              img.order--;
            }
          });
        }
        
        // 更新UI
        selectedCountEl.textContent = selectedCount;
        imageContainer.innerHTML = renderImageGrid(vehicleImages);
      }
    });
  }
}

/**
 * 处理发送帖子
 * 收集表单数据并创建新的历史记录
 */
function handleSendPost() {
  // 获取表单数据
  const postTitle = document.getElementById('post-title').value;
  const postContent = document.getElementById('post-content').value;
  const postTags = document.getElementById('post-tags').value;
  
  // 获取选择的VIN和用户名
  const vinSelect = document.getElementById('vin-select');
  const usernameSelect = document.getElementById('username-select');
  const selectedVin = vinSelect ? vinSelect.value : currentVehicle.id;
  const selectedUserId = usernameSelect ? parseInt(usernameSelect.value) : userAccounts[0].id;
  const selectedUser = userAccounts.find(u => u.id === selectedUserId) || userAccounts[0];
  
  // 获取选择的发送选项
  const selectedOption = document.querySelector('input[name="send-option"]:checked');
  const isImmediate = selectedOption.nextElementSibling.textContent.trim() === '立即发送';
  
  const now = new Date();
  const executeTime = isImmediate ? now : new Date(now.getTime() + 3600000); // 智能排期1小时后
  
  // 添加新的历史记录
  historyData.unshift({
    vehicle: vehicleData[selectedVin],
    queueTime: formatDate(now),
    executeTime: formatDate(executeTime),
    status: isImmediate ? "success" : "pending",
    username: selectedUser.username,
    title: postTitle,
    postUrl: "https://example.com/bbs/post/" + Math.floor(Math.random() * 100000)
  });
  
  // 清空表单
  document.getElementById('post-title').value = '';
  document.getElementById('post-content').value = '';
  document.getElementById('post-tags').value = '';
  
  // 重置图片选择
  vehicleImages.forEach(img => {
    img.selected = false;
    img.order = null;
  });
  document.getElementById('selected-count').textContent = '0';
  document.getElementById('image-container').innerHTML = renderImageGrid(vehicleImages);
  
  // 显示成功提示
  showToast('发帖成功!', 'success');
  
  // 切换到历史Tab
  document.getElementById('history-tab').click();
  renderHistoryTab(); // 重新渲染历史数据
}

/**
 * 渲染发帖历史Tab
 * 显示历史发帖记录的表格
 */
function renderHistoryTab() {
  const historyContent = document.getElementById('history-content');
  
  historyContent.innerHTML = `
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>VIN</th>
            <th>车辆信息</th>
            <th>库存号</th>
            <th>里程</th>
            <th>价格</th>
            <th>发帖用户</th>
            <th>帖子主题</th>
            <th>排队时间 (PST)</th>
            <th>计划/执行时间 (PST)</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          ${historyData.map(item => `
            <tr class="border-b border-gray-200">
              <td class="whitespace-nowrap">${item.vehicle.id}</td>
              <td class="vehicle-info-cell">
                <div class="flex flex-col">
                  <span class="font-bold">${item.vehicle.model}</span>
                  <span class="text-sm text-gray-600">${item.vehicle.details}</span>
                </div>
              </td>
              <td>${item.vehicle.stockNumber}</td>
              <td><span class="vehicle-highlight-info">${item.vehicle.mileage}</span></td>
              <td><span class="vehicle-highlight-info">${item.vehicle.price}</span></td>
              <td>${item.username || userAccounts[0].username}</td>
              <td>
                <a href="${item.postUrl}" target="_blank" class="post-link">${item.title}</a>
              </td>
              <td>${item.queueTime}</td>
              <td>${item.executeTime}</td>
              <td>
                <span class="${getStatusClass(item.status)}">
                  ${getStatusText(item.status)}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * 根据状态获取对应的CSS类名
 * @param {string} status - 状态
 * @returns {string} CSS类名
 */
function getStatusClass(status) {
  const statusClasses = {
    'pending': 'status-pending',
    'success': 'status-success',
    'failed': 'status-failed'
  };
  return statusClasses[status] || '';
}

/**
 * 根据状态获取对应的文本
 * @param {string} status - 状态
 * @returns {string} 显示文本
 */
function getStatusText(status) {
  const statusTexts = {
    'pending': '待发送',
    'success': '成功',
    'failed': '失败'
  };
  return statusTexts[status] || status;
}

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/Los_Angeles'
  }) + ' (PST)';
}

/**
 * 设置Tab切换功能
 * 控制编辑器和历史记录页面的切换
 */
function setupTabSwitching() {
  const editorTab = document.getElementById('editor-tab');
  const historyTab = document.getElementById('history-tab');
  const editorContent = document.getElementById('editor-content');
  const historyContent = document.getElementById('history-content');
  
  editorTab.addEventListener('click', () => {
    editorTab.classList.add('tab-active');
    historyTab.classList.remove('tab-active');
    editorContent.classList.remove('hidden');
    historyContent.classList.add('hidden');
  });
  
  historyTab.addEventListener('click', () => {
    historyTab.classList.add('tab-active');
    editorTab.classList.remove('tab-active');
    historyContent.classList.remove('hidden');
    editorContent.classList.add('hidden');
  });
}

// 初始化页面
document.addEventListener('DOMContentLoaded', initPage); 