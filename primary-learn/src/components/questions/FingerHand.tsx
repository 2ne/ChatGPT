const SKIN = "#f7c9a3";
const LINE = "#b06a3b";
const CREASE = "#c88858";

type Raised = {
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
  thumb: boolean;
};

/** 1 = index, 2 = index+middle, 3 = +ring, 4 = four fingers, 5 = all including thumb. */
function raisedFor(count: number): Raised {
  const n = Math.max(0, Math.min(5, Math.round(count)));
  return {
    index: n >= 1,
    middle: n >= 2,
    ring: n >= 3,
    pinky: n >= 4,
    thumb: n >= 5,
  };
}

function RaisedFinger({
  x,
  tilt,
  height,
  width,
}: {
  x: number;
  tilt: number;
  height: number;
  width: number;
}) {
  const top = width * 0.4;
  const base = width * 0.54;
  const r = width * 0.4;
  return (
    <path
      transform={`translate(${x} 94) rotate(${tilt})`}
      d={`M ${-base} 12 L ${-top} ${14 - height} A ${r} ${r} 0 0 1 ${top} ${14 - height} L ${base} 12 Z`}
    />
  );
}

function FoldedFinger({ x, tilt, width }: { x: number; tilt: number; width: number }) {
  const r = width / 2;
  const len = 34;
  return (
    <path
      transform={`translate(${x} 94) rotate(${tilt})`}
      d={`M ${-r + 1} -2 L ${-r} ${len - r} A ${r} ${r} 0 0 0 ${r} ${len - r} L ${r - 1} -2 Z`}
    />
  );
}

export function FingerHand({ count }: { count: number }) {
  const up = raisedFor(count);
  return (
    <svg
      className="finger-hand-svg"
      viewBox="-6 -2 214 182"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
    >
      <g
        fill={SKIN}
        stroke={LINE}
        strokeWidth={4.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {up.pinky ? <RaisedFinger x={52} tilt={-14} height={76} width={23} /> : null}
        {up.ring ? <RaisedFinger x={80} tilt={-5} height={88} width={25} /> : null}
        {up.middle ? <RaisedFinger x={110} tilt={3} height={94} width={25} /> : null}
        {up.index ? <RaisedFinger x={140} tilt={13} height={84} width={25} /> : null}
        {up.thumb ? (
          <path
            transform="translate(156 120) rotate(-50)"
            d="M -12 12 L 50 10 A 15 15 0 0 0 48 -18 L -6 -16 A 13 13 0 0 0 -12 12 Z"
          />
        ) : null}
        <path d="M50 96 C38 100 32 114 36 130 C40 148 56 156 78 158 L78 160 C78 167 86 174 100 174 C114 174 122 167 122 160 L122 158 C144 156 162 148 166 130 C170 114 164 100 150 96 C140 92 126 88 100 88 C74 88 58 92 50 96 Z" />
        {up.pinky ? null : <FoldedFinger x={56} tilt={-10} width={22} />}
        {up.ring ? null : <FoldedFinger x={82} tilt={-3} width={23} />}
        {up.middle ? null : <FoldedFinger x={110} tilt={3} width={23} />}
        {up.index ? null : <FoldedFinger x={138} tilt={10} width={23} />}
        {up.thumb ? null : (
          <path
            transform="translate(140 130) rotate(-22)"
            d="M -15 -11 L 20 -11 A 14 14 0 0 1 20 17 L -9 17 A 14 14 0 0 1 -15 -11 Z"
          />
        )}
      </g>
      <path
        d="M60 128 Q100 141 140 128"
        fill="none"
        stroke={CREASE}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
    </svg>
  );
}
