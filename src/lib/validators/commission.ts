import { z } from "zod";

export const commissionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email required"),
  phone: z.string().max(20).optional(),
  deity: z.string().max(100).optional(),
  style: z.string().max(100).optional(),
  sizeDescription: z.string().max(500).optional(),
  budgetNpr: z.number().int().min(5000).optional(),
  description: z.string().min(20, "Please share more about your vision").max(3000),
});

export type CommissionInput = z.infer<typeof commissionSchema>;
