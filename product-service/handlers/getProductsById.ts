import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import axios from "axios";
import { DATABASE_ENDPOINT } from "../utils";

export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const { productId } = event.pathParameters;
    const response = await axios.get(`${ DATABASE_ENDPOINT }/products`);
    const { data: products } = response;
    let product;

    if (products && products.length) {
      product = products.find(product => product.id === Number(productId));
    }

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
