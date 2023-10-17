import { db } from '@libs/db';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

export const getProductById = async (event) => {
  const productId = event.pathParameters.id;

  try {
    const product = await db(process.env.PRODUCTS_DB_NAME).where({ id: productId }).first();

    if (!product) {
      return formatJSONResponse(404, { message: 'Product not found' });
    }

    return formatJSONResponse(200, { product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return formatJSONResponse(500, { error: 'Internal Server Error' });
  }
};

export const main = middyfy(getProductById);