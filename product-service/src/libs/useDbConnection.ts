import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

export const useDbConnection = async <R>(
  connectionConfig: { region: string; },
  callback: (error: Error | null, dbClient: DynamoDBDocument | null) => Promise<R>) => {
  const { region } = connectionConfig;
  let client: DynamoDBClient | null = null;
  let dbClient: DynamoDBDocument | null = null;
  let connectionError: Error | null = null;

  try {
    client = new DynamoDBClient({ region });
    dbClient = DynamoDBDocument.from(client);
  } catch (error: unknown) {
    connectionError = error instanceof Error ? error : new Error('error during DB connection')
  } finally {
    const result = await callback(connectionError, dbClient)
    client.destroy()

    return result;
  }
}