import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { middyfy } from '@libs/lambda';
import { prepareResponse } from "@libs/response/format";
import { useDbConnection } from "@libs/useDbConnection";
import { getErrorMessage } from "@libs/utils";
import { RESP_STATUS_CODES } from "@utils/constants";

const { WORK_REGION, DYNAMO_PRODUCTS_TABLE, DYNAMO_STOCKS_TABLE } = process.env;

const getProducts = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const requestOrigin = event.headers.origin || '';

  return useDbConnection({ region: WORK_REGION }, async (dbConnectionError, dbClient) => {

    if (dbConnectionError || !dbClient) {
      return prepareResponse(RESP_STATUS_CODES.INTERNAL_ERROR, requestOrigin, { error: getErrorMessage(dbConnectionError, 'unknown error during DB connection') },)
    }

    try {
      const scanCommandForProducts = new ScanCommand({ TableName: DYNAMO_PRODUCTS_TABLE });
      const scanCommandForStocks = new ScanCommand({ TableName: DYNAMO_STOCKS_TABLE });

      const { Items: products = [] } = await dbClient.send(scanCommandForProducts);
      const { Items: stocks = [] } = await dbClient.send(scanCommandForStocks);

      const jointProductsAndStocks = stocks.map(stock => {
        const product = products.find(p => p.id === stock.product_id);
        if (product) {
          return {
            id: product.id,
            count: stock.count,
            price: product.price,
            title: product.title,
            description: product.description
          };
        }
        return null;
      })

      return prepareResponse(RESP_STATUS_CODES.OK, requestOrigin, { products: jointProductsAndStocks });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'unknown error during DB request')

      return prepareResponse(RESP_STATUS_CODES.INTERNAL_ERROR, requestOrigin, { error: errorMessage })
    }
  })
};

export default getProducts;
export const main = middyfy(getProducts);
