import { formatJSONResponse } from '@libs/api-gateway';
import importFileParser from '../importFileParser/handler';
import * as AWSMock from "aws-sdk-mock"
import AWS from 'aws-sdk';

jest.mock('@libs/api-gateway');
jest.mock('@utils/constants');
jest.mock('@utils/messages');

describe('importFileParser', () => {
  let event;

  beforeEach(() => {
    event = {
      headers: {
        origin: 'example.com',
      },
      queryStringParameters: {
        name: 'example.csv',
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return success response if queryStringParameters are present', async () => {
    const mockSignedUrl = 'example_signed_url';
    const mockFormatJSONResponse = jest.fn();

    AWSMock.setSDKInstance(AWS);

    AWSMock.mock('S3', 'putObject', function (params, callback) {
      console.log(params);
      callback(null);
    });

    AWSMock.mock('S3', 'getSignedUrl', function (params) {
      console.log(params);
    });

    (formatJSONResponse as jest.Mock).mockReturnValueOnce(mockFormatJSONResponse);

    const response = await importFileParser(event);

    expect(formatJSONResponse).toHaveBeenCalledWith(
      200,
      event.headers.origin,
      {
        message: 'example.csv',
        url: mockSignedUrl,
      }
    );
    expect(response).toBe(mockFormatJSONResponse);
  });

  it('should return error response if queryStringParameters are not present', async () => {
    event.queryStringParameters = null;
    const mockFormatJSONResponse = jest.fn();

    (formatJSONResponse as jest.Mock).mockReturnValueOnce(mockFormatJSONResponse);

    const response = await importFileParser(event);

    expect(formatJSONResponse).toHaveBeenCalledWith(
      400,
      event.headers.origin,
      { message: 'Bad Request' }
    );
    expect(response).toBe(mockFormatJSONResponse);
  });
});
