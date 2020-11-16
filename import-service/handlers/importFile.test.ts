import { S3 } from 'aws-sdk';

import { importFile } from './importFile';
import { headers } from '../../utils';


jest.mock('aws-sdk');

describe('Import File', () => {
  const MockS3 = S3;
  const fileName = 'test.csv';

  it('should respond with a signed link', async () => {
    const expectedUrl = 'url';
    const mockGetSignedUrlPromise = jest.fn(() => {
      return Promise.resolve(expectedUrl);
    });
    MockS3.mockImplementationOnce(() => ({
      getSignedUrlPromise: mockGetSignedUrlPromise
    }));
    const event = ({ queryStringParameters: { name: fileName } });
    const result = await importFile(event, undefined, undefined);

    expect(mockGetSignedUrlPromise).toHaveBeenCalledWith('putObject', {
      Bucket: 'surf-curve-storage',
      Key: `uploaded/${ fileName }`,
      Expires: 60,
      ContentType: 'text/csv',
    });
    expect(mockGetSignedUrlPromise).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      statusCode: 200,
      headers,
      body: JSON.stringify(expectedUrl),
    });
  });

  it('should respond with 500 status code in case of any error', async () => {
    const expectedUrl = 'url';
    const mockGetSignedUrlPromise = jest.fn(() => {
      return Promise.reject(expectedUrl);
    });
    MockS3.mockImplementationOnce(() => ({
      getSignedUrlPromise: mockGetSignedUrlPromise
    }));
    const event = ({ queryStringParameters: { name: fileName } });
    const result = await importFile(event, undefined, undefined);

    expect(mockGetSignedUrlPromise).toHaveBeenCalledWith('putObject', {
      Bucket: 'surf-curve-storage',
      Key: `uploaded/${ fileName }`,
      Expires: 60,
      ContentType: 'text/csv',
    });
    expect(mockGetSignedUrlPromise).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Server error' }),
    });
  });
});