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
coming soon ..

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── hello
│   │   │   ├── handler.ts      # `Hello` lambda source code
│   │   │   ├── index.ts        # `Hello` lambda Serverless configuration
│   │   │   ├── mock.json       # `Hello` lambda input parameter, if any, for local invocation
│   │   │   └── schema.ts       # `Hello` lambda input event JSON-Schema
│   │   │
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── apiGateway.ts       # API Gateway specific helpers
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│       └── lambda.ts           # Lambda middleware
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```
### usage

to start the service :
 - `npm start`
