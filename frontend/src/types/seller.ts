export interface Seller {
  id: number;
  companyName: string;
  description: string;
  logoUrl?: string;
  userName: string;
  userEmail: string;
  userId: number;
  isApproved: boolean;
  isSuspended: boolean;
  createdDate: string;
  totalProducts: number;
  totalRevenue: number;
}

export interface SellerDashboard {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: SellerOrder[];
}

export interface SellerOrder {
  orderId: number;
  customerName: string;
  orderDate: string;
  status: string;
  sellerTotal: number;
  items: SellerOrderItem[];
}

export interface SellerOrderItem {
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}
