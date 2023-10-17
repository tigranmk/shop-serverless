import { db } from '@libs/db';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

export const createProduct = async (event) => {
  const { products, stocks } = JSON.parse(event.body);

  try {
    const result = await db.transaction(async (trx) => {
      const productIds = await db(process.env.PRODUCTS_DB_NAME).transacting(trx).insert(products).returning('id');

      for (let i = 0; i < productIds.length; i++) {
        await db(process.env.STOCKS_DB_NAME).transacting(trx).insert({ product_id: productIds[i], count: stocks[i].count });
      }

      return productIds;
    });

    return formatJSONResponse(200, { message: 'Products and Stocks created successfully', result });
  } catch (error) {
    console.error('Error creating Products and Stocks:', error);
    return formatJSONResponse(500, { error: 'Error creating Products and Stocks' });
  }
};

export const main = middyfy(createProduct);
