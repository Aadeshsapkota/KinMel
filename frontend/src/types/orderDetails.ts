export interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface OrderDetails {
  id: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  createdDate: string;
  items: OrderItem[];
}