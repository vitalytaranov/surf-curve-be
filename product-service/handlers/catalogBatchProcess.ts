import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { SNS } from 'aws-sdk';

import { addProductToDb } from '../db/product';

const { SNS_TOPIC_ARN } = process.env;

function sendNotification(message: string) {
  console.log('@sendNotification');

  const sns = new SNS({ region: 'eu-west-1' });
  return sns.publish({
    Subject: 'New product added',
    Message: message,
    TopicArn: SNS_TOPIC_ARN,
  }).promise();
}

export const catalogBatchProcess: APIGatewayProxyHandler = async (event, context) => {
  console.log('@catalogBatchProcess: ', event);

  try {
    await Promise.all(
      event.Records.map(async (product) => {
        try {
          await addProductToDb(JSON.parse(product.body));
          await sendNotification(product.body);
        } catch (error) {
          console.log('ERROR: ', error);
        }
      }));
  } catch (error) {
    console.log('ERROR: ', error);
  }
}
