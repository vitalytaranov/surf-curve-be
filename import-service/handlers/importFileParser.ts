import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { S3, SQS } from 'aws-sdk';
import * as csv from 'csv-parser';

import { S3_REGION } from '../utils';


const { BUCKET, SQS_URL } = process.env

function stringify(obj: {}): string {
  return JSON.stringify(obj);
}


async function parseFile(key: string) {
  console.log('@parseFile');
  const s3 = new S3({ region: S3_REGION });
  const copyFrom = `${ BUCKET }/${ key }`;
  const copyTo = key.replace('uploaded', 'parsed');

  await s3.copyObject({
    Bucket: BUCKET,
    CopySource: copyFrom,
    Key: copyTo,
  }).promise();
  console.log(`copied from [${ copyFrom }] to [${ copyTo }]`);

  await s3.deleteObject({
    Bucket: BUCKET,
    Key: key,
  }).promise();
  console.log(`deleted from [${ copyFrom }]`);
}

function sendToQueue(items: Array<any>): void {
  console.log('@sendToQueue');
  const sqs = new SQS();

  items.forEach((product) => {
    const MessageBody = stringify(product);

    sqs.sendMessage({
      QueueUrl: SQS_URL,
      MessageBody,
    }, (error) => {
      if (error) {
        console.log(`SQS error: ${ error }`);
      }
      console.log(`SQS message sent for ${ MessageBody }`);
    });
  });
}

export const importFileParser: APIGatewayProxyHandler = (event, _context) => {
  console.log('event @importFileParser: ', event);

  try {
    const s3 = new S3({ region: S3_REGION });
    console.log('event.Records: ', event.Records);

    event.Records.forEach((record) => {
      const s3ReadStream = s3.getObject({
        Bucket: BUCKET,
        Key: record.s3.object.key,
      }).createReadStream();
      const products = [];

      s3ReadStream
        .pipe(csv())
        .on('data', (chunk) => { products.push(chunk); })
        .on('end', async () => {
          console.log('PRODUCTS: ', products);
          await parseFile(record.s3.object.key);
          sendToQueue(products);
        });
    });
  } catch (error) {
    console.log('error: ', error);
  }
}
