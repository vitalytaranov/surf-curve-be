import 'source-map-support/register';
import { Client } from 'pg';
import * as Yup from 'yup';

import { dbOptions } from '../db-options';
import { PGTransaction } from '../../utils';


const newProductSchema = Yup.object().shape({
  title: Yup.string().defined(),
  description: Yup.string(),
  price: Yup.number().min(0).defined(),
  count: Yup.number().min(0),
}).defined();

type NewProduct = Yup.InferType<typeof newProductSchema>;

function formatPayload({ price, count, ...rest }: NewProduct): NewProduct {
  return {
    price: Number(price),
    count: Number.isInteger(+count) ? count : 0,
    ...rest,
  };
}

export const addProductToDb = (payload: NewProduct) => {
  return new Promise(async (resolve, reject) => {
    console.log('@create payload: ', payload);
    const product: NewProduct = formatPayload(payload);
    console.log('PRODUCT: ', product);

    const isValidProduct: boolean = await newProductSchema.isValid(product);
    if (!isValidProduct) {
      reject({ message: 'Invalid request' });
    }

    const client = new Client(dbOptions);
    await client.connect();


    try {
      await client.query(PGTransaction.begin);
      const { title, description, price, count } = product;

      const { rows: products } = await client.query(`
      INSERT INTO products (title, description, price) values
      ($1, $2, $3)
      RETURNING *
    `, [title, description, price]);
      const [newProduct] = products;
      await client.query(`
      INSERT INTO stocks (product_id, count) values
      ($1, $2)
    `, [newProduct.id, count]);

      await client.query(PGTransaction.commit);
      resolve({
        title,
        description,
        price,
        id: newProduct.id,
        count,
      });
    } catch (error) {
      await client.query(PGTransaction.rollback);
      reject({ message: 'Server error' });
    } finally {
      await client.end();
    }
  });
};
