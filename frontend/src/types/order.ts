export interface Order {
  id: number;
  totalAmount: number;
  status: string;
  createdDate: string;

  productName: string;
  productImage: string;
  itemCount: number;
}