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
          path: "product/{ID}",
          request: {
            schemas: {
              "application/json": readSchema,
            },
          },
        },
      },
    ],
  },
  readProducts: {
    handler: `${handlerPath(__dirname)}/handler.readListSL`,
    events: [
      {
        http: {
          method: "get",
          path: "product/list",
          request: {
            schemas: {
              "application/json": {},
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
  },
  deleteProduct: {
    handler: `${handlerPath(__dirname)}/handler.deleteSL`,
    events: [
      {
        http: {
          method: "delete",
          path: "product",
          request: {
            schemas: {
              "application/json": {},
            },
          },
        },
      },
    ],
  },
};
export default functions;
