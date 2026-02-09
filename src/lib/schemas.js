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
  essayQuestion: z.string().optional(),
});

const sideSchema = z.object({
  type: z.string().optional(),
  convention: z.string().optional(),
  feature: z.string().optional(),
  effect: z.string().optional(),
  lens: z.string().optional(),
  ctx: z.string().optional(),
  ev: z.string().optional(),
  meaning: z.string().optional(),
});

const teelBlockSchema = z.object({
  evidence: z.string().optional(),
  explanation: z.string().optional(),
});

const cantileverSchema = z.object({
  topic: z.string().optional(),
  blocks: z.array(teelBlockSchema).default([{ evidence: '', explanation: '' }, { evidence: '', explanation: '' }, { evidence: '', explanation: '' }]),
  link: z.string().optional(),
  sideA: sideSchema,
  sideB: sideSchema,
});

const segmentSchema = z.object({
  id: z.union([z.string(), z.number()]),
  kind: z.enum(["foundation", "cantilever", "keystone"]),
  status: z.enum(["draft", "final"]).default("draft"),
  content: z.string().optional(),
  teel: cantileverSchema.optional(),
  synthesis: z.string().optional(),
});

export const segmentArraySchema = z.array(segmentSchema);

export const segmentsFormSchema = z.object({
  segments: segmentArraySchema,
});

// Legacy compat aliases
const bridgeSideSchema = sideSchema;
export const bridgeSchema = z.object({
  id: z.union([z.string(), z.number()]),
  status: z.enum(["bridge", "cantilever"]),
  sideA: bridgeSideSchema,
  sideB: bridgeSideSchema,
  synthesis: z.string().optional(),
});
export const bridgeArraySchema = z.array(bridgeSchema);
export const bridgesFormSchema = z.object({ bridges: bridgeArraySchema });
