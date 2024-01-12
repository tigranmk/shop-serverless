import { PolicyDocument } from 'aws-lambda';

export enum Effect {
    Allow = 'Allow',
    Deny = 'Deny'
}

export const generateDocument = (effect: Effect, resource: string): PolicyDocument => {
    return {
        Version: '2012-10-17',
        Statement: [{
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource
        }]
    }
}

export const generateResponse = (principalId, effect: Effect, resource: string) => {
    return {
        principalId,
        policyDocument: generateDocument(effect, resource)
    }
}

export const decodeBase64 = (encodedString) => {
    return Buffer.from(encodedString, 'base64').toString('utf-8');
  };