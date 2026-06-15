import { create } from "zustand";

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CheckoutState {
  shipping: ShippingInfo;
  clientSecret: string | null;
  paymentIntentId: string | null;
  setShipping: (info: ShippingInfo) => void;
  setPaymentIntent: (clientSecret: string, paymentIntentId: string) => void;
  reset: () => void;
}

const defaultShipping: ShippingInfo = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Nepal",
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  shipping: defaultShipping,
  clientSecret: null,
  paymentIntentId: null,
  setShipping: (info) => set({ shipping: info }),
  setPaymentIntent: (clientSecret, paymentIntentId) => set({ clientSecret, paymentIntentId }),
  reset: () => set({ shipping: defaultShipping, clientSecret: null, paymentIntentId: null }),
}));
