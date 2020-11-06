import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import products from './data';

export const getProducts: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(products),
  };
}
