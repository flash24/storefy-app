# storefy-app

This project has been generated using [Serverless framework](https://www.serverless.com/).

## Installation/deployment instructions
> **Requirements**: 
    - NodeJS `lts/fermium (v.14.15.0)`.
    - Java Runtime Engine (JRE) version 6.x or newer
    - serverless@^1

- copy `.env.example to .env`
- RUN `npm install -g serverless`
- Run `npm install` to install the project dependencies
- Run `sls dynamodb install` to init the db local

### Remotely
endpoints:
  POST - https://xh70ad6dhi.execute-api.us-east-1.amazonaws.com/dev/product
  GET - https://xh70ad6dhi.execute-api.us-east-1.amazonaws.com/dev/product
  PUT - https://xh70ad6dhi.execute-api.us-east-1.amazonaws.com/dev/product
  POST - https://xh70ad6dhi.execute-api.us-east-1.amazonaws.com/dev/order
  GET - https://xh70ad6dhi.execute-api.us-east-1.amazonaws.com/dev/order
  PUT - https://xh70ad6dhi.execute-api.us-east-1.amazonaws.com/dev/order
  PATCH - https://xh70ad6dhi.execute-api.us-east-1.amazonaws.com/dev/order

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `configs` - containing the initian configuration for database
- `enums` - containing the enums base for the proyect
- `functions` - containing code base and configuration for the lambda functions
- `interfaces` - containing code base for interface config 
- `libs` - containing shared code base between the lambdas
- `models` - containing business model for the proyect
- `services` - containing core conection to the databse

```
.
├── src
│   ├── configs                                 # Lambda configuration and source code folder
|   |   ├── dynamodb-tables                     # data base config schema
│   ├── enum                                    # enums collection for proyect
|   |   ├── order.enum                          # enum for status order
|   |   ├── response-message.enum               # enum for responce texts
|   |   ├── status-code.enum                    # enum for responce codes http
|   |   ├── status.enum                         # enum for responce texts http
│   ├── functions                               # Lambda configuration and source code folder
│   │   ├── order/product
│   │   |   ├── constraints                     # constraints validatior rules
│   │   |   |   ├── create.constraint           # constraint rule for create validation
│   │   |   |   ├── update.constraint           # constraint rule for uodate validation
│   │   |   |   ├── idRequest.constraint        # constraint rule for id request validation
│   │   │   ├── handler.ts                      #  main lambda source code
│   │   │   ├── index.ts                        # endpoint lambda Serverless configuration
│   │   │   └── schema.ts                       # lambda input event JSON-Schema
│   │   │
│   │   └── index.ts                            # Import/export of all lambda configurations
│   ├── interfaces                              # folder for interface
│   │   ├── config.interface                    # interface for database service
│   ├── models                                  # models folder for proyect
│   │   ├── order.model                         # order table model
│   │   ├── product.model                       # product table model
│   │   └── respose.model                       # response model for http request
│   ├── services
│   │   └── database.service                    # database core file class
│   │
│   └── libs                                    # Lambda shared code
│       └── apiGateway.ts                       # API Gateway specific helpers
│       └── handlerResolver.ts                  # Sharable library for resolving lambda handlers
│       └── lambda.ts                           # Lambda middleware
│
├── package.json
├── serverless.ts                               # Serverless service file
├── tsconfig.json                               # Typescript compiler configuration
├── tsconfig.paths.json                         # Typescript paths
```
### usage

to start the service :
 - `npm start`
