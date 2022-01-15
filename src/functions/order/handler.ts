import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {createSchema, updateSchema, readSchema} from './schema';
import OrderModel from "@models/order.model";
import ResponseModel from "../../models/response.model";
import { validateAgainstConstraints } from "@libs/util";
import createConstraints from './constraints/create.constraint.json';
import updateConstraints from './constraints/update.constraint.json';
import idRequestConstraints from './constraints/idRequest.constraint.json';
import { Status } from "../../enums/order.enum";

// Services
import DatabaseService from "../../services/database.service";
const create: ValidatedEventAPIGatewayProxyEvent<typeof createSchema> = async (event) => {
  let response: any;
  return validateAgainstConstraints(event.body, createConstraints)
        .then(async () => {
            const databaseService = new DatabaseService();
            const orderModel = new OrderModel(event.body);
            const data = orderModel.getEntityMappings();
            const params = {
                TableName: process.env.ORDER_TABLE,
                Item: {
                  id: data.id,
                  items: data.items,
                  date: data.date,
                  status: data.status,
                }
            }
            // // Inserts item into DynamoDB table
            await databaseService.create(params);
            return data.id;
        })
        .then((id) => {
            // Set Success Response
            response = new ResponseModel({ id }, 200, 'Order successfully created');
        })
        .catch((error) => {
            // Set Error Response
            response = (error instanceof ResponseModel) ? error : new ResponseModel({}, 500, 'Order cannot be created');
        })
        .then(() => {
            // Return API Response
            return response.generate()
        });

  // return data.id;
  return formatJSONResponse({
    message: `Hello , welcome to the exciting Serverless world! your id : ${id}`,
    event,
  });
}
const read: ValidatedEventAPIGatewayProxyEvent<typeof readSchema> = async (event) => {
  let response: any;
  // Initialise database service
  const databaseService = new DatabaseService();
  const id: string = event.queryStringParameters.id
  const { ORDER_TABLE } = process.env;
  return validateAgainstConstraints({id}, idRequestConstraints).then(() => {
      // Get item from the DynamoDB table
      return databaseService.getItem({ key: id, tableName: ORDER_TABLE });
  })
  .then( async (data) => {
      // Set Success Response with data
      response = new ResponseModel({
          ...data.Item,
      }, 200, 'Order successfully retrieved');

  })
  .catch((error) => {
      // Set Error Response
      response = (error instanceof ResponseModel) ? error : new ResponseModel({}, 500, 'Product not found');
  })
  .then(() => {
      // Return API Response
      return response.generate()
  });
}
const update: ValidatedEventAPIGatewayProxyEvent<typeof updateSchema> = async (event) => {
  let response: any;
  // Initialise database service
  const databaseService = new DatabaseService();
  const dataRequest: {id: string, items: [], date: string, status : string} = event.body
  // Destructure environmental variable
  const { ORDER_TABLE } = process.env;
  return Promise.all([
    validateAgainstConstraints(event.body, updateConstraints),
    databaseService.getItem({key: dataRequest.id, tableName: ORDER_TABLE})
])
    .then(() => {

        // Initialise DynamoDB UPDATE parameters
        const params = {
            TableName: ORDER_TABLE,
            Key: {
                "id": dataRequest.id
            },
            UpdateExpression: "set #items = :items,#date = :date,#status = :status, updatedAt = :timestamp",
            ExpressionAttributeNames: {
                "#items": "items",
                "#date": "date",
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":items": dataRequest.items,
                ":date": new Date(dataRequest.date).toDateString() ,
                ":status": Status[dataRequest.status],
                ":timestamp": new Date().getTime(),
            },
            ReturnValues: "UPDATED_NEW"
        }
        // Updates Item in DynamoDB table
        return databaseService.update(params);
    })
    .then((results) => {
        // Set Success Response
        response = new ResponseModel({ ...results.Attributes }, 200, 'Order successfully updated');
    })
    .catch((error) => {
        // Set Error Response
        response = (error instanceof ResponseModel) ? error : new ResponseModel({}, 500, 'Order cannot be updated');
    })
    .then(() => {
        // Return API Response
        return response.generate()
    });

}
const softDelete: ValidatedEventAPIGatewayProxyEvent<typeof readSchema> = async (event) => {
  let response: any;
  // Initialise database service
  const databaseService = new DatabaseService();
  const dataRequest: {id: string, items: [], date: string, status : string} = event.body
  // Destructure environmental variable
  const { ORDER_TABLE } = process.env;
  return Promise.all([
    validateAgainstConstraints(event.body, idRequestConstraints),
    databaseService.getItem({key: dataRequest.id, tableName: ORDER_TABLE})
])
    .then(() => {

        // Initialise DynamoDB UPDATE parameters
        const params = {
            TableName: ORDER_TABLE,
            Key: {
                "id": dataRequest.id
            },
            UpdateExpression: "set #status = :status, updatedAt = :timestamp",
            ExpressionAttributeNames: {
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":status": Status.CANCELED,
                ":timestamp": new Date().getTime(),
            },
            ReturnValues: "UPDATED_NEW"
        }
        // Updates Item in DynamoDB table
        return databaseService.update(params);
    })
    .then((results) => {
        // Set Success Response
        response = new ResponseModel({ ...results.Attributes }, 200, 'Order successfully deleted');
    })
    .catch((error) => {
        // Set Error Response
        response = (error instanceof ResponseModel) ? error : new ResponseModel({}, 500, 'Order cannot be deleted');
    })
    .then(() => {
        // Return API Response
        return response.generate()
    });
  // return data.id;
  return formatJSONResponse({
    message: `read serverless`,
    event,
  });
}
const createSL = middyfy(create);
const readSL = middyfy(read);
const updateSL = middyfy(update);
const softDeleteSL = middyfy(softDelete);

export {createSL, readSL, updateSL, softDeleteSL}
