import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { S3 } from 'aws-sdk';

import { S3_REGION } from '../utils';
import { response } from '../../utils';


const { BUCKET } = process.env

export const importFile: APIGatewayProxyHandler = async (event, _context) => {
  console.log('queryStringParameters @importFile: ', event.queryStringParameters);

  try {
    const { name } = event.queryStringParameters;
    const s3 = new S3({ region: S3_REGION });
    const params = {
      Bucket: BUCKET,
      Key: `uploaded/${ name }`,
      ContentType: 'text/csv',
      Expires: 60,
    };

    const url = await s3.getSignedUrlPromise('putObject', params);

    return response(200, {
      body: url,
    });
  } catch (error) {
    return response(500, {
      body: { message: 'Server error' },
    });
  }
}
