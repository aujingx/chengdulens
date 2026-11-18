/**
 * Booking Assistance — demo catalog + payment/booking state machine.
 * Payment state and booking state are deliberately separate.
 */
export type ServiceKind = "hotel" | "restaurant" | "train" | "ticket";
export type CheckoutMode = "paypal_simulation" | "paypal_sandbox" | "provider_hosted" | "no_prepayment";
export type PaymentState =
  | "not_started" | "pending" | "captured" | "failed" | "cancelled" | "refund_pending" | "refunded";
export type BookingState =
  | "draft" | "quote_validated" | "awaiting_payment" | "awaiting_provider" | "confirmed" | "failed" | "cancelled";

export type CatalogItem = {
  id: string;
  service: ServiceKind;
  title: string;
  titleZh: string;
  provider: string;
  demo: true;
  date: string;
  guests: number;
  /** Minor units (cents). Authoritative copy lives on the server. */
  amountMinor?: number;
  taxesMinor?: number;
  currency?: string;
  cancellation: string;
  cancellationZh: string;
  transfer?: { stationPickup: "unverified" | "not_offered"; busDropoffPickup: "unverified" | "not_offered"; note: string; noteZh: string };
  mode: CheckoutMode;
  externalUrl?: string;
};

export const CATALOG: CatalogItem[] = [
  {
    id: "hotel-jzg-gate", service: "hotel", provider: "Demo Provider (fictional)", demo: true,
    title: "Valley Gate Guesthouse — near Jiuzhaigou entrance (demo)", titleZh: "九寨沟口山谷客栈（演示）",
    date: "Night of Day 2", guests: 2, amountMinor: 8800, taxesMinor: 900, currency: "USD",
    cancellation: "Free cancellation until 48 h before check-in (demo terms).", cancellationZh: "入住前 48 小时可免费取消（演示条款）。",
    transfer: { stationPickup: "not_offered", busDropoffPickup: "unverified", note: "No station pickup. Pickup from the scenic-area bus drop-off is unverified — confirm with the hotel.", noteZh: "不提供高铁站接站；景区大巴下车点接送未核实，需与酒店确认。" },
    mode: "paypal_simulation",
  },
  {
    id: "hotel-chuanzhusi", service: "hotel", provider: "Demo Provider (fictional)", demo: true,
    title: "Station Lodge — Chuanzhusi, near Huanglong Jiuzhai Station (demo)", titleZh: "川主寺站前旅舍（演示）",
    date: "Night of Day 2", guests: 2, amountMinor: 6200, taxesMinor: 600, currency: "USD",
    cancellation: "Non-refundable (demo terms).", cancellationZh: "不可退款（演示条款）。",
    transfer: { stationPickup: "unverified", busDropoffPickup: "not_offered", note: "Station pickup is listed but unverified — needs written confirmation for your train.", noteZh: "标注有接站但未核实，需针对你的车次书面确认。" },
    mode: "paypal_simulation",
  },
  {
    id: "train-cd-hljz", service: "train", provider: "China Railway 12306 (official)", demo: true,
    title: "Chengdu → Huanglong Jiuzhai high-speed train", titleZh: "成都 → 黄龙九寨 高铁",
    date: "Morning of Day 2", guests: 2,
    cancellation: "Refund rules set by China Railway.", cancellationZh: "退改规则以铁路官方为准。",
    mode: "provider_hosted", externalUrl: "https://www.12306.cn/en/index.html",
  },
  {
    id: "ticket-jzg", service: "ticket", provider: "Jiuzhaigou official channel", demo: true,
    title: "Jiuzhaigou timed entry + park bus", titleZh: "九寨沟分时门票 + 观光车",
    date: "Day 2 / Day 3", guests: 2,
    cancellation: "Set by the scenic area.", cancellationZh: "以景区规则为准。",
    mode: "provider_hosted", externalUrl: "https://www.jiuzhai.com",
  },
  {
    id: "rest-chengdu", service: "restaurant", provider: "Demo restaurant (fictional)", demo: true,
    title: "Mild Sichuan dinner near Kuanzhai Alley (demo)", titleZh: "宽窄巷子附近微辣川菜晚餐（演示）",
    date: "Evening of Day 1", guests: 2,
    cancellation: "Table request only — no prepayment.", cancellationZh: "仅订位请求，无需预付。",
    mode: "no_prepayment",
  },
];

export const findItem = (id: string) => CATALOG.find((c) => c.id === id);

export type Quote = { quoteId: string; itemId: string; amountMinor: number; currency: string; expiresAt: number; demo: true };

export type Intent = {
  id: string;
  itemId: string;
  mode: CheckoutMode;
  quote?: Quote;
  paymentState: PaymentState;
  bookingState: BookingState;
  /** Only a real provider may set this. Demo uses demoReference instead. */
  providerConfirmationId?: string;
  demoReference?: string;
  history: string[];
};

export type Event =
  | { type: "QUOTE_OK"; quote: Quote }
  | { type: "USER_CONFIRMED" }
  | { type: "PAY_STARTED" }
  | { type: "PAY_CAPTURED" }
  | { type: "PAY_FAILED" }
  | { type: "PAY_CANCELLED" }
  | { type: "PROVIDER_ACCEPTED"; demoReference: string }
  | { type: "PROVIDER_FAILED" }
  | { type: "REFUND_STARTED" }
  | { type: "REFUND_DONE" };

export function newIntent(itemId: string, mode: CheckoutMode): Intent {
  return { id: `intent_${itemId}`, itemId, mode, paymentState: "not_started", bookingState: "draft", history: ["draft"] };
}

/** Pure reducer. Illegal / duplicate events are ignored (idempotent). */
export function reduce(i: Intent, e: Event): Intent {
  const log = (x: Intent, tag: string): Intent => ({ ...x, history: [...x.history, tag] });
  switch (e.type) {
    case "QUOTE_OK":
      if (i.bookingState !== "draft") return i;
      return log({ ...i, quote: e.quote, bookingState: "quote_validated" }, "quote_validated");
    case "USER_CONFIRMED":
      if (i.bookingState !== "quote_validated") return i;
      return log({ ...i, bookingState: "awaiting_payment" }, "awaiting_payment");
    case "PAY_STARTED":
      if (i.bookingState !== "awaiting_payment" || i.paymentState === "pending" || i.paymentState === "captured") return i;
      return log({ ...i, paymentState: "pending" }, "payment_pending");
    case "PAY_CAPTURED":
      if (i.paymentState !== "pending") return i;
      return log({ ...i, paymentState: "captured", bookingState: "awaiting_provider" }, "payment_captured");
    case "PAY_FAILED":
      if (i.paymentState !== "pending") return i;
      return log({ ...i, paymentState: "failed" }, "payment_failed");
    case "PAY_CANCELLED":
      if (i.paymentState !== "pending") return i;
      return log({ ...i, paymentState: "cancelled" }, "payment_cancelled");
    case "PROVIDER_ACCEPTED":
      if (i.bookingState !== "awaiting_provider" || i.paymentState !== "captured") return i;
      return log({ ...i, bookingState: "confirmed", demoReference: e.demoReference }, "booking_confirmed_demo");
    case "PROVIDER_FAILED":
      if (i.bookingState !== "awaiting_provider") return i;
      return log({ ...i, bookingState: "failed" }, "booking_failed");
    case "REFUND_STARTED":
      if (i.paymentState !== "captured" || i.bookingState !== "failed") return i;
      return log({ ...i, paymentState: "refund_pending" }, "refund_pending");
    case "REFUND_DONE":
      if (i.paymentState !== "refund_pending") return i;
      return log({ ...i, paymentState: "refunded", bookingState: "cancelled" }, "refunded");
  }
}

/** Retry after a failed/cancelled payment returns to awaiting_payment. */
export function resetPayment(i: Intent): Intent {
  if (i.paymentState !== "failed" && i.paymentState !== "cancelled") return i;
  return { ...i, paymentState: "not_started", history: [...i.history, "retry"] };
}

export const fmtMoney = (minor: number, cur: string) => `${cur} ${(minor / 100).toFixed(2)}`;
