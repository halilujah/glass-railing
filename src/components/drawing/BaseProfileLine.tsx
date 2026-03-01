import type { Segment, LayoutParams } from '../../types';
import { BASE_SHOE_PROFILES } from '../../constants/profiles';

interface Props {
  segment: Segment;
  params: LayoutParams;
  scale: number;
}

/** Top-mount: continuous channel shoe on the floor surface */
function TopMountProfile({ x1, x2, y, profileH }: { x1: number; x2: number; y: number; profileH: number }) {
  return (
    <g>
      <rect className="base-profile-fill" x={x1} y={y} width={x2 - x1} height={profileH} />
      <line className="base-profile-line" x1={x1} y1={y} x2={x2} y2={y} />
      <line className="base-profile-line" x1={x1} y1={y + profileH} x2={x2} y2={y + profileH} style={{ strokeWidth: 1.5 }} />
    </g>
  );
}

/**
 * Side-mount: glass is mounted to a vertical wall/fascia via L-brackets.
 * Drawing shows (elevation view): vertical wall behind the glass,
 * horizontal L-brackets projecting outward at intervals.
 */
function SideMountProfile({ x1, x2, y, profileH, scale }: { x1: number; x2: number; y: number; profileH: number; scale: number }) {
  const bracketSpacing = 400 * scale;
  const bracketDepth = 40 * scale;   // how far bracket sticks out from wall
  const bracketThick = 6 * scale;    // bracket line thickness visual
  const brackets: number[] = [];
  for (let bx = x1 + bracketSpacing / 2; bx < x2; bx += bracketSpacing) {
    brackets.push(bx);
  }

  // Wall sits behind the glass at the bottom (y + profileH is floor level)
  // The wall runs vertically from panel top to floor
  const wallX = x2 + 12;  // wall line just to the right edge
  const wallTop = -10;
  const wallBottom = y + profileH + 5;

  return (
    <g>
      {/* Vertical wall surface behind glass (thick line on the back side) */}
      <rect x={x1 - 5} y={y} width={x2 - x1 + 10} height={profileH} fill="#e8ddd0" opacity={0.35} />
      <line stroke="#6d4c2a" strokeWidth={2} x1={x1} y1={y + profileH} x2={x2} y2={y + profileH} />

      {/* Horizontal L-brackets at intervals */}
      {brackets.map((bx, i) => {
        // Bracket: vertical plate + horizontal foot
        const bTop = y + 2;
        const bBottom = y + profileH;
        return (
          <g key={i}>
            {/* Vertical part of L-bracket */}
            <rect x={bx - bracketThick / 2} y={bTop} width={bracketThick} height={bBottom - bTop} fill="#8b7355" stroke="#6d4c2a" strokeWidth={0.5} />
            {/* Horizontal foot of L-bracket (the "L" part, pointing down to the wall) */}
            <rect x={bx - bracketDepth / 2} y={bBottom - bracketThick} width={bracketDepth} height={bracketThick} fill="#8b7355" stroke="#6d4c2a" strokeWidth={0.5} />
            {/* Bolt dots */}
            <circle cx={bx} cy={(bTop + bBottom) / 2} r={2 * scale} fill="#444" />
            <circle cx={bx} cy={(bTop + bBottom) / 2 + 15 * scale} r={2 * scale} fill="#444" />
          </g>
        );
      })}

      {/* Label */}
      <text x={(x1 + x2) / 2} y={y + profileH + 14} textAnchor="middle" fontSize={9} fill="#6d4c2a" fontStyle="italic">
        side-mount
      </text>
    </g>
  );
}

/** Core-drill: discrete post holes in the slab */
function CoreDrillProfile({ x1, x2, y, profileH, scale }: { x1: number; x2: number; y: number; profileH: number; scale: number }) {
  const postSpacing = 500 * scale;
  const postR = 12 * scale;
  const posts: number[] = [];
  for (let px = x1 + postSpacing / 2; px < x2; px += postSpacing) {
    posts.push(px);
  }
  const cy = y + profileH / 2;
  return (
    <g>
      {/* Slab / floor line */}
      <line stroke="#6d4c2a" strokeWidth={1.5} x1={x1} y1={y + profileH} x2={x2} y2={y + profileH} />
      {/* Post holes */}
      {posts.map((px, i) => (
        <g key={i}>
          <circle cx={px} cy={cy} r={postR} fill="none" stroke="#6d4c2a" strokeWidth={1.2} />
          <circle cx={px} cy={cy} r={postR * 0.35} fill="#6d4c2a" />
        </g>
      ))}
    </g>
  );
}

export function BaseProfileLine({ segment, params, scale }: Props) {
  const profile = BASE_SHOE_PROFILES.find(p => p.id === params.baseShoeProfileId);
  const channelDepth = profile?.channelDepth ?? 100;
  const panelHeight = params.systemHeight - channelDepth;

  const x1 = 0;
  const x2 = segment.length * scale;
  const y = panelHeight * scale;
  const profileH = channelDepth * scale;

  switch (params.mountingType) {
    case 'side-mount':
      return <SideMountProfile x1={x1} x2={x2} y={y} profileH={profileH} scale={scale} />;
    case 'core-drill':
      return <CoreDrillProfile x1={x1} x2={x2} y={y} profileH={profileH} scale={scale} />;
    default:
      return <TopMountProfile x1={x1} x2={x2} y={y} profileH={profileH} />;
  }
}
