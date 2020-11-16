import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';
import validator from 'validator';

import { dbOptions } from '../db-options';
import { PGTransaction } from '../../utils';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
  console.log('pathParameters @getProductsById: ', event.pathParameters);

  if (event.pathParameters && !validator.isUUID(event.pathParameters.productId)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Invalid request, please provide a valid uuid' }),
    };
  }

  const client = new Client(dbOptions);
  await client.connect();

  try {
    await client.query(PGTransaction.begin);
    const { productId } = event.pathParameters;
    const { rows: products } = await client.query(`
      SELECT id, count, price, title, description FROM products
      INNER JOIN stocks s ON (products.id = s.product_id AND s.product_id = $1)
    `, [productId]);
    const [product] = products;

    await client.query(PGTransaction.commit);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(product),
    };
  } catch (error) {
    await client.query(PGTransaction.rollback);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' }),
    };
  } finally {
    await client.end();
  }
}
