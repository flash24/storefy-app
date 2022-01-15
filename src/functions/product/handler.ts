import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { handlerPath } from '@libs/handlerResolver';
import {createSchema} from './schema';
import ListModel from "../../models/list.model";
import ResponseModel from "../../models/response.model";
import { validateAgainstConstraints } from "../../utils/util";
import requestConstraints from './constraints/create.constraint.json';
// Services
import DatabaseService from "../../services/database.service";

console.log(handlerPath(__dirname))
const create: ValidatedEventAPIGatewayProxyEvent<typeof createSchema> = async (event) => {
  let response;
  return validateAgainstConstraints(event.body, requestConstraints)
        .then(async () => {
            console.log(event.body)
            // Initialise database service
            const databaseService = new DatabaseService();
        
            // Initialise and hydrate model
            // const listModel = new ListModel();
        
            // // Get model data
            // const data = listModel.getEntityMappings();
        
            // // Initialise DynamoDB PUT parameters
            // const params = {
            //     TableName: process.env.LIST_TABLE,
            //     Item: {
            //         id: data.id,
            //         name: data.name,
            //         createdAt: data.timestamp,
            //         updatedAt: data.timestamp,
            //     }
            // }
            // // Inserts item into DynamoDB table
            // await databaseService.create(params);
            // return data.id;
            return "asd"
        })
        .then((listId) => {
            // Set Success Response
            response = new ResponseModel({ listId }, 200, 'Product successfully created');
        })
        .catch((error) => {
            // Set Error Response
            response = (error instanceof ResponseModel) ? error : new ResponseModel({}, 500, 'Product cannot be created');
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
const read: ValidatedEventAPIGatewayProxyEvent<typeof createSchema> = async (event) => {
  try {
    // const databaseService = new DatabaseService();
    // const listModel = new ListModel({name:event.body.name});
    // // Get model data
    // const data = listModel.getEntityMappings();
          
    // // Initialise DynamoDB PUT parameters
    // const params = {
    //     TableName: process.env.LIST_TABLE,
    //     Item: {
    //         id: data.id,
    //         name: data.name,
    //         createdAt: data.timestamp,
    //         updatedAt: data.timestamp,
    //     }
    // }
    // console.log(params)
    // Inserts item into DynamoDB table
    // await databaseService.create(params);
    // id = data.id 
  } catch (error) {
    console.log(error)
  }

  // return data.id;
  return formatJSONResponse({
    message: `read serverless`,
    event,
  });
}
const update: ValidatedEventAPIGatewayProxyEvent<typeof createSchema> = async (event) => {
  try {
    // const databaseService = new DatabaseService();
    // const listModel = new ListModel({name:event.body.name});
    // // Get model data
    // const data = listModel.getEntityMappings();
          
    // // Initialise DynamoDB PUT parameters
    // const params = {
    //     TableName: process.env.LIST_TABLE,
    //     Item: {
    //         id: data.id,
    //         name: data.name,
    //         createdAt: data.timestamp,
    //         updatedAt: data.timestamp,
    //     }
    // }
    // console.log(params)
    // Inserts item into DynamoDB table
    // await databaseService.create(params);
    // id = data.id 
  } catch (error) {
    console.log(error)
  }

  // return data.id;
  return formatJSONResponse({
    message: `read serverless`,
    event,
  });
}
const deleteP: ValidatedEventAPIGatewayProxyEvent<typeof createSchema> = async (event) => {
  try {
    // const databaseService = new DatabaseService();
    // const listModel = new ListModel({name:event.body.name});
    // // Get model data
    // const data = listModel.getEntityMappings();
          
    // // Initialise DynamoDB PUT parameters
    // const params = {
    //     TableName: process.env.LIST_TABLE,
    //     Item: {
    //         id: data.id,
    //         name: data.name,
    //         createdAt: data.timestamp,
    //         updatedAt: data.timestamp,
    //     }
    // }
    // console.log(params)
    // Inserts item into DynamoDB table
    // await databaseService.create(params);
    // id = data.id 
  } catch (error) {
    console.log(error)
  }

  // return data.id;
  return formatJSONResponse({
    message: `read serverless`,
    event,
  });
}
const readList: ValidatedEventAPIGatewayProxyEvent<typeof createSchema> = async (event) => {
  try {
    // const databaseService = new DatabaseService();
    // const listModel = new ListModel({name:event.body.name});
    // // Get model data
    // const data = listModel.getEntityMappings();
          
    // // Initialise DynamoDB PUT parameters
    // const params = {
    //     TableName: process.env.LIST_TABLE,
    //     Item: {
    //         id: data.id,
    //         name: data.name,
    //         createdAt: data.timestamp,
    //         updatedAt: data.timestamp,
    //     }
    // }
    // console.log(params)
    // Inserts item into DynamoDB table
    // await databaseService.create(params);
    // id = data.id 
  } catch (error) {
    console.log(error)
  }

  // return data.id;
  return formatJSONResponse({
    message: `read serverless`,
    event,
  });
}
const createSL = middyfy(create);
const readSL = middyfy(read);
const updateSL = middyfy(update);
const deleteSL = middyfy(deleteP);
const readListSL = middyfy(readList);

export {createSL, readSL, readListSL, updateSL, deleteSL}
