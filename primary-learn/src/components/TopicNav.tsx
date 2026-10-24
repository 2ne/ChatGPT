import { Sheet, SheetTitle } from "./Sheet";
import { useRef, useState } from "react";
import { Menu, Star, Trophy, X } from "lucide-react";
import { copy } from "../data/copy";

export type TopicSection = {
  id: string;
  year: string;
  title: string;
  signY: number;
  stars: number;
  cup: boolean;
  hasYou: boolean;
};

type TopicNavProps = {
  sections: TopicSection[];
  visibleId: string;
  learnerEmoji: string;
  onJump: (section: TopicSection) => void;
};

export function TopicNav({ sections, visibleId, learnerEmoji, onJump }: TopicNavProps) {
  const pendingSection = useRef<TopicSection | null>(null);
  const [open, setOpen] = useState(false);
  const visible = sections.find((section) => section.id === visibleId) ?? sections[0];

  if (!visible) return null;

  return (
    <>
      <button
        type="button"
        className="map-toc-pill"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${copy.pickATopic}. ${copy.sectionLabel(visible.year, visible.title)}`}
        onClick={() => setOpen(true)}
      >
        <span className="map-toc-text">
          <span className="map-toc-year">{visible.year}</span>
          <span aria-hidden> · </span>
          <span className="map-toc-topic">{visible.title}</span>
        </span>
        <span className="map-toc-menu" aria-hidden>
          <Menu size={20} />
        </span>
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} className="sheet-toc" onAfterClose={() => {if (pendingSection.current) {onJump(pendingSection.current);pendingSection.current = null;}}}>
            <button
              type="button"
              className="sheet-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X size={20} aria-hidden />
            </button>
            <SheetTitle className="sheet-title toc-title">
              {copy.pickATopic}
            </SheetTitle>
            <ul className="toc-years">
              {Array.from(new Set(sections.map(section => section.year))).map(year => (
                <li key={year} className="toc-year-group">
                  <h3 className="toc-year-head">{year}</h3>
                  <ul className="toc-list">
                    {sections.filter(section => section.year === year).map(section => (
                  <li key={section.id}>
                    <button
                      type="button"
                      className={`toc-row${section.id === visibleId ? " is-now" : ""}`}
                      aria-current={section.id === visibleId ? "true" : undefined}
                      aria-label={[
                        copy.sectionLabel(section.year, section.title),
                        section.hasYou ? copy.youAreHere : null,
                        section.cup ? "gold cup" : section.stars > 0 ? "stars" : null,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                      onClick={() => {
                        pendingSection.current = section;
                        setOpen(false);
                      }}
                    >
                      <span className="toc-row-title">{section.title}</span>
                      {section.hasYou ? (
                        <span className="toc-you" aria-hidden>
                          {learnerEmoji}
                        </span>
                      ) : null}
                      {section.cup ? (
                        <Trophy size={16} aria-hidden />
                      ) : section.stars > 0 ? (
                        <Star size={16} fill="currentColor" aria-hidden />
                      ) : null}
                    </button>
                  </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
      </Sheet>
    </>
  );
}
