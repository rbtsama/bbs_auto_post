/**
 * 车辆图片接口
 */
export interface VehicleImage {
  id: number;
  url: string;
  selected: boolean;
  order: number | null;
}

/**
 * 车辆数据接口
 */
export interface Vehicle {
  id: string;
  model: string;
  details: string;
  stockNumber: string;
  mileage: string;
  price: string;
  images?: VehicleImage[];
}

/**
 * 用户接口
 */
export interface User {
  id: string;
  username: string;
  phone?: string;
}

// 使用User作为主要用户接口
export type UserAccount = User & {
  email?: string;
}

/**
 * 历史记录接口
 */
export interface HistoryRecord {
  id: string;
  vehicle: Vehicle;
  username: string;
  title: string;
  postUrl: string;
  queueTime: string;
  executeTime: string;
  status: StatusType;
  content?: string;
  images?: string[];
}

/**
 * 表单数据接口
 */
export interface PostFormData {
  title: string;
  content: string;
  tags: string;
}

/**
 * Toast消息类型
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast消息接口
 */
export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  visible: boolean;
}

/**
 * 状态类型
 */
export type StatusType = 'pending' | 'success' | 'failed' | 'canceled'; 