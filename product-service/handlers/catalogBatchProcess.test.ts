import { catalogBatchProcess } from './catalogBatchProcess';


jest.mock('aws-sdk');

describe('catalogBatchProcess', () => {
  it('should log error if product is not valid', async () => {
    const product = { title: 'surf', price: -999 };
    const consoleSpy = jest.spyOn(console, 'log');

    await catalogBatchProcess({
      Records: [{ body: JSON.stringify(product) }],
    }, undefined, undefined);

    expect(consoleSpy).toHaveBeenCalledWith(`error when processing ${ product.title }`);
  });
});