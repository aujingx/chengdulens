/**
 * Preset regional knowledge for Scenario B (Chengdu today → Jiuzhaigou tomorrow).
 * Curated, not live. Every operational fact is marked for confirmation.
 */
export type TruthStatus = "verified" | "unverified" | "demo";

export type RegionPlace = {
  id: string;
  name: string;
  zhName: string;
  kind: "scenic-area" | "old-town" | "rail-hub";
  elevation: string;
  intro: string;
  introZh: string;
  practical: string;
  officialUrl?: string;
  truth: TruthStatus;
};

export const regionPlaces: RegionPlace[] = [
  {
    id: "jiuzhaigou",
    name: "Jiuzhaigou Valley",
    zhName: "九寨沟",
    kind: "scenic-area",
    elevation: "≈2,000–3,100 m",
    intro:
      "UNESCO World Heritage valley of turquoise travertine lakes, waterfalls and Tibetan villages. A full day inside the park (green park buses link the Y-shaped valleys) is the norm.",
    introZh: "世界自然遗产，钙华湖泊、瀑布与藏寨。园内乘观光车往返 Y 字形沟谷，通常需要一整天。",
    practical:
      "Real-name timed entry is booked in advance on the official channel; daily quotas apply. Prices, quotas and opening hours change by season — check the official site.",
    officialUrl: "https://www.jiuzhai.com",
    truth: "unverified",
  },
  {
    id: "huanglong",
    name: "Huanglong Scenic Area",
    zhName: "黄龙",
    kind: "scenic-area",
    elevation: "≈3,100–3,600 m (boardwalk top)",
    intro:
      "Terraced travertine pools in gold and turquoise, ending at Huanglong Temple. A boardwalk loop of several hours; the cable car reduces climbing.",
    introZh: "金黄与碧蓝的钙华彩池，终点为黄龙古寺。栈道环线需数小时，索道可减少攀爬。",
    practical:
      "Highest point of the trip — altitude sickness is the main risk. Go slow, hydrate, avoid it as day one if arriving straight from sea level. Cable-car and ticket status must be checked on the day.",
    officialUrl: "https://www.huanglong.com",
    truth: "unverified",
  },
  {
    id: "songpan",
    name: "Songpan Ancient Town",
    zhName: "松潘古城",
    kind: "old-town",
    elevation: "≈2,850 m",
    intro:
      "Restored Ming-era walled town and historic tea-horse trade hub where Han, Tibetan, Qiang and Hui cultures meet. Good for an easy afternoon walk and an acclimatisation night.",
    introZh: "明代城墙古城，茶马古道重镇，汉、藏、羌、回文化交汇。适合轻松散步，也适合作为适应海拔的过夜点。",
    practical: "Free to walk the streets. Accommodation availability and town-to-station transport must be confirmed directly.",
    truth: "unverified",
  },
  {
    id: "hljz-station",
    name: "Huanglong Jiuzhai Railway Station",
    zhName: "黄龙九寨站",
    kind: "rail-hub",
    elevation: "≈3,000 m",
    intro:
      "High-speed rail station on the Chengdu–Lanzhou line serving the Jiuzhaigou/Huanglong area. It is NOT next to either park — onward road transfer is always needed.",
    introZh: "成兰铁路上服务九寨、黄龙片区的高铁站。距离两个景区都还有一段公路，需要后续接驳。",
    practical:
      "Train timetables and seats must be checked on 12306 (foreign passport supported). Road transfer to Jiuzhaigou is roughly 1.5–2 h and to Huanglong roughly 1 h — estimates only.",
    officialUrl: "https://www.12306.cn/en/index.html",
    truth: "unverified",
  },
];

export type ShuttleOption = {
  id: string;
  label: string;
  labelZh: string;
  originType: "rail_station" | "bus_stop" | "hotel" | "attraction";
  destinationType: "rail_station" | "bus_stop" | "hotel" | "attraction";
  reservationRequired?: boolean;
  price: null;
  schedule: null;
  verification: TruthStatus;
  note: string;
};

/** Transfer modes that must never be merged into one "free pickup" label. */
export const shuttleModes: ShuttleOption[] = [
  { id: "station-hotel", label: "Station → hotel pickup", labelZh: "高铁站 → 酒店接站", originType: "rail_station", destinationType: "hotel", reservationRequired: true, price: null, schedule: null, verification: "unverified", note: "Only if the hotel explicitly confirms it for your train; never assume free." },
  { id: "station-bus-hotel", label: "Station → scenic-area bus → drop-off → hotel", labelZh: "高铁站 → 景区方向大巴 → 下车点 → 酒店", originType: "rail_station", destinationType: "bus_stop", price: null, schedule: null, verification: "unverified", note: "Bus timing is tied to train arrivals and may change; last-mile to the hotel is a separate question." },
  { id: "hotel-park", label: "Hotel ↔ park gate", labelZh: "酒店 ↔ 景区门口", originType: "hotel", destinationType: "attraction", price: null, schedule: null, verification: "unverified", note: "Some hotels near the Jiuzhaigou gate run shuttles; confirm times." },
  { id: "taxi-charter", label: "Taxi / private charter / rental car", labelZh: "出租车 / 包车 / 租车", originType: "rail_station", destinationType: "hotel", price: null, schedule: null, verification: "unverified", note: "Most flexible with luggage; price is negotiated or quoted by the operator, not by Chengdu Lens." },
];

export function regionKnowledgeText() {
  const p = regionPlaces
    .map((r) => `- ${r.name} / ${r.zhName} (${r.kind}, elevation ${r.elevation}) [${r.truth}]\n  ${r.intro}\n  Practical: ${r.practical}${r.officialUrl ? `\n  Official: ${r.officialUrl}` : ""}`)
    .join("\n");
  const s = shuttleModes.map((m) => `- ${m.label}: ${m.note}`).join("\n");
  return `${p}\n\nTRANSFER MODES (always distinct; no price/schedule data on file):\n${s}`;
}
