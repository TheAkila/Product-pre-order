// Order data types
export type DeliveryMethod = 'DELIVER' | 'COLLECT';

export interface DeliveryDetails {
  address: string;
  city: string;
  postalCode: string;
}

export interface Order {
  orderId: string;
  name: string;
  phone: string;
  quantity: number;
  amount: number;
  paymentMethod: 'PAYHERE';
  paymentStatus: PaymentStatus;
  deliveryMethod: DeliveryMethod;
  deliveryDetails?: DeliveryDetails;
  createdAt: Date;
  updatedAt?: Date;
}

export type PaymentStatus = 'PENDING_PAYMENT' | 'PAID' | 'CANCELLED';

export interface OrderFormData {
  name: string;
  phone: string;
  quantity: number;
  deliveryMethod: DeliveryMethod;
  deliveryDetails?: DeliveryDetails;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
}
