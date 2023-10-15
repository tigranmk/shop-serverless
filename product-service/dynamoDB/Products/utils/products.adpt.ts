import { DynamoDBClient, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidV4 } from 'uuid';
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { CreateProductBody, IProductDBController } from "../types/products";
import { CreateStockBody } from "../types/stocks";

const { WORK_REGION, DYNAMO_PRODUCTS_TABLE, DYNAMO_STOCKS_TABLE } = process.env;
const client = new DynamoDBClient({ region: WORK_REGION });
const dbClientDocument = DynamoDBDocument.from(client);

export const productsDbDynamoAdapter: IProductDBController = {
    async createProducts(products: CreateProductBody[], stocks: CreateStockBody[]) {
        const createProductId = uuidV4();
        const productsWithId = products.map(product => ({
            ...product,
            id: createProductId
        }))

        const stocksWithId = stocks.map(stock => ({
            ...stock,
            product_id: createProductId
        }))

        const productsItems = productsWithId.map(item => ({
            Put: {
                TableName: DYNAMO_PRODUCTS_TABLE,
                Item: {
                    title: { S: item.title },
                    description: { S: item.description },
                    price: { N: item.price.toString() },
                },
                ConditionExpression: 'attribute_not_exists(id)',
            },
        }));

        const stockItems = stocksWithId.map(item => ({
            Put: {
                TableName: DYNAMO_STOCKS_TABLE,
                Item: {
                    count: { N: item.count.toString() },
                },
                ConditionExpression: 'attribute_not_exists(product_id)',
            },
        }));
        

        const transactItems = {
            products: [...productsItems],
            stocks: [...stockItems]
        };

        const params = {
            TransactItems: [
                ...transactItems.products,
                ...transactItems.stocks
            ]
        };

        try {
            await dbClientDocument.send(new TransactWriteItemsCommand(params));
            return {
                products: productsWithId,
                stocks: stocksWithId,
            };
        } catch (e) {
            throw new Error(e);
        }
    }
};
