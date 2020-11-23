import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { addProductToDb } from '../db/product';


export const catalogBatchProcess: APIGatewayProxyHandler = async (event, context) => {
  console.log('@catalogBatchProcess: ', event);

  try {
    await Promise.all(
      event.Records.map((product) => (
        addProductToDb(JSON.parse(product.body)
      ))));
  } catch (error) {
    console.log('ERROR: ', error);
  }
}
