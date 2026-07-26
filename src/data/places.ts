export type NearbyItem = {
  name: string;
  nameZh: string;
  kind: "food" | "cafe" | "shop" | "view" | "bar";
  note: string;
  noteZh: string;
  walkMin: number;
};

export type Place = {
  id: string;
  name: string;
  zhName: string;
  image: { url: string; alt: string; source: string; sourceUrl: string };
  category: string;
  categoryZh: string;
  area: string;
  duration: number;
  distanceFromStartMin: number;
  tags: string[];
  whyFits: string;
  whyFitsZh: string;
  intro: string;
  introZh: string;
  bestTime: string;
  bestTimeZh: string;
  ticket: { price: string; priceZh: string; hours: string; bookingUrl?: string; note?: string };
  transit: { metro: string; metroZh: string; walkMin: number; tips: string; tipsZh: string };
  nearby: NearbyItem[];
  whatToKnow: string;
  whatToKnowZh: string;
  notFor: string;
  risk: string;
  riskZh: string;
  sourceSummary: string;
  sources: { label: string; type: string; url: string }[];
  internationalRelevance: "High" | "Medium" | "Low";
  localRelevance: "High" | "Medium" | "Low";
  operationalAccessibility: string;
  evidenceGrade: "A" | "B" | "C";
  spiceRisk: "none" | "low" | "medium" | "high";
  indoor: boolean;
  photogenic: boolean;
  demoPersonalFit: number;
  demoEvidenceConfidence: number;
  x: number;
  y: number;
};

export const places: Place[] = [
  {
    id: "peoples-park",
    name: "People's Park",
    zhName: "人民公园",
    image: {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Displays%20-%20Peoples%20Park%20-%20Chengdu%2C%20China%20-%20DSC05345.jpg?width=1200",
      alt: "People's Park in Chengdu",
      source: "Wikimedia Commons / Daderot",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Displays_-_Peoples_Park_-_Chengdu,_China_-_DSC05345.jpg",
    },
    category: "Park & City Life",
    categoryZh: "公园 · 市井生活",
    area: "Qingyang",
    duration: 70,
    distanceFromStartMin: 18,
    tags: ["quiet", "local texture", "tea culture", "photogenic", "outdoor"],
    whyFits: "A low-pressure way to feel Chengdu's slow rhythm — tea houses, dancers, and everyday public life.",
    whyFitsZh: "以最低门槛感受成都的慢节奏：茶馆、坝坝舞、和日常公共生活。",
    intro:
      "Founded in 1911, People's Park is the city's oldest public garden and Chengdu's living room. On any afternoon you'll find the Heming Tea House packed with locals nursing bottomless jasmine tea, ear-cleaners weaving between bamboo chairs, and grandmothers ballroom-dancing near the lake. It is the single easiest way to feel the city's slow rhythm — no ticket, no rush, no performance for tourists.",
    introZh:
      "1911 年建成的人民公园是成都最老的公共园林，也是这座城市的客厅。任何一个下午来，鹤鸣茶社里都是本地人守着一杯续不完的茉莉花茶，采耳师傅在竹椅间穿梭，湖边有阿姨在跳交谊舞。感受这座城市慢节奏的最简单方式 —— 不收门票、不赶路、也不为游客表演。",
    bestTime: "Weekday 14:00–17:00 for space; weekends after 15:00 for full local energy.",
    bestTimeZh: "工作日 14:00–17:00 更空旷；周末 15:00 之后本地气氛最浓。",
    ticket: { price: "Free", priceZh: "免费", hours: "06:00–22:00 daily" },
    transit: {
      metro: "Line 2 · People's Park, Exit B",
      metroZh: "地铁 2 号线 · 人民公园站 B 口",
      walkMin: 3,
      tips: "Metro is faster than a taxi through the ring roads.",
      tipsZh: "走地铁比打车穿环线快。",
    },
    nearby: [
      { name: "Heming Tea House", nameZh: "鹤鸣茶社", kind: "cafe", note: "Bottomless jasmine tea, 15 RMB. Come with time.", noteZh: "茉莉花茶续杯 15 元，来了就慢慢坐。", walkMin: 0 },
      { name: "Su Da Ge Beef Noodles", nameZh: "苏大哥牛肉面", kind: "food", note: "Non-spicy tomato broth version on the menu.", noteZh: "菜单里有不辣的番茄汤底版本。", walkMin: 7 },
      { name: "Kuanzhai Alley", nameZh: "宽窄巷子", kind: "view", note: "Restored Qing courtyards, walkable extension.", noteZh: "清代院落改造街区，可作延伸。", walkMin: 12 },
      { name: "Sichuan Museum", nameZh: "四川博物院", kind: "view", note: "Free, strong bronze collection.", noteZh: "免费开放，青铜馆藏突出。", walkMin: 15 },
    ],
    whatToKnow: "Outdoor comfort depends on weather. Weekends can be crowded around the tea houses.",
    whatToKnowZh: "户外体验受天气影响，周末茶馆一带较拥挤。",
    notFor: "Travelers who want a highly curated, museum-style experience.",
    risk: "Rain would compress the outdoor tea experience — pair with an indoor backup.",
    riskZh: "下雨会压缩户外茶馆体验，建议搭配室内备份。",
    sourceSummary: "Official park info + international travel reference; no copied reviews.",
    sources: [
      { label: "Official park site", type: "official", url: "https://www.cdpeoplespark.cn/" },
      { label: "Tripadvisor place page", type: "international", url: "https://www.tripadvisor.com/Attraction_Review-g297463-d546614-Reviews-Chengdu_Renmin_Park-Chengdu_Sichuan.html" },
    ],
    internationalRelevance: "High",
    localRelevance: "High",
    operationalAccessibility: "Needs current verification",
    evidenceGrade: "A",
    spiceRisk: "low",
    indoor: false,
    photogenic: true,
    demoPersonalFit: 88,
    demoEvidenceConfidence: 72,
    x: 38, y: 52,
  },
  {
    id: "chengdu-museum",
    name: "Chengdu Museum",
    zhName: "成都博物馆",
    image: {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Chengdu_Museum_1.jpg?width=1200",
      alt: "Chengdu Museum building",
      source: "Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Chengdu_Museum_1.jpg",
    },
    category: "Museum & Indoor Culture",
    categoryZh: "博物馆 · 室内文化",
    area: "Tianfu Square",
    duration: 90,
    distanceFromStartMin: 14,
    tags: ["indoor", "history", "culture", "rain backup", "low spice"],
    whyFits: "A reliable indoor anchor for understanding Chengdu history — independent of weather.",
    whyFitsZh: "了解成都历史脉络的可靠室内锚点，不受天气影响。",
    intro:
      "The bronze-clad museum on Tianfu Square holds 4,000 years of Chengdu — from Shang-era bronze masks unearthed at Jinsha to Qing-era shadow puppets. English captions are competent throughout, and the top-floor puppet gallery is genuinely magical. The single best rainy-afternoon anchor in the city center.",
    introZh:
      "天府广场旁这座青铜色建筑装着成都的四千年 —— 从金沙商代青铜面具到清代皮影。全馆英文说明尚可，顶层皮影厅尤其精彩。市中心最靠谱的雨天下午备份。",
    bestTime: "Open 09:00–17:00 (closed Mondays). Weekday mornings quietest.",
    bestTimeZh: "09:00–17:00 开放（周一闭馆）。工作日上午最空。",
    ticket: {
      price: "Free (passport required)",
      priceZh: "免费（需护照）",
      hours: "Tue–Sun 09:00–17:00",
      bookingUrl: "https://www.cdmuseum.com/",
      note: "Reserve on official site 1–7 days ahead.",
    },
    transit: {
      metro: "Line 1 / Line 2 · Tianfu Square, Exit H",
      metroZh: "地铁 1/2 号线 · 天府广场 H 口",
      walkMin: 2,
      tips: "Passport goes through the same scanner as your bag.",
      tipsZh: "护照与包一起过安检。",
    },
    nearby: [
      { name: "Chengdu Sky Bar (Ritz)", nameZh: "丽思卡尔顿云端酒廊", kind: "bar", note: "26F skyline of the old town.", noteZh: "26 楼俯瞰老城天际线。", walkMin: 6 },
      { name: "Yu Zhi Lan tea room", nameZh: "玉芝兰茶室", kind: "cafe", note: "Quiet Sichuan tea tasting.", noteZh: "安静的川派茶室。", walkMin: 9 },
      { name: "Sichuan Science & Tech Museum", nameZh: "四川科技馆", kind: "view", note: "Free, fun for a rainy break.", noteZh: "免费，雨天休整不错。", walkMin: 3 },
    ],
    whatToKnow: "Reservation, opening hours, and English interpretation availability need confirmation.",
    whatToKnowZh: "开放时间、预约和英文讲解可用性需核实。",
    notFor: "Travelers seeking mostly street life or food exploration.",
    risk: "Passport / reservation rules may change on short notice.",
    riskZh: "护照与预约规则可能变化。",
    sourceSummary: "Official museum website and travel-platform reference.",
    sources: [
      { label: "Official museum site", type: "official", url: "https://www.cdmuseum.com/" },
      { label: "Trip.com Chengdu guide", type: "travel platform", url: "https://you.ctrip.com/travels/chengdu104/4090365.html" },
    ],
    internationalRelevance: "Medium",
    localRelevance: "High",
    operationalAccessibility: "Needs current verification",
    evidenceGrade: "B",
    spiceRisk: "none",
    indoor: true,
    photogenic: false,
    demoPersonalFit: 82,
    demoEvidenceConfidence: 76,
    x: 48, y: 55,
  },
  {
    id: "wenshu-monastery",
    name: "Wenshu Monastery Area",
    zhName: "文殊院片区",
    image: {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Hall%20-%20Wenshu%20Monastery%20-%20Chengdu%2C%20China%20-%20DSC05235.jpg?width=1200",
      alt: "Hall at Wenshu Monastery in Chengdu",
      source: "Wikimedia Commons / Daderot",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Hall_-_Wenshu_Monastery_-_Chengdu,_China_-_DSC05235.jpg",
    },
    category: "Culture & Neighborhood",
    categoryZh: "文化 · 街区",
    area: "Wenshu",
    duration: 80,
    distanceFromStartMin: 22,
    tags: ["culture", "neighborhood", "photogenic", "local food", "quiet"],
    whyFits: "Combines temple atmosphere, neighborhood walking, and nearby local food in one compact area.",
    whyFitsZh: "把寺庙氛围、街区漫步和附近的地道饮食浓缩在一个紧凑区域。",
    intro:
      "Founded in the Tang dynasty and restored under the Qing, Wenshu is Chengdu's largest active Buddhist monastery — five halls of gilded statues drifting in incense smoke. What makes the area special is the walkable neighborhood outside the walls: teahouses in the monastery's own garden, vegetarian noodle joints, and the pedestrian-only Wenshu Fang lanes with hand-pulled sugar candy vendors.",
    introZh:
      "始建于唐、清代重修，文殊院是成都最大的活跃佛寺 —— 五重殿宇，鎏金佛像在香烟里若隐若现。真正精彩的是院墙外的街区：寺内自营茶园、素面馆，以及步行的文殊坊 —— 有手工吹糖人和老字号。",
    bestTime: "Late afternoon 15:00–17:30, then dinner in the lanes.",
    bestTimeZh: "下午 15:00–17:30 光线最好，逛完在巷子里吃饭。",
    ticket: { price: "Free", priceZh: "免费", hours: "08:00–17:00 daily" },
    transit: {
      metro: "Line 1 · Wenshu Monastery, Exit K",
      metroZh: "地铁 1 号线 · 文殊院站 K 口",
      walkMin: 5,
      tips: "Exit K puts you right at the temple gate.",
      tipsZh: "K 口直接到寺门口。",
    },
    nearby: [
      { name: "Xiang Yuan Vegetarian", nameZh: "香园素菜馆", kind: "food", note: "Temple-run vegetarian noodles, no spice.", noteZh: "寺内素食堂，全部不辣。", walkMin: 2 },
      { name: "Wenshu Fang teahouse garden", nameZh: "文殊坊茶园", kind: "cafe", note: "Bamboo chairs under old trees.", noteZh: "老树下的竹椅茶园。", walkMin: 4 },
      { name: "Chengdu Fu Bakery", nameZh: "成都甫甫烘焙", kind: "cafe", note: "Third-wave coffee + osmanthus loaf.", noteZh: "精品咖啡加桂花吐司。", walkMin: 6 },
      { name: "Aidao Alley crafts", nameZh: "爱道街手作", kind: "shop", note: "Small ateliers for silverwork and paper.", noteZh: "银器与手工纸的小工作室。", walkMin: 8 },
    ],
    whatToKnow: "Nearby food can include spicy dishes — non-spicy options must be chosen deliberately.",
    whatToKnowZh: "周边有辣味小吃，需主动挑选不辣的选项。",
    notFor: "Travelers who prefer fully indoor or highly modern spaces.",
    risk: "Diet constraint requires filtering food stops.",
    riskZh: "饮食忌口需筛选餐点。",
    sourceSummary: "Candidate-discovery sources + international Chengdu guide.",
    sources: [
      { label: "Trip.com Chengdu route guide", type: "travel platform", url: "https://you.ctrip.com/travels/chengdu104/4090365.html" },
      { label: "Lonely Planet Chengdu guide", type: "international", url: "https://www.lonelyplanet.com/articles/guide-to-chengdu-china" },
    ],
    internationalRelevance: "High",
    localRelevance: "High",
    operationalAccessibility: "Needs current verification",
    evidenceGrade: "B",
    spiceRisk: "medium",
    indoor: false,
    photogenic: true,
    demoPersonalFit: 80,
    demoEvidenceConfidence: 68,
    x: 55, y: 40,
  },
  {
    id: "eastern-suburb-memory",
    name: "Eastern Suburb Memory",
    zhName: "东郊记忆",
    image: {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/%E4%B8%9C%E9%83%8A%E8%AE%B0%E5%BF%86-by%E6%9C%A8%E6%A3%89_-_panoramio.jpg?width=1200",
      alt: "Eastern Suburb Memory in Chengdu",
      source: "Wikimedia Commons / Panoramio",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:%E4%B8%9C%E9%83%8A%E8%AE%B0%E5%BF%86-by%E6%9C%A8%E6%A3%89_-_panoramio.jpg",
    },
    category: "Industrial Heritage & Creative",
    categoryZh: "工业遗产 · 创意街区",
    area: "Chenghua",
    duration: 85,
    distanceFromStartMin: 28,
    tags: ["photogenic", "contemporary", "creative", "retail", "urban texture"],
    whyFits: "A contemporary urban-texture option for photography and creative spaces — non-classic Chengdu.",
    whyFitsZh: "适合摄影和创意空间的当代城市肌理，非经典成都路线。",
    intro:
      "A former state-owned electronics factory turned creative park — think Beijing's 798 but smaller, with locomotive relics and Soviet-style smokestacks left in place. Independent bookstores, vinyl bars, small live-music venues, and a rotating roster of graffiti walls make it Chengdu's most photogenic non-classical block after dark.",
    introZh:
      "原国营红光电子管厂改造的创意园区 —— 像迷你版 798，保留了火车头和苏式烟囱。独立书店、黑胶酒吧、小型 livehouse，加上不停轮换的涂鸦墙，是成都最上镜的非传统夜景街区。",
    bestTime: "16:30 onwards for golden hour + neon.",
    bestTimeZh: "16:30 之后可以吃到黄昏光和霓虹。",
    ticket: { price: "Free", priceZh: "免费", hours: "Open 24h; shops 10:00–22:00" },
    transit: {
      metro: "Line 7 · Eastern Suburb Memory, Exit D",
      metroZh: "地铁 7 号线 · 东郊记忆站 D 口",
      walkMin: 4,
      tips: "Taxi from Taikoo Li is 20 min in light traffic.",
      tipsZh: "太古里打车 20 分钟。",
    },
    nearby: [
      { name: "NU Space livehouse", nameZh: "NU 空间", kind: "bar", note: "Small-room indie shows most weekends.", noteZh: "周末常有独立小型演出。", walkMin: 3 },
      { name: "OCT Loft cafe row", nameZh: "OCT 咖啡集", kind: "cafe", note: "Cluster of specialty roasters.", noteZh: "一整排精品咖啡。", walkMin: 5 },
      { name: "Vinyl Time record shop", nameZh: "黑胶时代", kind: "shop", note: "Deep China rock catalogue.", noteZh: "中文摇滚黑胶收得深。", walkMin: 2 },
    ],
    whatToKnow: "Less central — route fit matters more than raw popularity.",
    whatToKnowZh: "离中心区较远，与整体路线的契合度比单点热度更重要。",
    notFor: "Travelers who only want traditional culture or very short walks.",
    risk: "May be dropped if total route time gets tight.",
    riskZh: "总时间紧张时可能被剔除。",
    sourceSummary: "Trip.com place page + city context; no reviews copied.",
    sources: [
      { label: "Trip.com place page", type: "travel platform", url: "https://you.ctrip.com/sight/chengdu104/1475942.html" },
      { label: "Chengdu city context", type: "official/context", url: "https://news.chengdu.cn/2025/0804/68907b67af1bba2d2d386e22.html" },
    ],
    internationalRelevance: "Medium",
    localRelevance: "High",
    operationalAccessibility: "Needs current verification",
    evidenceGrade: "A",
    spiceRisk: "low",
    indoor: false,
    photogenic: true,
    demoPersonalFit: 73,
    demoEvidenceConfidence: 70,
    x: 78, y: 45,
  },
  {
    id: "du-fu-thatched-cottage",
    name: "Du Fu Thatched Cottage",
    zhName: "杜甫草堂",
    image: {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Chengdu_Sichuan_China_Du-Fu-Thatched-Cottage-Park-01.jpg?width=1200",
      alt: "Du Fu Thatched Cottage Park in Chengdu",
      source: "Wikimedia Commons / Uwe Aranas",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Chengdu_Sichuan_China_Du-Fu-Thatched-Cottage-Park-01.jpg",
    },
    category: "Literature & Garden",
    categoryZh: "文学 · 园林",
    area: "Qingyang",
    duration: 90,
    distanceFromStartMin: 26,
    tags: ["history", "garden", "culture", "quiet", "photogenic"],
    whyFits: "A slower cultural place with garden texture and literary context — good for a calmer route.",
    whyFitsZh: "节奏舒缓的文化点，园林与文学氛围，适合安静路线。",
    intro:
      "Tang-dynasty poet Du Fu lived here for four years while fleeing the An Lushan rebellion, writing more than 240 poems in a bamboo-and-thatch cottage. The reconstructed park is 240 mu of literary landscape — koi ponds, plum grove, calligraphy halls, and one of China's most tranquil bamboo groves. Bring headphones and let the audio guide translate the poems in place.",
    introZh:
      "杜甫为避安史之乱在此定居四年，写下 240 多首诗。如今 240 亩园林重建 —— 锦鲤池、梅园、书法馆，还有全国最静谧的竹林之一。带耳机来，让讲解把诗当场翻译。",
    bestTime: "Morning 09:00–11:00 for still water and light through bamboo.",
    bestTimeZh: "上午 09:00–11:00 水面平静、竹叶透光。",
    ticket: {
      price: "50 RMB",
      priceZh: "50 元",
      hours: "08:00–18:00 (last entry 17:30)",
      bookingUrl: "https://www.cddfct.com/",
    },
    transit: {
      metro: "Line 4 · Caotang Road, Exit B",
      metroZh: "地铁 4 号线 · 草堂北路 B 口",
      walkMin: 8,
      tips: "Skip the east gate line — walk to the north gate.",
      tipsZh: "东门常排队，绕到北门更快。",
    },
    nearby: [
      { name: "Huanhua Xi park path", nameZh: "浣花溪公园步道", kind: "view", note: "Free lakeside extension right next door.", noteZh: "紧邻的免费湖畔延伸。", walkMin: 3 },
      { name: "Sichuan Museum", nameZh: "四川博物院", kind: "view", note: "Free, world-class bronze wing.", noteZh: "免费开放，青铜厅世界级。", walkMin: 6 },
      { name: "Ba Guo Bu Yi (mild set)", nameZh: "巴国布衣", kind: "food", note: "Sichuan-style banquet with clearly-marked mild dishes.", noteZh: "川菜宴，菜单标出不辣项。", walkMin: 10 },
    ],
    whatToKnow: "Value depends on cultural context; can feel thin without interpretation.",
    whatToKnowZh: "缺乏文化背景时体验会较薄。",
    notFor: "Travelers who prefer contemporary spaces or food-first exploration.",
    risk: "English interpretation quality should be checked.",
    riskZh: "英文讲解质量需核实。",
    sourceSummary: "Travel-platform attractions + Chengdu context.",
    sources: [
      { label: "Trip.com attractions", type: "travel platform", url: "https://you.ctrip.com/sight/chengdu104.html" },
      { label: "Tripadvisor Chengdu", type: "international", url: "https://www.tripadvisor.com/Attractions-g297463-Activities-Chengdu_Sichuan.html" },
    ],
    internationalRelevance: "Medium",
    localRelevance: "High",
    operationalAccessibility: "Needs current verification",
    evidenceGrade: "B",
    spiceRisk: "none",
    indoor: false,
    photogenic: true,
    demoPersonalFit: 78,
    demoEvidenceConfidence: 64,
    x: 25, y: 58,
  },
  {
    id: "panda-base",
    name: "Chengdu Panda Base",
    zhName: "成都大熊猫繁育研究基地",
    image: {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Giant_Panda_at_Chengdu_Panda_Base.jpg?width=1200",
      alt: "Giant panda at Chengdu Panda Base",
      source: "Wikimedia Commons / M. Häggström",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Giant_Panda_at_Chengdu_Panda_Base.jpg",
    },
    category: "Classic Attraction",
    categoryZh: "经典景点",
    area: "Chenghua North",
    duration: 150,
    distanceFromStartMin: 42,
    tags: ["classic", "family", "wildlife", "high international relevance"],
    whyFits: "A signature Chengdu attraction with very high international recognition.",
    whyFitsZh: "国际认知度极高的成都标志性景点。",
    intro:
      "The world's leading giant-panda breeding center houses roughly 200 pandas in a 3,570-mu forested campus. Come before 09:30 — that's the only window the pandas are actively eating and playing before their marathon nap. The red-panda enclosures are underrated: they walk on the guest paths.",
    introZh:
      "全球领先的大熊猫繁育中心，占地 3570 亩，饲养约 200 只熊猫。9:30 前必须到 —— 只有早上熊猫才活跃地吃竹子玩耍，之后进入马拉松式睡眠。小熊猫区被低估：它们会走在游客步道上。",
    bestTime: "Gate opens 07:30. Be inside by 08:30 for morning feeding.",
    bestTimeZh: "07:30 开门。08:30 前进园赶上早餐时间。",
    ticket: {
      price: "55 RMB (adults)",
      priceZh: "55 元（成人）",
      hours: "07:30–18:00 (last entry 17:00)",
      bookingUrl: "https://ticket.panda.org.cn/",
      note: "Book on official site 1–7 days ahead; passport ID required at gate.",
    },
    transit: {
      metro: "Line 3 · Panda Avenue → panda shuttle, or Metro Line 3 to Panda Ave then bus 198",
      metroZh: "地铁 3 号线 · 熊猫大道 → 熊猫专线，或熊猫大道换 198 路",
      walkMin: 2,
      tips: "Total 60–75 min from Taikoo Li; not ideal for a 4h afternoon.",
      tipsZh: "从太古里全程 60–75 分钟，4 小时下午不推荐。",
    },
    nearby: [
      { name: "Panda Base sunrise cafe", nameZh: "熊猫基地晨光咖啡", kind: "cafe", note: "Inside the park, decent latte.", noteZh: "园内，拿铁不错。", walkMin: 0 },
      { name: "Sanshengxiang flower town", nameZh: "三圣乡花乡", kind: "view", note: "Village-style extension if you have all day.", noteZh: "整天时间可延伸到花乡。", walkMin: 25 },
    ],
    whatToKnow: "Can dominate a half-day and clash with a quiet central-city route.",
    whatToKnowZh: "会占满半天，与安静的中心城区路线容易冲突。",
    notFor: "Travelers with only four hours who prefer walkable local neighborhoods.",
    risk: "Likely excluded from this default route due to distance and time cost.",
    riskZh: "因距离和时间成本，默认路线可能剔除。",
    sourceSummary: "International attraction pages + local travel platform.",
    sources: [
      { label: "Tripadvisor Panda Base", type: "international", url: "https://www.tripadvisor.com/Attraction_Review-g297463-d457089-Reviews-Giant_Panda_Breeding_Research_Base_Xiongmao_Jidi-Chengdu_Sichuan.html" },
      { label: "Trip.com attractions", type: "travel platform", url: "https://you.ctrip.com/sight/chengdu104.html" },
    ],
    internationalRelevance: "High",
    localRelevance: "High",
    operationalAccessibility: "Needs current verification",
    evidenceGrade: "B",
    spiceRisk: "none",
    indoor: false,
    photogenic: true,
    demoPersonalFit: 62,
    demoEvidenceConfidence: 78,
    x: 82, y: 18,
  },
  {
    id: "taikoo-li-street-loop",
    name: "Taikoo Li Street Loop",
    zhName: "太古里街区动线",
    image: {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Taikoo_Li_Chengdu_skyline.jpg?width=1200",
      alt: "Taikoo Li Chengdu skyline",
      source: "Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Taikoo_Li_Chengdu_skyline.jpg",
    },
    category: "Retail & Urban Walk",
    categoryZh: "商业 · 城市漫步",
    area: "Taikoo Li",
    duration: 55,
    distanceFromStartMin: 0,
    tags: ["nearby", "urban texture", "shopping", "photogenic", "low friction"],
    whyFits: "A low-friction start point — orientation, architecture, and short urban photography.",
    whyFitsZh: "低门槛的起点：熟悉方位、拍建筑、短距离城市摄影。",
    intro:
      "The Herzog-adjacent grey-tile low-rise district wraps the 1000-year-old Daci Temple in Aesop, Muji, and Fangsuo Bookstore. It's the easiest orientation walk in the city — walk one lap and you understand the geography that connects Chunxi Road, the Jin River, and the metro. The Daci Temple in the middle is free and disarmingly quiet.",
    introZh:
      "灰瓦低层的街区把千年大慈寺围在中间，包住 Aesop、无印良品和方所书店。绕一圈是熟悉市中心地理最快的方式 —— 从春熙路、锦江到地铁，一次搞清楚。中间的大慈寺免费开放，出奇地安静。",
    bestTime: "17:30–19:30 for lit-up architecture without midday heat.",
    bestTimeZh: "17:30–19:30 灯亮起来，还能避开正午暴晒。",
    ticket: { price: "Free (Daci Temple included)", priceZh: "免费（含大慈寺）", hours: "10:00–22:00" },
    transit: {
      metro: "Line 2 / Line 3 · Chunxi Road, Exit D",
      metroZh: "地铁 2/3 号线 · 春熙路站 D 口",
      walkMin: 3,
      tips: "Exit D2 pops you next to the Aesop courtyard.",
      tipsZh: "D2 口正好到 Aesop 院子。",
    },
    nearby: [
      { name: "Fangsuo Bookstore", nameZh: "方所书店", kind: "shop", note: "Underground design temple; 2h if you love print.", noteZh: "地下的设计圣殿；纸书控可待 2 小时。", walkMin: 1 },
      { name: "Yu Zhi Lan (mild set)", nameZh: "玉芝兰", kind: "food", note: "Michelin-listed Sichuan, has non-spicy tasting.", noteZh: "米其林川菜，有不辣套餐。", walkMin: 5 },
      { name: "Chunxi Road", nameZh: "春熙路", kind: "view", note: "Neon flagships and the giant IFS panda.", noteZh: "霓虹旗舰店 + IFS 巨型熊猫。", walkMin: 4 },
    ],
    whatToKnow: "Polished and commercial — balance with more local texture.",
    whatToKnowZh: "偏商业和光鲜，需要与更在地的选项搭配。",
    notFor: "Travelers avoiding retail districts.",
    risk: "May feel less distinctive if used as the main experience.",
    riskZh: "作为主体体验会略缺特色。",
    sourceSummary: "Demo editorial source + map-ready POI structure.",
    sources: [
      { label: "Wikipedia Taikoo Li", type: "reference", url: "https://en.wikipedia.org/wiki/Sino-Ocean_Taikoo_Li_Chengdu" },
    ],
    internationalRelevance: "High",
    localRelevance: "Medium",
    operationalAccessibility: "Open access",
    evidenceGrade: "B",
    spiceRisk: "low",
    indoor: false,
    photogenic: true,
    demoPersonalFit: 70,
    demoEvidenceConfidence: 66,
    x: 60, y: 58,
  },
  {
    id: "jinli-alley",
    name: "Jinli Ancient Street",
    zhName: "锦里古街",
    image: {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Jinli_Street_Chengdu.jpg?width=1200",
      alt: "Jinli Ancient Street in Chengdu",
      source: "Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Jinli_Street_Chengdu.jpg",
    },
    category: "Traditional Street",
    categoryZh: "传统街区",
    area: "Wuhou",
    duration: 60,
    distanceFromStartMin: 24,
    tags: ["traditional", "food street", "photogenic", "evening", "touristy"],
    whyFits: "Compact traditional street with evening atmosphere and non-spicy snack options if chosen carefully.",
    whyFitsZh: "紧凑的传统街区，傍晚氛围好，谨慎挑选也有不辣的小吃。",
    intro:
      "A 350-metre Qing-style pedestrian street stapled to the side of Wuhou Shrine — think Three Kingdoms costumes, red lanterns, sugar-painting artisans, and 30-plus food stalls. It's unashamedly a tourist street; the trick is going 30 min before dusk so you catch both the light and the lantern-on moment.",
    introZh:
      "紧靠武侯祠的 350 米清代风步行街 —— 三国装、红灯笼、糖画师傅、30 多家小吃摊。就是游客街，不装 —— 关键是黄昏前 30 分钟到，同时吃到夕阳和亮灯瞬间。",
    bestTime: "17:00 arrival for dusk-to-lantern transition (about 40 min).",
    bestTimeZh: "17:00 到，正好赶上从黄昏到亮灯的 40 分钟。",
    ticket: { price: "Free", priceZh: "免费", hours: "10:00–22:00" },
    transit: {
      metro: "Line 3 · Gaoshengqiao, Exit B → 10 min walk",
      metroZh: "地铁 3 号线 · 高升桥 B 口 → 步行 10 分钟",
      walkMin: 10,
      tips: "Enter via Wuhou Shrine side for the prettiest first view.",
      tipsZh: "从武侯祠一侧进，第一眼最美。",
    },
    nearby: [
      { name: "Wuhou Shrine", nameZh: "武侯祠", kind: "view", note: "Three Kingdoms memorial garden, 60 RMB.", noteZh: "三国纪念园林，门票 60 元。", walkMin: 1 },
      { name: "San Da Pao rice cake stall", nameZh: "三大炮米糕", kind: "food", note: "Sweet, not spicy — the signature snack.", noteZh: "甜口不辣，招牌小吃。", walkMin: 2 },
      { name: "Rabbit-head grill (spicy!)", nameZh: "冷吃兔头（辣）", kind: "food", note: "Skip if avoiding spice.", noteZh: "不吃辣请跳过。", walkMin: 3 },
    ],
    whatToKnow: "Can be very crowded — arrive before dusk for photos.",
    whatToKnowZh: "人流密集，建议黄昏前抵达拍照。",
    notFor: "Travelers avoiding tourist-heavy streets.",
    risk: "Crowd and spice both need active filtering.",
    riskZh: "人流与辣味都需要主动过滤。",
    sourceSummary: "Reference material + travel platform.",
    sources: [
      { label: "Wikipedia Jinli", type: "reference", url: "https://en.wikipedia.org/wiki/Jinli" },
    ],
    internationalRelevance: "High",
    localRelevance: "Medium",
    operationalAccessibility: "Open access",
    evidenceGrade: "B",
    spiceRisk: "medium",
    indoor: false,
    photogenic: true,
    demoPersonalFit: 68,
    demoEvidenceConfidence: 62,
    x: 40, y: 68,
  },
];

export const findPlace = (id: string) => places.find((p) => p.id === id);
