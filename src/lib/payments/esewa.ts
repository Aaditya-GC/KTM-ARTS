"use server";

interface EsewaPaymentData {
  amount: number;
  taxAmount: number;
  totalAmount: number;
  transactionUuid: string;
  productCode: string;
  productServiceCharge: number;
  productDeliveryCharge: number;
  successUrl: string;
  failureUrl: string;
  signedFieldNames: string;
  signature: string;
}

export async function initiateEsewaPayment(orderId: string, amountNpr: number) {
  const transactionUuid = `${orderId}-${Date.now()}`;

  const paymentData: EsewaPaymentData = {
    amount: amountNpr,
    taxAmount: 0,
    totalAmount: amountNpr,
    transactionUuid,
    productCode: "EPAYTEST",
    productServiceCharge: 0,
    productDeliveryCharge: 0,
    successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/esewa/verify`,
    failureUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/customer/orders`,
    signedFieldNames: "total_amount,transaction_uuid,product_code",
    signature: "",
  };

  return paymentData;
}
