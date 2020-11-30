import { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';
import 'source-map-support/register';

const effect = {
  ALLOW: 'Allow',
  DENY: 'Deny',
} as const;
type Effect = typeof effect[keyof typeof effect];

const { USERNAME, PASSWORD } = process.env;


function generatePolicy(principal: string, effect: Effect, arn: string) {
  return {
    principalId: principal,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: arn,
        },
      ],
    },
  };
}

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (
  event
) => {
  console.log('INPUT: ', event);
  if (event.type !== 'TOKEN') {
    throw new Error('Unauthorized');
  }

  try {
    const token = event.authorizationToken;
    const encodedCreds = token.split(' ')[1];
    const plainCreds = Buffer.from(encodedCreds, 'base64').toString('utf-8');
    console.log('creds: ', plainCreds);
    const [username, password] = plainCreds.split(':');

    const resultEffect = (username === USERNAME && password === PASSWORD ? effect.ALLOW : effect.DENY);
    return generatePolicy(encodedCreds, resultEffect, event.methodArn);
  } catch {
    throw new Error('Unauthorized');
  }
};