const createSchema = {
  type: "object",
  properties: {
    sku: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'string' },
    stock: { type: 'string' },
  },
  required: ["name", "sku", "description", "price", "stock"],
};
export {createSchema}
