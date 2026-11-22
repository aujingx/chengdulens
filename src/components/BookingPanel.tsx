import { useState } from "react";
import { ExternalLink, Hotel, Train, Ticket, Utensils, Loader2 } from "lucide-react";
import { bookingItems, demoQuote, newIntent, reduce, resetPayment, fmtMoney, type CatalogItem, type Intent, type Event } from "@/lib/booking";
import { Button } from "@/components/ui/button";
import { destinations, type Destination } from "@/lib/journey";
import { useApp } from "@/lib/store";

const ICON = { hotel: Hotel, train: Train, ticket: Ticket, restaurant: Utensils };

export function BookingPanel({ destination }: { destination: Destination }) {
  const lang = useApp((s) => s.lang);
  const zh = lang === "zh";
  const title = destinations[destination][lang];
  return (
    <section aria-label={zh ? `${title}预订` : `${title} bookings`} className="mt-3 space-y-3">
      <div>
        <h3 className="font-display font-semibold">{destination === "chengdu" ? (zh ? `今天 · ${title}` : `Today · ${title}`) : (zh ? `明天及之后 · ${title}` : `Tomorrow and after · ${title}`)}</h3>
        <p className="text-xs text-muted-foreground">{zh ? "站内操作仅为演示，不会扣款或提交预约；外链可查询官方信息。" : "In-app actions are simulations; no charges or reservations. External links lead to official information."}</p>
        <p className="mt-2 text-xs text-muted-foreground">{zh ? "以下为独立的流程演示项目，不代表已选餐厅或酒店的真实报价。酒店选择请通过行程里的地图链接联系核实。" : "These are separate workflow examples, not quotes for your chosen restaurant or hotel. Use the map links in your plan to verify your hotel choice."}</p>
      </div>
      {bookingItems(destination).map((item) => (
        <BookingCard key={item.id} item={item} />
      ))}
    </section>
  );
}

function BookingCard({ item }: { item: CatalogItem }) {
  const zh = useApp((s) => s.lang) === "zh";
  const [intent, setIntent] = useState<Intent>(() => newIntent(item.id, item.mode));
  const [busy, setBusy] = useState(false);
  const dispatch = (e: Event) => setIntent((i) => reduce(i, e));
  const Icon = ICON[item.service];

  function getQuote() {
    const quote = demoQuote(item);
    if (quote) dispatch({ type: "QUOTE_OK", quote });
  }

  function pay(outcome: "ok" | "cancel" | "fail" | "provider_fail") {
    if (busy) return;
    setBusy(true);
    dispatch({ type: "PAY_STARTED" });
    setTimeout(() => {
      if (outcome === "cancel") dispatch({ type: "PAY_CANCELLED" });
      else if (outcome === "fail") dispatch({ type: "PAY_FAILED" });
      else {
        dispatch({ type: "PAY_CAPTURED" });
        if (outcome === "ok") dispatch({ type: "PROVIDER_ACCEPTED", demoReference: `DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}` });
        else dispatch({ type: "PROVIDER_FAILED" });
      }
      setBusy(false);
    }, 900);
  }

  const L = (en: string, cn: string) => (zh ? cn : en);
  const btn = "rounded-full px-3 py-1.5 text-xs font-semibold";

  return (
    <div className="rounded-lg border border-border/60 bg-background p-4 text-sm">
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-background"><Icon className="h-4 w-4 text-coral" /></span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-snug">{zh ? item.titleZh : item.title}</p>
          <p className="text-xs text-muted-foreground">{item.guests} {L("guests", "人")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{zh ? item.cancellationZh : item.cancellation}</p>
          {item.transfer && <p className="mt-1 text-xs text-foreground">🚐 {zh ? item.transfer.noteZh : item.transfer.note}</p>}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {item.mode === "provider_hosted" && item.externalUrl && (
          <a href={item.externalUrl} target="_blank" rel="noreferrer" className={`${btn} inline-flex items-center gap-1 bg-foreground text-background`}>
            {L("Check official site", "前往官方渠道查询")} <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {item.mode === "no_prepayment" && (
          intent.bookingState === "confirmed" || intent.history.includes("requested")
            ? <span className="text-xs text-leaf">{L("Table request simulated. Nothing was sent.", "已模拟订位请求，未实际发送。")}</span>
            : <Button type="button" variant="outline" size="sm" className={`${btn} bg-foreground text-background`} onClick={() => setIntent((i) => ({ ...i, history: [...i.history, "requested"] }))}>{L("Simulate table request", "模拟订位")}</Button>
        )}

        {item.mode === "paypal_simulation" && (
          <>
            <span className="rounded-full bg-sun/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">{L("PayPal simulation", "PayPal 模拟")}</span>
            {intent.bookingState === "draft" && (
              <Button type="button" variant="outline" size="sm" disabled={busy} className={`${btn} bg-foreground text-background`} onClick={getQuote}>
                {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : L("Get demo price", "获取模拟报价")}
              </Button>
            )}
            {intent.bookingState === "quote_validated" && intent.quote && (
              <>
                <span className="font-semibold">{fmtMoney(intent.quote.amountMinor, intent.quote.currency)}</span>
                <span className="text-xs text-muted-foreground">{L("Fictional price incl. tax", "含税模拟价格")}</span>
                <Button type="button" variant="outline" size="sm" className={`${btn} bg-coral text-coral-foreground`} onClick={() => dispatch({ type: "USER_CONFIRMED" })}>{L("Confirm demo quote", "确认模拟报价")}</Button>
              </>
            )}
            {intent.bookingState === "awaiting_payment" && intent.paymentState !== "pending" && (
              intent.paymentState === "failed" || intent.paymentState === "cancelled" ? (
                <>
                  <span className="text-xs text-destructive">{intent.paymentState === "failed" ? L("Payment failed. Nothing was charged.", "付款失败，未扣款。") : L("You cancelled. Nothing was charged.", "已取消，未扣款。")}</span>
                  <Button type="button" variant="outline" size="sm" className={`${btn} border border-border`} onClick={() => setIntent(resetPayment)}>{L("Try again", "重试")}</Button>
                </>
              ) : (
                <>
                  <Button type="button" variant="outline" size="sm" disabled={busy} className={`${btn} bg-foreground text-background`} onClick={() => pay("ok")}>{L("Simulate PayPal payment", "模拟 PayPal 付款")}</Button>
                  <span className="text-[10px] text-muted-foreground">{L("Test:", "测试：")}</span>
                  <Button type="button" variant="outline" size="sm" className={`${btn} border border-border`} onClick={() => pay("cancel")}>{L("Cancel", "取消")}</Button>
                  <Button type="button" variant="outline" size="sm" className={`${btn} border border-border`} onClick={() => pay("fail")}>{L("Card declined", "付款失败")}</Button>
                  <Button type="button" variant="outline" size="sm" className={`${btn} border border-border`} onClick={() => pay("provider_fail")}>{L("Simulate hotel failure after payment", "模拟付款成功但订房失败")}</Button>
                </>
              )
            )}
            {intent.paymentState === "pending" && <span className="inline-flex items-center gap-1 text-xs"><Loader2 className="h-3 w-3 animate-spin" />{L("Processing payment…", "正在处理付款…")}</span>}
            {intent.bookingState === "confirmed" && (
              <span className="text-xs text-leaf">{L(`Paid · booking confirmed (demo ref ${intent.demoReference}). Not a real reservation.`, `已付款 · 预订已确认（演示编号 ${intent.demoReference}），并非真实预订。`)}</span>
            )}
            {intent.bookingState === "failed" && intent.paymentState === "captured" && (
              <>
                <span className="text-xs text-destructive">{L("Demo: payment succeeded but the hotel could not confirm. No real charge was made.", "演示：模拟付款成功，但酒店未确认；没有实际扣款。")}</span>
                <Button type="button" variant="outline" size="sm" className={`${btn} bg-foreground text-background`} onClick={() => { dispatch({ type: "REFUND_STARTED" }); setTimeout(() => dispatch({ type: "REFUND_DONE" }), 900); }}>{L("Start refund", "发起退款")}</Button>
              </>
            )}
            {intent.paymentState === "refund_pending" && <span className="text-xs">{L("Refund in progress…", "退款处理中…")}</span>}
            {intent.paymentState === "refunded" && <span className="text-xs text-leaf">{L("Refunded (simulated). Booking cancelled.", "已退款（模拟），预订已取消。")}</span>}
          </>
        )}
      </div>
    </div>
  );
}
