import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';
const functions = {
  createOrder : {
    handler: `${handlerPath(__dirname)}/handler.createSL`,
    events: [
      {
        http: {
          method: 'post',
          path: 'order',
          request: {
            schemas: {
              'application/json': schema
            }
          }
        }
      }
    ]
  },
  readOrder : {
    handler: `${handlerPath(__dirname)}/handler.readSL`,
    events: [
      {
        http: {
          method: 'get',
          path: 'order',
          request: {
            schemas: {
              'application/json': schema
            }
          }
        }
      }
    ]
  },
  readOrders: {
    handler: `${handlerPath(__dirname)}/handler.readSL`,
    events: [
      {
        http: {
          method: 'get',
          path: 'order/list',
          request: {
            schemas: {
              'application/json': schema
            }
          }
        }
      }
    ]
  },
  updateOrder : {
    handler: `${handlerPath(__dirname)}/handler.updateSL`,
    events: [
      {
        http: {
          method: 'put',
          path: 'order',
          request: {
            schemas: {
              'application/json': schema
            }
          }
        }
      }
    ]
  },
  deleteSoftOrder : {
    handler: `${handlerPath(__dirname)}/handler.softDeleteSL`,
    events: [
      {
        http: {
          method: 'patch',
          path: 'order',
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
