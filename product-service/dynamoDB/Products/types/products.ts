import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import { Product, Stock } from "../../../types";

export type CreateProductBody = Omit<Product, 'id'>;
export interface IProductDBController {
    createProducts: (
        products: CreateProductBody[], 
        document?: DynamoDBDocument, 
        tableName?: string
    ) => Promise<{
        products: Product[],
        stocks: Stock[],
    }>
}