export function BrandMark() {
  return (
    <div className="brand-row">
      <span className="brand-mark" aria-hidden>
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 2C5.5 5.2 4 7.2 4 9a4 4 0 008 0c0-1.8-1.5-3.8-4-7z"
            fill="#14bf96"
          />
          <path d="M8 9v4" stroke="#14bf96" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <span className="brand-name">Primary Path</span>
    </div>
  );
}
