import { z } from "zod";

export const projectSchema = z.object({
  titleA: z.string().min(1, "Title A is required"),
  yearA: z.string().optional(),
  authorA: z.string().optional(),
  formA: z.string().min(1, "Form A is required"),
  titleB: z.string().min(1, "Title B is required"),
  yearB: z.string().optional(),
  authorB: z.string().optional(),
  formB: z.string().min(1, "Form B is required"),
});

const bridgeSideSchema = z.object({
  type: z.string().optional(),
  tech: z.string().optional(),
  ctx: z.string().optional(),
  ev: z.string().optional(),
  meaning: z.string().optional(),
});

export const bridgeSchema = z.object({
  id: z.union([z.string(), z.number()]),
  status: z.enum(["bridge", "cantilever"]),
  sideA: bridgeSideSchema,
  sideB: bridgeSideSchema,
  synthesis: z.string().optional(),
});

export const bridgeArraySchema = z.array(bridgeSchema);

export const bridgesFormSchema = z.object({
  bridges: bridgeArraySchema,
});
