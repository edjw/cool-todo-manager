import { z } from "zod";

// Base schema
const TodoBaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  isDone: z.boolean(),
  numberOfTimesMarkedAsToBeDoneToday: z.number(),
});

// Extend base schema to create TodoSchema with Date types
export const TodoSchema = TodoBaseSchema.extend({
  dateCreated: z.date(),
  dateDeleted: z.date().optional(),
  dateMarkedAsToBeDoneToday: z.date().optional(),
});

// Extend base schema to create TodoSchemaForJSON with string types for dates
export const TodoSchemaForJSON = TodoBaseSchema.extend({
  dateCreated: z.string(),
  dateDeleted: z.string().optional(),
  dateMarkedAsToBeDoneToday: z.string().optional(),
});

export const TodosSchema = z.array(TodoSchema);

export type Todo = z.infer<typeof TodoSchema>;
