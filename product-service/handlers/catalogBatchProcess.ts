import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { addProductToDb } from '../db/product';
import { sendNotification } from '../services/notification';

export const catalogBatchProcess: APIGatewayProxyHandler = async (event) => {
  try {
    await Promise.all(
      event.Records.map(async (product) => {
        try {
          const parsedProduct = JSON.parse(product.body);
          await addProductToDb(parsedProduct);
          await sendNotification(product.body, false);
          console.log(`product has been processed`);
        } catch (error) {
          console.log(`product has not been processed`);
          await sendNotification(product.body, true);
        }
      }));
  } catch (error) {
    console.log('ERROR: ', error);
  }
}
