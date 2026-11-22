import { expect, test } from "bun:test";
import { SAMPLE, readBrief, newPlan, fillPlan, changeWeather, toggleStop, routeStops, dinnerOptions, recommendStops } from "./travel-plan";
import { wanderRoute } from "./wander";
import { computeRoute } from "./tripMath";
import { useTravelPlan } from "./travel-plan-store";

function brief() {
  const result = readBrief(SAMPLE.zh);
  if (!result) throw new Error("Missing sample brief");
  return result;
}

test("一句话解析成都下午四小时、今晚成都与明天九寨沟", () => {
  expect(brief().minutes).toBe(240);
  expect(brief().start).toBe("Taikoo Li");
  expect(brief().noSpice).toBe(true);
  expect(readBrief("今天成都玩四小时，不去九寨沟")).toBeNull();
});

test("托管补全保留用户已选酒店和地点", () => {
  const manual = toggleStop(newPlan(brief(), "manual"), "jinli-alley", false);
  const filled = fillPlan({ ...manual, chengduHotel: "central" });
  expect(filled.sunnyStops).toEqual(["jinli-alley"]);
  expect(filled.chengduHotel).toBe("central");
  expect(filled.step).toBe("summary");
  expect(filled.transfer).toBe("bus");
  expect(filled.jiuzhaiHotel).toBe("holiday");
});

test("晴雨选择独立，来回切换保留原景点并取消旧保存标记", () => {
  const sunny = toggleStop(newPlan(brief(), "manual"), "jinli-alley", false);
  let rainy = changeWeather(sunny, true);
  expect(routeStops(rainy).every((p) => p.indoor)).toBe(true);
  rainy = toggleStop(rainy, "fangsuo-bookstore", true);
  const rainIds = routeStops(rainy).map((p) => p.id);
  const restored = changeWeather({ ...rainy, saved: true }, false);
  expect(restored.saved).toBe(false);
  expect(routeStops(restored).map((p) => p.id)).toEqual(["jinli-alley"]);
  expect(routeStops(changeWeather(restored, true)).map((p) => p.id)).toEqual(rainIds);
});

test("漫游路线含二到三站且估算不超过180分钟，雨天只含室内", () => {
  for (const mood of ["tea", "lanes", "indoor"] as const) {
    for (let seed = 0; seed < 6; seed++) {
      const stops = wanderRoute(mood, seed, mood === "indoor");
      expect(stops.length >= 2 && stops.length <= 3).toBe(true);
      expect(computeRoute(stops).totalMin <= 180).toBe(true);
      if (mood === "indoor") expect(stops.every((p) => p.indoor)).toBe(true);
    }
  }
});

test("晚餐只给三个候选，地点选择不可超出四小时时间", () => {
  let plan = newPlan(brief(), "manual");
  for (const id of ["jinli-alley", "wenshu-monastery", "peoples-park", "chengdu-museum"]) plan = toggleStop(plan, id, false);
  expect(computeRoute(routeStops(plan), plan.brief.start).totalMin <= 240).toBe(true);
  expect(dinnerOptions(plan).length).toBe(3);
});

test("同一草稿保存天气和自选/托管模式，不创建第二份行程", () => {
  const plan = changeWeather(newPlan(brief(), "guided"), true);
  useTravelPlan.getState().setPlan(plan);
  useTravelPlan.getState().setEntryMode("wander");
  useTravelPlan.getState().setEntryMode("plan");
  expect(useTravelPlan.getState().plan?.rain).toBe(true);
  expect(useTravelPlan.getState().plan?.sunnyStops).toEqual(plan.sunnyStops);
});
import { isRainy } from "./weather";
test("下雨自动判断：有降水或雨类天气代码即为雨天", () => {
  expect(isRainy(0, 0)).toBe(false);
  expect(isRainy(3, 0)).toBe(false);
  expect(isRainy(61, 0)).toBe(true);
  expect(isRainy(2, 0.5)).toBe(true);
});

test("雨天半日路线不止一站", () => {
  const brief = readBrief(SAMPLE.zh)!;
  expect(recommendStops({ ...brief, rain: true }, true).length >= 2).toBe(true);
});
