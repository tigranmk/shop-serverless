import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { raspberryPiModels, raspberryPiModelsStocks } from '../src/mocks/mocks';
import { productsDbDynamoAdapter } from "../dynamoDB/Products/utils/products.adpt";
import { stocksDbDynamoAdapter } from "../dynamoDB/Products/utils/stocks.adpt";


const client = new DynamoDBClient({ region: 'us-west-1' });
const dbClient = DynamoDBDocument.from(client);

export const fillProductsWithStocks = async () => {
    try {
        const result = await productsDbDynamoAdapter.createProducts(raspberryPiModels, raspberryPiModelsStocks, dbClient, 'PRODUCTS')
        console.log(result)
    } catch (e) {
        console.log('something went wrong during update:', e)
    }
}

export const fillStocksTable = async () => {
    try {
        const result = await stocksDbDynamoAdapter.createStocks(raspberryPiModelsStocks, dbClient, 'STOCKS')
        console.log(result)
    } catch (e) {
        console.log('something went wrong during update:', e)
    }
}

fillProductsWithStocks();