"use server";

export async function initiateKhaltiPayment(orderData: {
  orderId: string;
  amountNpr: number;
  returnUrl: string;
}) {
  const response = await fetch("https://khalti.com/api/v2/epayment/initiate/", {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      return_url: orderData.returnUrl,
      website_url: process.env.NEXT_PUBLIC_SITE_URL,
      amount: orderData.amountNpr * 100,
      purchase_order_id: orderData.orderId,
      purchase_order_name: `Order ${orderData.orderId}`,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail ?? "Khalti payment initiation failed");
  }

  return response.json() as Promise<{ pidx: string; payment_url: string }>;
}

export async function verifyKhaltiPayment(pidx: string) {
  const response = await fetch("https://khalti.com/api/v2/epayment/lookup/", {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pidx }),
  });

  if (!response.ok) throw new Error("Khalti verification failed");

  return response.json() as Promise<{ status: string; pidx: string }>;
}
