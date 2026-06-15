"use server";

import { db } from "@/lib/db";
import { commissionRequests } from "@/lib/db/schema";
import { commissionSchema } from "@/lib/validators/commission";
import { revalidatePath } from "next/cache";

export async function submitCommission(formData: FormData) {
  const parsed = commissionSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    deity: formData.get("deity") || undefined,
    style: formData.get("style") || undefined,
    sizeDescription: formData.get("sizeDescription") || undefined,
    budgetNpr: formData.get("budgetNpr") ? Number(formData.get("budgetNpr")) : undefined,
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await db.insert(commissionRequests).values(parsed.data);
  revalidatePath("/commissions");
  return { success: true };
}
