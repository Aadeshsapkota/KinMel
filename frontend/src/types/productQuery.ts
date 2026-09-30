export interface ProductQuery {
  search?: string;
  categoryIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}