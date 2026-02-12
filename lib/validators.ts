import { z } from 'zod';

export const intakeSchema = z.object({
  barcodeId: z.string().min(3),
  jewelleryType: z.string().min(2),
  purity: z.string().min(2),
  goldWeight: z.number().positive(),
  otherMetalWeight: z.number().min(0),
  stoneWeight: z.number().min(0),
  diamondWeight: z.number().min(0),
  imageUrl: z.string().url().optional()
});

export const allotmentSchema = z.object({
  productId: z.string(),
  customerId: z.string(),
  doubleVerified: z.literal(true)
});

export const confirmationSchema = z.object({
  productId: z.string(),
  customerId: z.string(),
  enteredGoldWeight: z.number().positive(),
  enteredPurity: z.string(),
  enteredStoneWeight: z.number().min(0)
});
