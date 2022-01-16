import { handlerPath } from '@libs/handlerResolver';
const functions = {
  createOrder : {
    handler: `${handlerPath(__dirname)}/handler.createSL`,
    events: [
      {
        http: {
          method: 'post',
          path: 'order',
          cors: true
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
          cors: true
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
          cors: true
        }
      }
    ]
  },
  deleteSoftOrder : {
    handler: `${handlerPath(__dirname)}/handler.softDeleteSL`,
    events: [
      {
        http: {
          method: 'patch', //patch and not delete because is soft
          path: 'order',
          cors: true
        }
      }
    ]
  }
}
export default functions
