import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { middyfy } from '@libs/lambda';
import { prepareResponse } from '@libs/response/format';
import { productsDbDynamoAdapter } from "../../../dynamoDB/Products/utils/products.adpt";
import { RESPONSE_STATUS_CODES } from "@utils/constants";
import { isValidProductData } from "./validate";

const { WORK_REGION } = process.env;


const createProduct = async (event) => {
  const { products } = event.body;
  const requestOrigin = event.headers.origin || '';
  const client = new DynamoDBClient({ region: WORK_REGION });
  const dbClient = DynamoDBDocument.from(client);

  try {
    if (isValidProductData(products)) {
      await productsDbDynamoAdapter.createProducts(products, dbClient, 'PRODUCTS')
      return prepareResponse(RESPONSE_STATUS_CODES.CREATED, requestOrigin);
    } else {
      return prepareResponse(RESPONSE_STATUS_CODES.BAD_REQUEST, requestOrigin, { error: 'Product is invalid' })
    }
  } catch (err) {
    console.error(err);
    return prepareResponse(RESPONSE_STATUS_CODES.INTERNAL_ERROR, requestOrigin, { error: 'Something went wrong' })
  } finally {
    dbClient.destroy();
  }
};

export const main = middyfy(createProduct);
