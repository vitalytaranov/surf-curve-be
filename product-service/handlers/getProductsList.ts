import axios from 'axios';
import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { DATABASE_ENDPOINT } from '../utils'


export const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    const response = await axios.get(`${ DATABASE_ENDPOINT }/products`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({ error }),
    };
  }
}
