// Product catalog data types
export interface Product {
  id: string;
  name: string;
  description: string;
  imageFront: string;
  imageBack: string;
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
  imageFront: string;
  imageBack: string;
  regularPrice: number;
  preorderPrice: number;
  deliveryFee: number;
  preorderCloses: string;
  active: boolean;
  sortOrder: number;
}
