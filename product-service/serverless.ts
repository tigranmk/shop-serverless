import type { AWS } from '@serverless/typescript';

import getProducts from '@functions/getProducts';
import getProductsById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';
import createBatchProcess from '@functions/catalogBatchProcess';


const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild', 'serverless-webpack'],
  provider: {
    name: 'aws',
    region: 'us-west-1',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DYNAMO_PRODUCTS_TABLE: 'PRODUCTS',
      DYNAMO_STOCKS_TABLE: 'STOCKS',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SNS_REGION: 'us-west-1',
      SQS_QUEUE_URL: { Ref: "catalogItemsQueue" },
      SNS_TOPIC_ARN: { Ref: "createProductTopic" },
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem"
        ],
        Resource: "*",
      },
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: { "Fn::GetAtt": ["catalogItemsQueue", "Arn"] },
      },
      {
        Effect: "Allow",
        Action: "sns:*",
        Resource: { Ref: "createProductTopic" },
      },
    ],
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalogItemsQueue",
        },
      },
      createProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "createProductTopic",
        },
      },
      createProductSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Protocol: "email",
          Endpoint: "tigran_mkrtchyan@epam.com",
          FilterPolicy: {
            productsAmount: [{ numeric: ["<", 2] }],
          },
          TopicArn: {
            Ref: "createProductTopic",
          },
        },
      },
      filterSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Protocol: "email",
          FilterPolicy: {
            productsAmount: [{ numeric: [">", 2] }],
          },
          Endpoint: 'tgnmkrtchyan@gmail.com',
          TopicArn: {
            Ref: "createProductTopic",
          },
        },
      },
      "products": {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:provider.environment.DYNAMO_PRODUCTS_TABLE}",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S"
            },
          ],
          KeySchema: [{
            AttributeName: "id",
            KeyType: "HASH"
          }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        }
      },
      "stocks": {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:provider.environment.DYNAMO_STOCKS_TABLE}",
          AttributeDefinitions: [
            {
              AttributeName: "product_id",
              AttributeType: "S"
            },
          ],
          KeySchema: [{
            AttributeName: "product_id",
            KeyType: "HASH"
          }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        }
      }
    }

  },
  functions: { getProducts, getProductsById, createProduct, createBatchProcess },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    webpack: {
      excludeFiles: '**/*.spec.ts'
    }
  },
};

module.exports = serverlessConfiguration;
