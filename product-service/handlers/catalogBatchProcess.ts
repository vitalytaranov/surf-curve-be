import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { SNS } from 'aws-sdk';

import { addProductToDb } from '../db/product';

const { SNS_TOPIC_ARN } = process.env;

function sendNotification(message: string, isError: boolean) {
  console.log('@sendNotification');

  const sns = new SNS({ region: 'eu-west-1' });
  return sns.publish({
    Subject: isError ? 'New product was not added' : 'New product was added',
    Message: message,
    TopicArn: SNS_TOPIC_ARN,
    MessageAttributes: {
      isError: {
        DataType: 'String',
        StringValue: isError ? 'true' : 'false',
      },
    },
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
          await sendNotification(product.body, false);
          console.log(`product has been processed`);
        } catch (error) {
          console.log(error);
          await sendNotification(product.body, true);
        }
      }));
  } catch (error) {
    console.log('ERROR: ', error);
  }
}
