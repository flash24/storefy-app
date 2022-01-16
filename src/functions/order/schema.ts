const createSchema = {
  type: "object",
  properties: {
    items_order: { type: "array" },
    date: { type: "date" },
    status: { type: "string" },
  },
  required: ["items", "date", "status"],
};
const updateSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    items_order: { type: "array" },
    date: { type: "date" },
    status: { type: "string" },
  },
  required: ["id","items", "date", "status"],
};
const readSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};
export { createSchema, updateSchema, readSchema };
