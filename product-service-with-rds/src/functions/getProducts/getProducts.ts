import { db } from '@libs/db'
import { formatJSONResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda';

export const getProducts = async () => {
  try {
    const result = await db
      .select('products.id', 'products.title', 'products.description', 'products.price', 'stocks.count')
      .from(process.env.PRODUCTS_DB_NAME)
      .leftJoin(process.env.STOCKS_DB_NAME, 'products.id', 'stocks.product_id');
    return formatJSONResponse(200, { result });
  } catch (error) {
    console.error('Error executing query:', error);
    return formatJSONResponse(500, { error });
  }

}

export const main = middyfy(getProducts);
