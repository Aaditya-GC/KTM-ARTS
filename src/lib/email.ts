"use server";

import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const from = "Kathmandu Arts <orders@kathmanduarts.com>";

async function getEmail(userId: string): Promise<string | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const { data } = await supabase.auth.admin.getUserById(userId);
  return data?.user?.email ?? null;
}

export async function sendOrderConfirmation(
  customerId: string,
  order: { id: string; totalNpr: number; items: Array<{ title: string }> }
) {
  if (!resend) return;
  const to = await getEmail(customerId);
  if (!to) return;

  const itemsList = order.items.map((i) => `  - ${i.title}`).join("\n");
  const totalFormatted = `NPR ${order.totalNpr.toLocaleString("en-NP")}`;

  try {
    await resend.emails.send({
      from,
      to,
      subject: "Order Confirmed — Kathmandu Arts",
      text: `Your order has been received with reverence.\n\nOrder ID: ${order.id}\n\nItems:\n${itemsList}\n\nTotal: ${totalFormatted}\n\nThank you for collecting Himalayan heritage.`,
      html: `<p>Your order has been received with reverence.</p><p><strong>Order ID:</strong> ${order.id}</p><p><strong>Items:</strong></p><ul>${order.items.map((i) => `<li>${i.title}</li>`).join("")}</ul><p><strong>Total:</strong> ${totalFormatted}</p><p>Thank you for collecting Himalayan heritage.</p>`,
    });
  } catch {
    // Email failure must not block order confirmation
  }
}

export async function sendArtistSaleNotification(
  artistId: string,
  artwork: { title: string; priceNpr: number; buyerName: string }
) {
  if (!resend) return;
  const to = await getEmail(artistId);
  if (!to) return;

  const priceFormatted = `NPR ${artwork.priceNpr.toLocaleString("en-NP")}`;

  try {
    await resend.emails.send({
      from,
      to,
      subject: "Your Artwork Has Sold — Kathmandu Arts",
      text: `Your artwork "${artwork.title}" has been purchased.\n\nBuyer: ${artwork.buyerName}\nPrice: ${priceFormatted}\n\nLog in to your dashboard to view order details.`,
      html: `<p>Your artwork <strong>"${artwork.title}"</strong> has been purchased.</p><p><strong>Buyer:</strong> ${artwork.buyerName}</p><p><strong>Price:</strong> ${priceFormatted}</p><p>Log in to your dashboard to view order details.</p>`,
    });
  } catch {
    // Email failure must not block order confirmation
  }
}

export async function sendCommissionAcknowledgment(to: string, name: string) {
  if (!resend) return;

  try {
    await resend.emails.send({
      from,
      to,
      subject: "Commission Inquiry Received — Kathmandu Arts",
      text: `Dear ${name},\n\nThank you for your commission inquiry. Our curation team will review your request and respond within 48 hours with artist recommendations and a preliminary timeline.\n\nWith reverence,\nKathmandu Arts`,
      html: `<p>Dear ${name},</p><p>Thank you for your commission inquiry. Our curation team will review your request and respond within 48 hours with artist recommendations and a preliminary timeline.</p><p>With reverence,<br>Kathmandu Arts</p>`,
    });
  } catch {
    // Email failure must not break commission submission
  }
}
