import type { MoneyAsset } from "../types/activity";

export function moneyLabel(item: MoneyAsset): string {
  return item.kind === "note" ? `£${item.value}` : item.value >= 100 ? `£${item.value / 100}` : `${item.value}p`;
}

export function describeMoney(money: MoneyAsset[]): string {
  return money.map(item => `${moneyLabel(item)} ${item.kind}`).join(" and ");
}

/** Assessed denominations only. Incorrect answer options are excluded. */
export function questionMoney(question: import("../types/activity").Question): MoneyAsset[] {
  if (question.money?.length) return question.money;
  if (question.kind === "ordered") return question.items.flatMap(item => item.money ?? []);
  if (question.kind === "multiple-choice") return question.options.find(option => option.id === question.correctId)?.money ?? [];
  if (question.kind === "multi-select") return question.options.filter(option => question.correctIds.includes(option.id)).flatMap(option => option.money ?? []);
  return [];
}
export function moneyToPractise(questions: import("../types/activity").Question[], results: Record<string, boolean>): MoneyAsset[] {
  const items = questions.filter(question => results[question.id] === false).flatMap(questionMoney);
  return [...new Map(items.map(item => [`${item.kind}:${item.value}`, item])).values()]
    .sort((a, b) => (a.kind === "coin" ? a.value : a.value * 100) - (b.kind === "coin" ? b.value : b.value * 100));
}
/** Keep interaction kinds in their authored slots while revisiting weak values earlier. */
export function prioritiseMoney(questions: import("../types/activity").Question[], practice: MoneyAsset[] = []) {
  if (!practice.length) return questions;
  const score = (question: import("../types/activity").Question) => questionMoney(question).filter(item => practice.some(target => target.kind === item.kind && target.value === item.value)).length;
  const pools = new Map<string, import("../types/activity").Question[]>();
  for (const question of questions) pools.set(question.kind, [...(pools.get(question.kind) ?? []), question]);
  for (const pool of pools.values()) pool.sort((a, b) => score(b) - score(a));
  return questions.map(question => pools.get(question.kind)!.shift()!);
}
