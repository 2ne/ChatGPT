import type { MoneyAsset } from "../types/activity";

export function moneyLabel(item: MoneyAsset): string {
  return item.kind === "note" ? `£${item.value}` : item.value >= 100 ? `£${item.value / 100}` : `${item.value}p`;
}

export function describeMoney(money: MoneyAsset[]): string {
  return money.map(item => `${moneyLabel(item)} ${item.kind}`).join(" and ");
}
