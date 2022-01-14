import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import ListModel from "../../models/list.model";
import ResponseModel from "../../models/response.model";

// Services
import DatabaseService from "../../services/database.service";
const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  let id: String;
  try {
    const databaseService = new DatabaseService();
    const listModel = new ListModel({name:event.body.name});
    // Get model data
    const data = listModel.getEntityMappings();
          
    // Initialise DynamoDB PUT parameters
    const params = {
        TableName: process.env.LIST_TABLE,
        Item: {
            id: data.id,
            name: data.name,
            createdAt: data.timestamp,
            updatedAt: data.timestamp,
        }
    }
    console.log(params)
    // Inserts item into DynamoDB table
    // await databaseService.create(params);
    // id = data.id 
  } catch (error) {
    console.log(error)
  }

  // return data.id;
  return formatJSONResponse({
    message: `Hello , welcome to the exciting Serverless world! your id : ${id}`,
    event,
  });
}
// const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
//   return formatJSONResponse({
//     message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
//     event,
//   });
// }

export const main = middyfy(hello);
