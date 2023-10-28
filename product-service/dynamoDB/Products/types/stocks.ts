import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import { Stock } from "../../../types";

export type CreateStockBody = Omit<Stock, 'product_id'>;

export interface IStockDBController {
    createStocks: (
        products: CreateStockBody[], 
        document?: DynamoDBDocument, 
        tableName?: string
    ) => Promise<{
        stocksCreatedCount: number
    }>
}