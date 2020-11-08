import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';

import { dbOptions } from '../db-options';
import { PGTransaction } from '../utils';


export const getProductsList: APIGatewayProxyHandler = async (event) => {
  console.log('event @getProductsList: ', event);

  const client = new Client(dbOptions);
  await client.connect();

  try {
    await client.query(PGTransaction.begin);
    const { rows: products } = await client.query(`
      SELECT id, count, price, title, description FROM products
      INNER JOIN stocks s ON products.id = s.product_id
    `);

    await client.query(PGTransaction.commit);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(products),
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
