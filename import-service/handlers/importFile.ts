import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { S3 } from 'aws-sdk';


const { BUCKET } = process.env

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const importFile: APIGatewayProxyHandler = async (event, _context) => {
  console.log('pathParameters @getProductsById: ', event.pathParameters);

  try {
    const { fileName } = event.pathParameters;
    const s3 = new S3({ region: 'eu-west-1', signatureVersion: 'v4' });
    const params = {
      Bucket: BUCKET,
      Key: `uploaded/${ fileName }`,
      ContentType: "text/csv",
      Expires: 60,
    };
    console.log('params: ', params);

    const response = await s3.getSignedUrl('putObject', params);
    console.log('response: ', response);
    // const files = s3Response.Contents;
    // const body = files
    //   .filter(file => file.Size)
    //   .map(file => `https://${ BUCKET }.s3.amazonaws.com/${ file.Key }`);
    // console.log('BODY: ', body);

    return {
      statusCode: 200,
      headers,
      body: response,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' }),
    };
  } finally {

  }
}
