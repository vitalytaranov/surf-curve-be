import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { S3 } from 'aws-sdk';


const { BUCKET } = process.env

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const importFile: APIGatewayProxyHandler = async (event, _context) => {
  console.log('queryStringParameters @importFile: ', event.queryStringParameters);

  try {
    const { name } = event.queryStringParameters;
    const s3 = new S3({ region: 'eu-west-1' });
    const params = {
      Bucket: BUCKET,
      Key: `uploaded/${ name }`,
      ContentType: "text/csv",
      Expires: 60,
    };

    const url = await s3.getSignedUrlPromise('putObject', params);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' }),
    };
  }
}
