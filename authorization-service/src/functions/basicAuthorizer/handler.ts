import { Effect, decodeBase64, generateResponse } from 'src/utils';

const basicAuthorizer = async (event, _context, callback) => {
  const { headers, methodArn } = event;
  const authorizationHeader = headers.Authorization;
  if (!authorizationHeader) return callback("Unauthorized");;

  const encodedCreds = authorizationHeader.split(' ')[1];
  const decodedCredentials = decodeBase64(encodedCreds);
  const [username, password] = decodedCredentials.split('=');

  const isAuthorized = username === process.env.ACCOUNT_LOGIN && password === process.env.ACCOUNT_PASSWORD;
  if (!isAuthorized) return callback(null, generateResponse(undefined, Effect.Deny, methodArn));;

  const policy = generateResponse(username, isAuthorized ? Effect.Allow : Effect.Deny, methodArn);
  callback(null, policy);
};

export const main = basicAuthorizer;
