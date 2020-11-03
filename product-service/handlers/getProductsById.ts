import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { getProductById } from '../src/controllers/products';

export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const { productId } = event.pathParameters;
    const product = await getProductById(productId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({ error }),
    };
  }
}
