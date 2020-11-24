import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { SNS } from 'aws-sdk';

import { addProductToDb } from '../db/product';

const { SNS_TOPIC_ARN } = process.env;

type Notification = 'SUCCESS' | 'FAILURE';

function sendNotification(message: string, type: Notification) {
  console.log('@sendNotification');

  const sns = new SNS({ region: 'eu-west-1' });
  return sns.publish({
    Subject: type === 'SUCCESS' ? 'Product was added' : 'Product was not added',
    Message: message,
    TopicArn: SNS_TOPIC_ARN,
    MessageAttributes: {
      status: {
        DataType: 'String',
        StringValue: type,
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
          await sendNotification(product.body, 'SUCCESS');
          console.log(`product has been processed`);
        } catch (error) {
          console.log(error);
          await sendNotification(product.body, 'FAILURE');
        }
      }));
  } catch (error) {
    console.log('ERROR: ', error);
  }
}
