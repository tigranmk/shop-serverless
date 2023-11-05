import { SQSEvent } from "aws-lambda";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { CreateProductBody } from "dynamoDB/Products/types/products";
import { productsDbDynamoAdapter } from "dynamoDB/Products/utils/products.adpt";

const { SNS_REGION, SNS_TOPIC_ARN } = process.env;

export const createBatchProcess = async (event: SQSEvent) => {

  try {
    const records = event.Records;
    const recordsLength = records.length;

    if (recordsLength === 0) {
      throw new Error();
    }
    console.log('productRecords', records)
    const productRecords: CreateProductBody[] = JSON.parse(records[0].body);
    console.log('productRecords', productRecords)
    
    await productsDbDynamoAdapter.createProducts(productRecords);
    console.log('createBatchProcess completed');

    const snsClient = new SNSClient({ region: SNS_REGION });
    const command = new PublishCommand({
      TopicArn: SNS_TOPIC_ARN,
      Subject: "Products added successfully",
      Message: `${productRecords.length} Products added`,
      MessageAttributes: {
        productsAmount: { DataType: 'Number', StringValue: productRecords.length.toString() },
      }
    });
    const response = await snsClient.send(command);
    console.log('Sent email notification', response);
  } catch (e) {
    console.log(e)
  }
}

export const main = createBatchProcess;