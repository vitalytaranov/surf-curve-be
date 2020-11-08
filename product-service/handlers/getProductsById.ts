import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';

import { dbOptions } from '../db-options';
import { PGTransaction } from '../utils';


export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
  console.log('pathParameters @getProductsById: ', event.pathParameters);

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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(product),
    };
  } catch (error) {
    await client.query(PGTransaction.rollback);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  } finally {
    await client.end();
  }
}
