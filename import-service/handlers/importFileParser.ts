import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { S3 } from 'aws-sdk';
import * as csv from 'csv-parser';


const { BUCKET } = process.env


export const importFileParser: APIGatewayProxyHandler = async (event, _context) => {
  console.log('event @importFileParser: ', event);

  try {
    const s3 = new S3({ region: 'eu-west-1' });
    console.log('event.Records: ', event.Records);

    event.Records.forEach((record) => {
      console.log('record.s3.object: ', record.s3.object);
      const s3ReadStream = s3.getObject({
        Bucket: BUCKET,
        Key: record.s3.object.key,
      }).createReadStream();

      s3ReadStream
        .pipe(csv())
        .on('data', (chunk) => { console.log('parsed chunk: ', chunk) })
        .on('end', async () => {
          const copyFrom = `${ BUCKET }/${ record.s3.object.key }`;
          const copyTo = record.s3.object.key.replace('uploaded', 'parsed');

          await s3.copyObject({
            Bucket: BUCKET,
            CopySource: copyFrom,
            Key: copyTo,
          }).promise();
          console.log(`copied from [${ copyFrom }] to [${ copyTo }]`);

          await s3.deleteObject({
            Bucket: BUCKET,
            Key: record.s3.object.key,
          }).promise();
          console.log(`deleted from [${ copyFrom }]`);
        });
    });

  } catch (error) {
    console.log('error: ', error);
  }
}
