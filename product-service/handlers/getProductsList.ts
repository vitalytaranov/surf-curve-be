import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import products from '../src/products';

export const getProductsList: APIGatewayProxyHandler = async (event, _context) => {
  console.log('event: ', event);
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({ error }),
    };
  }
}
