import { useState } from "react";
import { copy } from "../../data/copy";
import { questionMoney } from "../../lib/money";
import type { Question } from "../../types/activity";
import { MoneyPicture } from "./MoneyPicture";

/** Optional teaching after scoring. It never changes the submitted answer. */
export function MoneyDemonstration({ question }: { question: Question }) {
  const [open, setOpen] = useState(false);
  const coin = questionMoney(question).find(item => item.kind === "coin" && [2, 5, 10].includes(item.value));
  if (!coin) return null;
  return <div className="money-learning">
    <button type="button" className="btn btn-secondary" aria-expanded={open} onClick={() => setOpen(!open)}>{copy.showMe}</button>
    {open ? <div className="money-demo-content">
      <p>{copy.moneyValueDemo(coin.value)}</p>
      <MoneyPicture money={[coin]} />
      <div className="money-pennies" role="img" aria-label={copy.moneyPennies(coin.value)}>
        {Array.from({ length: coin.value }, (_, i) => <span key={i} aria-hidden><MoneyPicture money={[{ kind: "coin", value: 1 }]} compact /></span>)}
      </div>
    </div> : null}
  </div>;
}
