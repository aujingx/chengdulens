export type Destination = "chengdu" | "jiuzhaigou" | "huanglong" | "songpan";

export const destinations = {
  chengdu: { en: "Chengdu", zh: "成都" },
  jiuzhaigou: { en: "Jiuzhaigou", zh: "九寨沟" },
  huanglong: { en: "Huanglong", zh: "黄龙" },
  songpan: { en: "Songpan", zh: "松潘" },
} satisfies Record<Destination, { en: string; zh: string }>;

export type BookingChoice = Destination | "clarify";

// Booking is an explicit user action, never inferred from an assistant reply.
export function bookingChoice(text: string, selected: Destination): BookingChoice | null {
  const cleaned = text.replace(/黄龙九寨(?:高铁)?站|huanglong jiuzhai (?:railway )?station/gi, "");
  if (!/预订|订票|订酒店|订房|订位|\b(?:book|reserve|reservation)\b/i.test(cleaned)) return null;
  if (/不(?:用|要|想)(?:再)?(?:预订|订票|订房)|\b(?:don.t|do not|not ready to)\s+(?:book|reserve)\b/i.test(cleaned)) return null;
  const matches: Destination[] = [];
  if (/成都|太古里|宽窄巷子|市区|chengdu|taikoo li|downtown/i.test(cleaned)) matches.push("chengdu");
  if (/九寨沟|jiuzhaigou/i.test(cleaned)) matches.push("jiuzhaigou");
  if (/黄龙|huanglong/i.test(cleaned)) matches.push("huanglong");
  if (/松潘|songpan/i.test(cleaned)) matches.push("songpan");
  if (matches.length > 1) return "clarify";
  if (matches.length === 1) return matches[0];
  // Only context-only requests can directly reopen a previously selected destination.
  if (/^(?:帮我)?(?:预订|订票|订房|订酒店|订位)(?:吧|一下)?[。！!？?]?$|^(?:help me )?(?:book|reserve)(?: it| this)?[.!?]?$/i.test(cleaned.trim())) return selected;
  return "clarify";
}

export const journey = {
  zh: {
    start: "今天下午从太古里出发，我有 4 小时，想轻松逛成都、吃不辣的。明天还想看看成都周边。",
    today: "**今天下午 · 成都太古里附近**\n\n1. 从春熙路站出发，沿太古里逛到大慈寺，留约 1 小时。\n2. 去方所书店歇一歇，留约 45 分钟；下雨就把这里作为主停留点。\n3. 在附近吃晚饭，点餐时出示「我不吃辣，请不要放辣椒和花椒」，再请店家确认。预留走路和等位时间，不用把四小时排满。\n\n明天可以继续留在成都，也可以安排九寨沟。九寨沟需要高铁和公路接驳，若想从容游览，建议在沟口住一晚。",
    next: "明天想去九寨沟，帮我安排过去的路线。",
    tomorrow: "**明天 · 成都 → 九寨沟**\n\n1. 在 12306 核对成都至**黄龙九寨站**的车次和余票。这里是高铁站，不是景区入口。\n2. 下车后另走公路：可问酒店能否按车次接站，或先核对景区方向大巴、下车点及到酒店的最后一段；带大件行李时也可另问出租或包车。\n3. 建议明天先到沟口入住、慢走休息，后天按预约时段进景区。若明天必须当天往返，别按这条过夜路线订。\n\n班次、门票、接送和住宿均未实时核验。",
    bookCity: "看看今天的成都预订",
    bookRegion: "看看九寨沟预订",
    chooseRegion: "明天去九寨沟",
  },
  en: {
    start: "I have four hours near Taikoo Li this afternoon and would like an easy walk and non-spicy food. I'd like to see somewhere outside Chengdu tomorrow, too.",
    today: "**This afternoon · Taikoo Li, Chengdu**\n\n1. Start at Chunxi Road station and spend about an hour walking through Taikoo Li to Daci Temple.\n2. Set aside 45 minutes for Fangsuo Bookstore. If it rains, make this your main stop.\n3. Have dinner nearby. Show the staff ‘我不吃辣，请不要放辣椒和花椒’ (no chili or Sichuan peppercorn), and ask them to confirm. Leave time for walking and waiting instead of filling all four hours.\n\nTomorrow, you could stay in Chengdu or head to Jiuzhaigou. Jiuzhaigou takes both rail and road travel; an overnight near the gate makes for a less rushed visit.",
    next: "Let's go to Jiuzhaigou tomorrow. How do I get there?",
    tomorrow: "**Tomorrow · Chengdu → Jiuzhaigou**\n\n1. Check 12306 for trains to **Huanglong Jiuzhai Station**. The station is not the park entrance.\n2. Plan a separate road transfer. Ask the hotel about pickup for your train, or check the scenic-area bus, its drop-off and the last leg to the hotel. A taxi or private car is another option if you have luggage.\n3. Consider checking in near the gate tomorrow and visiting the park the following day in your reserved slot. If you need to return the same day, don't book this overnight plan.\n\nTrain times, entry, transfers and lodging are not checked live.",
    bookCity: "See Chengdu booking options",
    bookRegion: "See Jiuzhaigou booking options",
    chooseRegion: "Go to Jiuzhaigou tomorrow",
  },
};