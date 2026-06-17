"use server";

import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { contactSchema } from "@/lib/validators/contact";

export async function submitContact(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await db.insert(contactMessages).values(parsed.data);
  return { success: true };
}
