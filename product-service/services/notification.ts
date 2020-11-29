import { SNS } from 'aws-sdk';

const { SNS_TOPIC_ARN } = process.env;

export function sendNotification(message: string, isError: boolean) {
  const sns = new SNS({region: 'eu-west-1'});
  return sns.publish({
    Subject: isError ? 'New product was not added' : 'New product was added',
    Message: message,
    TopicArn: SNS_TOPIC_ARN,
    MessageAttributes: {
      isError: {
        DataType: 'String',
        StringValue: isError ? 'true' : 'false',
      },
    },
  }).promise();
}