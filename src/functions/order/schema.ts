const createSchema = {
  type: "object",
  properties: {
    items: { type: "array" },
    date: { type: "date" },
    status: { type: "string" },
  },
  required: ["items", "date", "status"],
};
const updateSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    sku: { type: "string" },
    description: { type: "string" },
    price: { type: "number" },
    stock: { type: "number" },
  },
  required: ["id", "name", "sku", "description", "price", "stock"],
};
const readSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};
export { createSchema, updateSchema, readSchema };
