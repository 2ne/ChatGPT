import { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const visible = sections.find((section) => section.id === visibleId) ?? sections[0];

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      returnFocus.current?.focus();
    };
  }, [open]);

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

      {open ? (
        <div className="sheet-layer" onClick={() => setOpen(false)}>
          <div
            className="sheet sheet-toc"
            role="dialog"
            aria-modal="true"
            aria-labelledby="toc-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              className="sheet-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X size={20} aria-hidden />
            </button>
            <h2 id="toc-title" className="sheet-title toc-title">
              {copy.pickATopic}
            </h2>
            <ul className="toc-list">
              {sections.map((section, index) => {
                const newYear = index === 0 || sections[index - 1].year !== section.year;
                return (
                  <li key={section.id}>
                    {newYear ? (
                      <p className="toc-year-head">{section.year}</p>
                    ) : null}
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
                        setOpen(false);
                        onJump(section);
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
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
