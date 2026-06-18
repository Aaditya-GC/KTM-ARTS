import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  shippingName: z.string().min(1, "Name is required").max(100),
  shippingLastName: z.string().min(1, "Last name is required").max(100),
  street: z.string().min(1, "Street address is required").max(200),
  apartment: z.string().max(50).optional(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  phone: z.string().max(20).optional(),
  country: z.string().min(1, "Country is required"),
  paymentMethod: z.enum(["khalti", "esewa", "stripe"]),
  notes: z.string().max(500).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
