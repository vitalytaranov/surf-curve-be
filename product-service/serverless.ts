import type { Serverless } from 'serverless/aws';


const dotenv = require('dotenv').config({
  path: './.env'
});
const { SNS_SUB_EMAIL } = dotenv.parsed;


const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SNS_TOPIC_ARN: {
        Ref: 'SNSTopic',
      },
      // create ".env" file to pass env variables to connect to DB
      // PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [
          {
            'Fn::GetAtt': ['SQSQueue', 'Arn'],
          },
        ],
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: [
          {
            Ref: 'SNSTopic',
          },
        ],
      },
    ],
  },
  resources: {
    Outputs: {
      SQSQueueUrl: {
        Value: {
          Ref: 'SQSQueue',
        },
      },
      SQSQueueArn: {
        Value: {
          'Fn::GetAtt': ['SQSQueue', 'Arn'],
        },
      },
      SNSTopicARN: {
        Value: {
          Ref: 'SNSTopic',
        },
      },
    },
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogBatchProcessQueue',
        },
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic',
        },
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: SNS_SUB_EMAIL,
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic',
          },
          FilterPolicy: {
            status: ['OK'],
          },
        }
      },
    },
  },
  functions: {
    getProductsList: {
      handler: 'handler.getProductsList',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true,
          }
        }
      ]
    },
    getProductsById: {
      handler: 'handler.getProductsById',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{productId}',
            cors: true,
          }
        }
      ]
    },
    createProduct: {
      handler: 'handler.createProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: true,
          }
        }
      ]
    },
    deleteProduct: {
      handler: 'handler.deleteProduct',
      events: [
        {
          http: {
            method: 'delete',
            path: 'products/{productId}',
            cors: true,
          }
        }
      ]
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            batchSize: 2,
            arn: {
              'Fn::GetAtt': ['SQSQueue', 'Arn'],
            },
          },
        },
      ],
    },
  }
}

module.exports = serverlessConfiguration;
