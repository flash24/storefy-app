const createSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    sku: { type: "string" },
    description: { type: "string" },
    price: { type: "number" },
    stock: { type: "number" },
  },
  required: ["name", "sku", "description", "price", "stock"],
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
  required: ["name", "sku", "description", "price", "stock"],
};
export { createSchema, updateSchema };
