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

export const catalogBatchProcess: APIGatewayProxyHandler = async (event) => {
  console.log('@catalogBatchProcess: ', event);

  try {
    await Promise.all(
      event.Records.map(async (product) => {
        try {
          const parsedProduct = JSON.parse(product.body);
          await addProductToDb(parsedProduct);
          await sendNotification(product.body);
          console.log(`product has been processed`);
        } catch (error) {
          console.log(error);
        }
      }));
  } catch (error) {
    console.log('ERROR: ', error);
  }
}
