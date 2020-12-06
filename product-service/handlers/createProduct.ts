import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { addProductToDb } from '../db/product';
import {ErrorType} from "../utils";


const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};


export const createProduct: APIGatewayProxyHandler = async (event) => {
  const product = await addProductToDb(JSON.parse(event.body));

  try {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: error?.type === ErrorType.client ? 400 : 500,
      headers,
      body: JSON.stringify({ message: error.message }),
    };
  }
}
