import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { S3 } from 'aws-sdk';
import * as csv  from 'csv-parser';


const { BUCKET } = process.env


export const importFileParser: APIGatewayProxyHandler = async (event, _context) => {
  console.log('event @importFileParser: ', event);

  try {
    const s3 = new S3({ region: 'eu-west-1' });

    for (const record of event.Records) {
      console.log('record.s3.object: ', record.s3.object);
      const readStream = s3.getObject({
        Bucket: BUCKET,
        Key: record.s3.object.key,
      }).createReadStream();

      const result = [];
      readStream
        .pipe(csv())
        .on('data', (data) => result.push(data))
        .on('end', async () => {

          await s3.copyObject({
            Bucket: BUCKET,
            CopySource: `${ BUCKET }/${ record.s3.object.key }`,
            Key: record.s3.object.key.replace('uploaded', 'parsed'),
          });

          await s3.deleteObject({
            Bucket: BUCKET,
            Key: record.s3.object.key,
          }).promise();

          console.log(`File ${ record.s3.object.key.split('/')[1] } has been parsed`);
        });
    }

  } catch (error) {
    console.log('ERROR: ', error);
  }
}
