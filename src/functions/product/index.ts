import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';
const functions = {
  createProduct : {
    handler: `${handlerPath(__dirname)}/handler.createSL`,
    events: [
      {
        http: {
          method: 'post',
          path: 'product/create',
          request: {
            schemas: {
              'application/json': schema
            }
          }
        }
      }
    ]
  },
  readProduct : {
    handler: `${handlerPath(__dirname)}/handler.readSL`,
    events: [
      {
        http: {
          method: 'get',
          path: 'product',
          request: {
            schemas: {
              'application/json': schema
            }
          }
        }
      }
    ]
  },
  readProducts : {
    handler: `${handlerPath(__dirname)}/handler.readSL`,
    events: [
      {
        http: {
          method: 'get',
          path: 'product/list',
          request: {
            schemas: {
              'application/json': schema
            }
          }
        }
      }
    ]
  }
}
export default functions
