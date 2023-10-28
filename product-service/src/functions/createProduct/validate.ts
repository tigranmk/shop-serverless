import { Product, Stock } from "types";

export function isValidProductData(products: Product[], stocks: Stock[]): boolean {
  for (const product of products) {
      if (
          typeof product.title !== 'string' ||
          typeof product.description !== 'string' ||
          typeof product.price !== 'number'
      ) {
          return false;
      }
  }

  for (const stock of stocks) {
      if (
          typeof stock.count !== 'number'
      ) {
          return false;
      }
  }

  return true;
}