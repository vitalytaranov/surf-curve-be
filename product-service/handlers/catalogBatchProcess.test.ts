import { catalogBatchProcess} from './catalogBatchProcess';
import { addProductToDb } from '../db/product';
import { sendNotification } from '../services/notification';

jest.mock('aws-sdk');
jest.mock('../db/product');
jest.mock('../services/notification');

describe('catalogBatchProcess', () => {
  it('should log error if product is not valid', async () => {
    const product = { title: 'surf', price: -999 };
    const consoleSpy = jest.spyOn(console, 'log');
    addProductToDb.mockImplementationOnce(() => Promise.reject());

    await catalogBatchProcess({
      Records: [{ body: JSON.stringify(product) }],
    }, undefined, undefined);

    expect(consoleSpy).toHaveBeenCalledWith('product has not been processed');
  });

  it('should log success message', async () => {
    const product = { title: 'surf', price: 1000, count: 0, description: 'desc' };
    const consoleSpy = jest.spyOn(console, 'log');
    addProductToDb.mockImplementationOnce(() => Promise.resolve());
    sendNotification.mockImplementationOnce(() => Promise.resolve());

    await catalogBatchProcess({
      Records: [{ body: JSON.stringify(product) }],
    }, undefined, undefined);

    expect(consoleSpy).toHaveBeenCalledWith('product has been processed');
  });
});