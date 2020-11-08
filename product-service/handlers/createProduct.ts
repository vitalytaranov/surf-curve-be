import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';
import * as Yup from 'yup';

import { dbOptions } from '../db-options';
import { PGTransaction } from '../utils';


const newProductSchema = Yup.object().shape({
  title: Yup.string().defined(),
  description: Yup.string(),
  price: Yup.number().defined(),
  count: Yup.number().default(0),
}).defined();

type NewProduct = Yup.InferType<typeof newProductSchema>;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const createProduct: APIGatewayProxyHandler = async (event) => {
  const payload: NewProduct = JSON.parse(event.body);
  console.log('payload @createProduct: ', payload);

  const isValidPayload: boolean = await newProductSchema.isValid(payload);

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
    const { title, description, price } = payload;

    const { rows: products } = await client.query(`
      INSERT INTO products (title, description, price) values
      ($1, $2, $3)
      RETURNING *
    `, [title, description, price]);
    const [product] = products;
    const count = payload.count || 0;
    await client.query(`
      INSERT INTO stocks (product_id, count) values
      ($1, $2)
    `, [product.id, count]);

    await client.query(PGTransaction.commit);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ...payload, id: product.id, count }),
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
