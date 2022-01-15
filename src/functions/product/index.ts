import { createSchema, updateSchema, readSchema } from "./schema";
import { handlerPath } from "@libs/handlerResolver";
const functions = {
  createProduct: {
    handler: `${handlerPath(__dirname)}/handler.createSL`,
    events: [
      {
        http: {
          method: "post",
          path: "product",
          request: {
            schemas: {
              "application/json": createSchema,
            },
          },
        },
      },
    ],
  },
  readProduct: {
    handler: `${handlerPath(__dirname)}/handler.readSL`,
    events: [
      {
        http: {
          method: "get",
          path: "product",
          request: {
            schemas: {
              "application/json": readSchema,
            },
          },
        },
      },
    ],
  },
  updateProduct: {
    handler: `${handlerPath(__dirname)}/handler.updateSL`,
    events: [
      {
        http: {
          method: "put",
          path: "product",
          request: {
            schemas: {
              "application/json": updateSchema,
            },
          },
        },
      },
    ],
  }
};
export default functions;
