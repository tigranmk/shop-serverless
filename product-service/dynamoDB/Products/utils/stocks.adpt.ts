import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { IStockDBController, CreateStockBody } from "../types/stocks";


const { WORK_REGION, DYNAMO_STOCKS_TABLE } = process.env;
const client = new DynamoDBClient({ region: WORK_REGION });
const dbClientDocument = DynamoDBDocument.from(client);

export const stocksDbDynamoAdapter: IStockDBController = {
    async createStocks(stockList: CreateStockBody[], document?: DynamoDBDocument, tableName?: string) {
        const dbDocumentToUse = document ? document : dbClientDocument;
        const tableToUse = tableName ? tableName : DYNAMO_STOCKS_TABLE;

        const stocksItems = stockList.map(item => ({
            Put: {
                TableName: tableToUse || '',
                Item: {
                    ...item,
                },
                ConditionExpression: 'attribute_not_exists(product_id)',
            }
        }));

        try {
            await dbDocumentToUse.send(
                new TransactWriteCommand({
                    TransactItems: stocksItems
                })
            );
            return {
                stocksCreatedCount: stocksItems?.length ?? 0,
            };
        } catch (e) {
            throw new Error(e)
        }
    }
}