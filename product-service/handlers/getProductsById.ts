import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import products from '../src/products';

export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const { productId } = event.pathParameters;
    const product = products.find(product => product.id === Number(productId));

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({ error }),
    };
  }
}
