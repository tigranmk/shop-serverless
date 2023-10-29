import { Product } from "types";

export function isValidProductData(products: Product[]): boolean {
  for (const product of products) {
      if (
          typeof product.title !== 'string' ||
          typeof product.description !== 'string' ||
          typeof product.price !== 'number' ||
          typeof product.count !== 'number'
      ) {
          return false;
      }
  }

  return true;
}