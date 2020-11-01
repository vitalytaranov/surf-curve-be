import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { getAllProducts } from '../src/controllers/products';

export const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    const products = await getAllProducts();
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
