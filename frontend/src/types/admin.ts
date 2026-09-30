export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdDate: string;
}

export interface AdminOrder {
  id: number;
  totalAmount: number;
  status: string;
  createdDate: string;
  customerName: string;
}

export interface AdminOrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface AdminOrderDetails {
  id: number;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  createdDate: string;
  items: AdminOrderItem[];
}
