import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';
import * as Yup from 'yup';

import { dbOptions } from '../db-options';
import { PGTransaction } from '../utils';

const deleteProductSchema = Yup.object().shape({
  productId: Yup.string().defined(),
}).defined();

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const deleteProduct: APIGatewayProxyHandler = async (event) => {
  console.log('pathParameters @deleteProduct: ', event.pathParameters);

  const isValidPayload: boolean = await deleteProductSchema.isValid(event.pathParameters);

  if (!isValidPayload) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Invalid request' }),
    };
  }

  const client = new Client(dbOptions);
  await client.connect();

  try {
    await client.query(PGTransaction.begin);
    const { productId } = event.pathParameters;
    const { rows: products } = await client.query(`
      DELETE FROM products
      WHERE id = $1
      RETURNING *
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
      headers,
      body: JSON.stringify({ message: error }),
    };
  } finally {
    await client.end();
  }
}
