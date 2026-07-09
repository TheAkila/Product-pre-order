import { Product as ProductType } from '@/types/product';
import Product from './Product';
import OrderForm from './OrderForm';

export default function ProductSection({ product }: { product: ProductType }) {
  return (
    <>
      <Product product={product} />
      <OrderForm product={product} />
    </>
  );
}
