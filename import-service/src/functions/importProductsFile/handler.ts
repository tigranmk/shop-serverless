import { formatJSONResponse } from '@libs/api-gateway';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { middyfy } from '@libs/lambda';

import { RESPONSE_STATUS_CODES } from '@utils/constants';
import { APIGatewayProxyEvent } from 'aws-lambda';


const { BUCKET_REGION } = process.env;

const importFileParser = async (event: APIGatewayProxyEvent) => {
  const requestOrigin = event.headers.origin || '';

  const { queryStringParameters } = event || {};
  if (queryStringParameters && queryStringParameters.name) {
    const { name } = queryStringParameters
    const s3client = new S3Client({
      region: BUCKET_REGION,
    });

    const command = new PutObjectCommand({
      Bucket: 'bucket-for-uploading-files',
      Key: `uploaded/${name}`,
      ContentType: 'text/csv'
    })

    const url = await getSignedUrl(s3client, command)
    return formatJSONResponse(RESPONSE_STATUS_CODES.OK,
      requestOrigin,
      {
        message: `${name}`,
        url
      }
    );
  } else {
    return formatJSONResponse(
      RESPONSE_STATUS_CODES.BAD_REQUEST,
      requestOrigin,
      { message: `Bad Request` }
    );
  }
};

export const main = middyfy(importFileParser);
