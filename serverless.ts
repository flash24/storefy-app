import type { AWS } from '@serverless/typescript';
// DynamoDB
import dynamoDbTables from '@configs/dynamodb-tables';
import product from '@functions/product';
import order from '@functions/order';

const serverlessConfiguration: AWS = {
  service: 'aws-lambda',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb-local', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      REGION: '${self:custom.region}',
      STAGE: '${self:custom.stage}',
      PRODUCT_TABLE: '${self:custom.product_table}',
      ORDER_TABLE: '${self:custom.order_table}',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
            'dynamodb:DescribeTable',
            'dynamodb:Query',
            'dynamodb:Scan',
            'dynamodb:GetItem',
            'dynamodb:PutItem',
            'dynamodb:UpdateItem',
            'dynamodb:DeleteItem'
        ],
        Resource: [
          {"Fn::GetAtt": [ 'ProductTable', 'Arn' ]},
          {"Fn::GetAtt": [ 'OrderTable', 'Arn' ]},
        ]
      }
    ]
  },
  // import the function via paths
  functions: { ...product, ...order},
  resources: { Resources: dynamoDbTables },
  package: { individually: true },
  custom: {
    region: '${opt:region, self:provider.region}',
    stage: '${opt:stage, self:provider.stage}',
    product_table: '${self:service}-product-table-${opt:stage, self:provider.stage}',
    order_table: '${self:service}-order-table-${opt:stage, self:provider.stage}',
    table_throughputs: {
      prod: 5,
      default: 1,
    },
    table_throughput: '${self:custom.TABLE_THROUGHPUTS.${self:custom.stage}, self:custom.table_throughputs.default}',
    dynamodb: {
      stages: ['dev'],
      start: {
        port: 8000,
        inMemory: true,
        heapInitial: '200m',
        heapMax: '1g',
        migrate: true,
        seed: true,
        convertEmptyValues: true,
        // Uncomment only if you already have a DynamoDB running locally
        // noStart: true
      }
    },
    ['serverless-offline']: {
      httpPort: 3000,
      babelOptions: {
        presets: ["env"]
      }
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
