import { middyfy } from '@libs/lambda';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { useDbConnection } from '@libs/useDbConnection';
import { getErrorMessage } from '@libs/utils';
import { prepareResponse } from '@libs/response/format';
import { RESP_STATUS_CODES } from '@utils/constants';

const { WORK_REGION, DYNAMO_PRODUCTS_TABLE } = process.env;

const getProductsById = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const requestOrigin = event.headers.origin || '';
  const productId = event.pathParameters.productId;

  return useDbConnection({ region: WORK_REGION }, async (dbConnectionError, dbClient) => {

    if (dbConnectionError || !dbClient) {
      return prepareResponse(RESP_STATUS_CODES.INTERNAL_ERROR, requestOrigin, { error: getErrorMessage(dbConnectionError, 'unknown error during DB connection') },)
    }

    try {
      const scanCommandForProducts = new ScanCommand({ TableName: DYNAMO_PRODUCTS_TABLE });

      const { Items: products = [] } = await dbClient.send(scanCommandForProducts);

      const product = products.find((product) => product.id.S === productId);

      if (product) {
        return prepareResponse(RESP_STATUS_CODES.OK, requestOrigin, { product });

      } else {
        return prepareResponse(RESP_STATUS_CODES.OK, requestOrigin, { error: 'Product not found' });
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'unknown error during DB request')

      return prepareResponse(RESP_STATUS_CODES.INTERNAL_ERROR, requestOrigin, { error: errorMessage })
    }
  })
}
export default getProductsById;
export const main = middyfy(getProductsById);
