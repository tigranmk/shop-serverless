import { expect, jest, test, beforeAll, afterAll, describe } from '@jest/globals';
import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";
import { SQSEvent } from "aws-lambda";
import { createBatchProcess } from './handler';

jest.mock('src/dynamodb/product.adpt', () => ({
  productsDbDynamoAdapter: {
    createProducts: jest.fn(() => 'products')
  }
}));

const mockEvent = {
  Records: [
    {
      messageId: "1",
      body: JSON.stringify({
        title: "rasberry",
        description: "PII",
        price: 100,
        count: 12,
      }),
    },
    {
      messageId: "2",
      body: JSON.stringify({
        title: "rasberryT",
        description: "Pii+",
        price: 29,
        count: 21,
      }),
    },
  ],
};

const env = process.env;

beforeAll((done) => {
  process.env = { ...env, SNS_ARN: "arn::test" };
  done();
});

afterAll(() => {
  process.env = env;
});

describe("catalogBatchProcess", () => {
  test("should push items from SQS to SNS", async () => {
    const mockPublishToSNS = jest.fn().mockImplementation(() => {
      console.log("SNS", "tranpublishsactWrite", "mock called");
    });
    const mockTransactWrite = jest.fn().mockImplementation(() => {
      console.log("DynamoDB.DocumentClient", "transactWrite", "mock called");
    });
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock("DynamoDB.DocumentClient", "transactWrite", mockTransactWrite);
    AWSMock.mock("SNS", "publish", mockPublishToSNS);

    await createBatchProcess(mockEvent as unknown as SQSEvent);

    expect(mockTransactWrite).toBeCalled();
    expect(mockPublishToSNS).toBeCalled();
  });
});