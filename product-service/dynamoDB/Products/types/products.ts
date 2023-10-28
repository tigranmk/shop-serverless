import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import { Product, Stock } from "../../../types";
import { CreateStockBody } from "./stocks";

export type CreateProductBody = Omit<Product, 'id'>;
export interface IProductDBController {
    createProducts: (
        products: CreateProductBody[], 
        stocks: CreateStockBody[],
        document?: DynamoDBDocument, 
        tableName?: string
    ) => Promise<{
        products: Product[],
        stocks: Stock[],
    }>
}