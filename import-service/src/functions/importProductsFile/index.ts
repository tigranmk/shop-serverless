import { handlerPath } from '@libs/handler-resolver';
import 'dotenv/config'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        authorizer: {
          arn: process.env.AUTHORIZER_ARN,
          type: 'request'
        }
      },
    },
  ],
};
