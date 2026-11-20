import { expect, test } from "bun:test";
import { bookingItems, demoQuote, newIntent, reduce } from "./booking";
import { bookingChoice } from "./journey";

test("成都未选择周边时只展示成都预订", () => {
  expect(bookingItems("chengdu").map((item) => item.id)).toEqual(["rest-chengdu"]);
  expect(bookingChoice("帮我预订", "chengdu")).toBe("chengdu");
});

test("明确选择九寨沟后，预订仅显示九寨沟及其交通", () => {
  expect(bookingChoice("帮我预订", "jiuzhaigou")).toBe("jiuzhaigou");
  expect(bookingItems("jiuzhaigou").map((item) => item.id)).toEqual(["train-cd-hljz", "hotel-jzg-gate", "ticket-jzg"]);
});

test("讨论或同时提到两个目的地不擅自展开预订", () => {
  expect(bookingChoice("九寨沟值得去吗？", "chengdu")).toBeNull();
  expect(bookingChoice("成都和九寨沟的酒店怎么预订？", "chengdu")).toBe("clarify");
  expect(bookingChoice("帮我订上海的酒店", "chengdu")).toBe("clarify");
});

test("模拟支付成功不能替代酒店确认，失败后退款不产生真实订单", () => {
  const hotel = bookingItems("jiuzhaigou").find((item) => item.id === "hotel-jzg-gate");
  if (!hotel) throw new Error("Missing demo hotel");
  const quote = demoQuote(hotel, 0);
  if (!quote) throw new Error("Missing demo quote");
  expect(quote.demo).toBe(true);
  let intent = newIntent(hotel.id, hotel.mode);
  intent = reduce(intent, { type: "QUOTE_OK", quote });
  intent = reduce(intent, { type: "USER_CONFIRMED" });
  intent = reduce(intent, { type: "PAY_STARTED" });
  intent = reduce(intent, { type: "PAY_CAPTURED" });
  expect(intent.bookingState).toBe("awaiting_provider");
  intent = reduce(intent, { type: "PROVIDER_FAILED" });
  intent = reduce(intent, { type: "REFUND_STARTED" });
  intent = reduce(intent, { type: "REFUND_DONE" });
  expect(intent.paymentState).toBe("refunded");
  expect(intent.bookingState).toBe("cancelled");
  expect(intent.providerConfirmationId).toBeUndefined();
});