// Product catalog data types
export const MAX_PRODUCT_IMAGES = 3;

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[]; // up to MAX_PRODUCT_IMAGES URLs, first is the cover image
  regularPrice: number;
  preorderPrice: number;
  deliveryFee: number;
  preorderCloses: string; // ISO date string
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ProductFormData {
  name: string;
  description: string;
  images: string[];
  regularPrice: number;
  preorderPrice: number;
  deliveryFee: number;
  preorderCloses: string;
  active: boolean;
  sortOrder: number;
}
