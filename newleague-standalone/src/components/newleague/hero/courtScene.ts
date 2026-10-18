/**
 * Dependency-free 3D badminton arena renderer.
 *
 * A tiny perspective pipeline (camera → projection → depth-sorted polygons)
 * drawn with Canvas 2D. It renders a regulation-proportioned court, net,
 * overhead light rigs, distant stand lights, drifting particles and a
 * procedurally built shuttlecock.
 *
 * The geometry functions are pure and environment-agnostic so the same
 * projection is reused on the server to draw the static SVG poster
 * (see HeroPoster.tsx) that acts as the no-JS / no-canvas fallback.
 *
 * World units are metres. x = across the court, y = up, z = along the court
 * (net at z = 0, camera end is +z).
 */

export type Vec3 = [number, number, number];

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const scale = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a: Vec3, b: Vec3): number =>
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const normalize = (a: Vec3): Vec3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

/* ------------------------------------------------------------------ */
/* Camera                                                              */
/* ------------------------------------------------------------------ */

export interface Camera {
  pos: Vec3;
  right: Vec3;
  up: Vec3;
  fwd: Vec3;
  focal: number;
  cx: number;
  cy: number;
  width: number;
  height: number;
}

export function makeCamera(
  pos: Vec3,
  target: Vec3,
  width: number,
  height: number
): Camera {
  const fwd = normalize(sub(target, pos));
  const right = normalize(cross(fwd, [0, 1, 0]));
  const up = cross(right, fwd);
  // Fit vertically on landscape screens, horizontally on portrait screens so
  // the full court width stays visible on phones.
  const focalV = height / 2 / Math.tan((50 * Math.PI) / 360);
  const focalH = width / 2 / Math.tan((76 * Math.PI) / 360);
  return {
    pos,
    right,
    up,
    fwd,
    focal: Math.min(focalV, focalH),
    cx: width / 2,
    cy: height / 2,
    width,
    height,
  };
}

export interface Projected {
  x: number;
  y: number;
  /** Distance along the view direction. */
  z: number;
}

export function project(cam: Camera, p: Vec3): Projected | null {
  const d = sub(p, cam.pos);
  const z = dot(d, cam.fwd);
  if (z < 0.1) return null;
  return {
    x: cam.cx + (dot(d, cam.right) / z) * cam.focal,
    y: cam.cy - (dot(d, cam.up) / z) * cam.focal,
    z,
  };
}

/** World point that appears at a given normalised screen offset and depth. */
function screenAnchor(
  cam: Camera,
  nx: number,
  ny: number,
  depth: number
): Vec3 {
  const sx = ((nx * cam.width) / 2 / cam.focal) * depth;
  const sy = ((ny * cam.height) / 2 / cam.focal) * depth;
  return add(
    add(add(cam.pos, scale(cam.fwd, depth)), scale(cam.right, sx)),
    scale(cam.up, sy)
  );
}

/* ------------------------------------------------------------------ */
/* Static arena geometry                                              */
/* ------------------------------------------------------------------ */

const HALF_W = 3.05; // doubles width 6.10 m
const SINGLES_X = 2.59; // singles width 5.18 m
const HALF_L = 6.7; // length 13.40 m
const SHORT_SERVICE = 1.98;
const LONG_SERVICE_DOUBLES = HALF_L - 0.76;
const NET_TOP = 1.55;
const NET_BOTTOM = 0.79;

export type Segment = [Vec3, Vec3];

export function courtLines(): Segment[] {
  const s: Segment[] = [];
  const zLines = [
    -HALF_L,
    -LONG_SERVICE_DOUBLES,
    -SHORT_SERVICE,
    SHORT_SERVICE,
    LONG_SERVICE_DOUBLES,
    HALF_L,
  ];
  for (const z of zLines)
    s.push([
      [-HALF_W, 0, z],
      [HALF_W, 0, z],
    ]);
  for (const x of [-HALF_W, -SINGLES_X, SINGLES_X, HALF_W])
    s.push([
      [x, 0, -HALF_L],
      [x, 0, HALF_L],
    ]);
  s.push([
    [0, 0, SHORT_SERVICE],
    [0, 0, HALF_L],
  ]);
  s.push([
    [0, 0, -SHORT_SERVICE],
    [0, 0, -HALF_L],
  ]);
  return s;
}

export function netGeometry(): {
  mesh: Segment[];
  tape: Segment;
  posts: Segment[];
} {
  const mesh: Segment[] = [];
  for (let x = -HALF_W; x <= HALF_W + 1e-6; x += 0.19)
    mesh.push([
      [x, NET_BOTTOM, 0],
      [x, NET_TOP, 0],
    ]);
  for (let y = NET_BOTTOM; y <= NET_TOP + 1e-6; y += 0.095)
    mesh.push([
      [-HALF_W, y, 0],
      [HALF_W, y, 0],
    ]);
  return {
    mesh,
    tape: [
      [-HALF_W - 0.05, NET_TOP, 0],
      [HALF_W + 0.05, NET_TOP, 0],
    ],
    posts: [
      [
        [-HALF_W - 0.05, 0, 0],
        [-HALF_W - 0.05, NET_TOP + 0.03, 0],
      ],
      [
        [HALF_W + 0.05, 0, 0],
        [HALF_W + 0.05, NET_TOP + 0.03, 0],
      ],
    ],
  };
}

const LAMPS: Vec3[] = [];
for (const z of [-7, -2.2, 2.6])
  for (const x of [-4.6, 4.6]) LAMPS.push([x, 9.5, z]);

/* ------------------------------------------------------------------ */
/* Shuttlecock mesh (local units: centimetres, axis = +y)             */
/* ------------------------------------------------------------------ */

type FaceKind = 'cork' | 'band' | 'feather';

interface LocalFace {
  kind: FaceKind;
  pts: Vec3[];
  /** Point used to orient normals outward on closed parts. */
  ref?: Vec3;
}

interface LocalLine {
  kind: 'shaft' | 'thread';
  a: Vec3;
  b: Vec3;
}

const FEATHERS = 16;
const SKIRT_BASE_R = 1.15;
const SKIRT_BASE_Y = 1.0;
const SKIRT_TOP_R = 3.3;
const SKIRT_TOP_Y = 7.3;
const CORK_R = 1.3;

function skirtPoint(angle: number, t: number): Vec3 {
  const r = SKIRT_BASE_R + (SKIRT_TOP_R - SKIRT_BASE_R) * t;
  const y = SKIRT_BASE_Y + (SKIRT_TOP_Y - SKIRT_BASE_Y) * t;
  return [r * Math.cos(angle), y, r * Math.sin(angle)];
}

function buildShuttle(): { faces: LocalFace[]; lines: LocalLine[] } {
  const faces: LocalFace[] = [];
  const lines: LocalLine[] = [];
  const centre: Vec3 = [0, 0, 0];

  // Cork: hemisphere below y = 0.
  const LAT = 5;
  const LON = 20;
  for (let i = 0; i < LAT; i++) {
    const p0 = (i / LAT) * (Math.PI / 2);
    const p1 = ((i + 1) / LAT) * (Math.PI / 2);
    for (let j = 0; j < LON; j++) {
      const t0 = (j / LON) * Math.PI * 2;
      const t1 = ((j + 1) / LON) * Math.PI * 2;
      const pt = (p: number, t: number): Vec3 => [
        CORK_R * Math.cos(p) * Math.cos(t),
        -CORK_R * Math.sin(p),
        CORK_R * Math.cos(p) * Math.sin(t),
      ];
      faces.push({
        kind: 'cork',
        pts: [pt(p0, t0), pt(p0, t1), pt(p1, t1), pt(p1, t0)],
        ref: centre,
      });
    }
  }
  // Cork cylinder with a coloured band (tape) near the top.
  const bands: Array<[number, number, FaceKind]> = [
    [0, 0.2, 'cork'],
    [0.2, 0.75, 'band'],
    [0.75, SKIRT_BASE_Y, 'cork'],
  ];
  for (const [y0, y1, kind] of bands) {
    for (let j = 0; j < LON; j++) {
      const t0 = (j / LON) * Math.PI * 2;
      const t1 = ((j + 1) / LON) * Math.PI * 2;
      const r = kind === 'band' ? CORK_R + 0.02 : CORK_R;
      faces.push({
        kind,
        pts: [
          [r * Math.cos(t0), y0, r * Math.sin(t0)],
          [r * Math.cos(t1), y0, r * Math.sin(t1)],
          [r * Math.cos(t1), y1, r * Math.sin(t1)],
          [r * Math.cos(t0), y1, r * Math.sin(t0)],
        ],
        ref: [0, (y0 + y1) / 2, 0],
      });
    }
  }

  // Feathers: each vane is a 7-point outline along its shaft.
  const profile: Array<[t: number, halfAngle: number]> = [
    [0.2, 0.08],
    [0.78, 0.215],
    [0.97, 0.17],
  ];
  for (let i = 0; i < FEATHERS; i++) {
    const a = (i / FEATHERS) * Math.PI * 2;
    const left = profile.map(([t, w]) => skirtPoint(a - w, t));
    const right = profile.map(([t, w]) => skirtPoint(a + w, t)).reverse();
    faces.push({
      kind: 'feather',
      pts: [...left, skirtPoint(a, 1.03), ...right],
    });
    lines.push({ kind: 'shaft', a: skirtPoint(a, 0), b: skirtPoint(a, 0.98) });
  }

  // Two thread rings binding the feathers.
  const SEG = 32;
  for (const t of [0.33, 0.5]) {
    for (let j = 0; j < SEG; j++) {
      lines.push({
        kind: 'thread',
        a: skirtPoint((j / SEG) * Math.PI * 2, t),
        b: skirtPoint(((j + 1) / SEG) * Math.PI * 2, t),
      });
    }
  }
  return { faces, lines };
}

const SHUTTLE = buildShuttle();

/* ------------------------------------------------------------------ */
/* Frame description                                                   */
/* ------------------------------------------------------------------ */

export interface ShuttlePose {
  position: Vec3;
  /** Spin around its own axis (radians). */
  spin: number;
  /** Tilt of the axis (radians) — rotation about the camera-facing z axis. */
  roll: number;
  /** Pitch of the axis toward / away from the camera (radians). */
  pitch: number;
  /** World metres per local centimetre. */
  size: number;
}

export type Primitive =
  | {
      type: 'poly';
      depth: number;
      pts: Array<{ x: number; y: number }>;
      fill: string;
      stroke?: string;
      lineWidth?: number;
    }
  | {
      type: 'line';
      depth: number;
      a: { x: number; y: number };
      b: { x: number; y: number };
      stroke: string;
      lineWidth: number;
    };

function rotate(p: Vec3, pose: ShuttlePose): Vec3 {
  // spin about local y
  const cs = Math.cos(pose.spin);
  const ss = Math.sin(pose.spin);
  let [x, y, z] = [p[0] * cs + p[2] * ss, p[1], -p[0] * ss + p[2] * cs];
  // pitch about x
  const cp = Math.cos(pose.pitch);
  const sp = Math.sin(pose.pitch);
  [y, z] = [y * cp - z * sp, y * sp + z * cp];
  // roll about z
  const cr = Math.cos(pose.roll);
  const sr = Math.sin(pose.roll);
  [x, y] = [x * cr - y * sr, x * sr + y * cr];
  return [x, y, z];
}

const KEY_LIGHT = normalize([-0.45, 0.85, 0.55]);

function shade(
  base: Vec3,
  diffuse: number,
  rim: number,
  ambient = 0.32
): string {
  const k = ambient + (1 - ambient) * diffuse;
  const r = Math.min(255, base[0] * k + 22 * rim);
  const g = Math.min(255, base[1] * k + 139 * rim * 0.9);
  const b = Math.min(255, base[2] * k + 255 * rim);
  return `${Math.round(r)},${Math.round(g)},${Math.round(b)}`;
}

/** Builds the depth-sorted shuttlecock primitives for a pose and camera. */
export function shuttlePrimitives(
  cam: Camera,
  pose: ShuttlePose,
  bandRgb: Vec3 = [245, 198, 93]
): Primitive[] {
  const out: Primitive[] = [];
  const toWorld = (p: Vec3): Vec3 =>
    add(scale(rotate(p, pose), pose.size), pose.position);

  for (const face of SHUTTLE.faces) {
    const world = face.pts.map(toWorld);
    const proj = world.map((w) => project(cam, w));
    if (proj.some((p) => p === null)) continue;
    const pts = proj as Projected[];

    let n = normalize(cross(sub(world[1], world[0]), sub(world[2], world[0])));
    const centroid = scale(
      world.reduce((acc, w) => add(acc, w), [0, 0, 0] as Vec3),
      1 / world.length
    );
    const toCam = normalize(sub(cam.pos, centroid));

    if (face.ref) {
      const refWorld = toWorld(face.ref);
      if (dot(n, sub(centroid, refWorld)) < 0) n = scale(n, -1);
      if (dot(n, toCam) <= 0) continue; // back-face cull for closed parts
    }

    const facing = Math.abs(dot(n, toCam));
    const diffuse =
      face.kind === 'feather'
        ? Math.abs(dot(n, KEY_LIGHT))
        : Math.max(0, dot(n, KEY_LIGHT));
    const rim =
      Math.pow(1 - facing, 2) * (face.kind === 'feather' ? 0.55 : 0.35);
    const depth = pts.reduce((acc, p) => acc + p.z, 0) / pts.length;

    if (face.kind === 'feather') {
      out.push({
        type: 'poly',
        depth,
        pts,
        fill: `rgba(${shade([248, 250, 255], diffuse, rim, 0.62)},0.88)`,
        stroke: 'rgba(255,255,255,0.55)',
        lineWidth: 0.6,
      });
    } else {
      const base: Vec3 = face.kind === 'band' ? bandRgb : [242, 238, 228];
      const fill = `rgb(${shade(base, diffuse, rim)})`;
      out.push({
        type: 'poly',
        depth,
        pts,
        fill,
        stroke: fill,
        lineWidth: 0.6,
      });
    }
  }

  for (const line of SHUTTLE.lines) {
    const a = project(cam, toWorld(line.a));
    const b = project(cam, toWorld(line.b));
    if (!a || !b) continue;
    out.push({
      type: 'line',
      depth: (a.z + b.z) / 2 - 0.001,
      a,
      b,
      stroke:
        line.kind === 'thread'
          ? 'rgba(10,29,53,0.75)'
          : 'rgba(255,255,255,0.9)',
      lineWidth: line.kind === 'thread' ? 1.4 : 0.9,
    });
  }

  return out.sort((x, y) => y.depth - x.depth);
}

/* ------------------------------------------------------------------ */
/* Composition                                                         */
/* ------------------------------------------------------------------ */

export interface Layout {
  cameraPos: Vec3;
  cameraTarget: Vec3;
  /** Normalised screen anchor of the shuttle (-1..1, y up). */
  shuttleX: number;
  shuttleY: number;
  shuttleDepth: number;
  shuttleSize: number;
}

export function layoutFor(width: number, height: number): Layout {
  const aspect = width / Math.max(1, height);
  if (aspect < 0.85) {
    // Phones (portrait): shuttle sits in the upper part, text below.
    return {
      cameraPos: [0, 3.6, 12.5],
      cameraTarget: [0, 0.4, 0],
      shuttleX: 0.3,
      shuttleY: 0.5,
      shuttleDepth: 6.2,
      shuttleSize: 0.135,
    };
  }
  if (aspect < 1.35) {
    return {
      cameraPos: [0, 3.2, 12],
      cameraTarget: [0, 0.7, 0],
      shuttleX: 0.5,
      shuttleY: 0.4,
      shuttleDepth: 6,
      shuttleSize: 0.145,
    };
  }
  return {
    cameraPos: [0, 3.0, 11.5],
    cameraTarget: [0, 0.9, 0],
    shuttleX: 0.48,
    shuttleY: 0.16,
    shuttleDepth: 5.4,
    shuttleSize: 0.165,
  };
}

/** Pose of the shuttle at time t (seconds). t = 0 is the static pose. */
export function shuttlePoseAt(
  base: Camera,
  layout: Layout,
  t: number,
  tiltX = 0,
  tiltY = 0
): ShuttlePose {
  const anchor = screenAnchor(
    base,
    layout.shuttleX,
    layout.shuttleY,
    layout.shuttleDepth
  );
  return {
    position: add(anchor, [0, Math.sin(t * 0.9) * 0.07, 0]),
    spin: 0.35 + t * 0.32,
    roll: 0.62 + Math.sin(t * 0.45) * 0.05 + tiltX * 0.12,
    pitch: -0.42 + tiltY * 0.1,
    size: layout.shuttleSize,
  };
}

/* ------------------------------------------------------------------ */
/* Canvas renderer                                                     */
/* ------------------------------------------------------------------ */

interface Particle {
  p: Vec3;
  speed: number;
  phase: number;
  size: number;
  warm: boolean;
}

export interface SceneOptions {
  particleCount: number;
  standLightCount: number;
  seed?: number;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface CourtScene {
  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    t: number,
    pointerX: number,
    pointerY: number
  ): void;
}

export function createCourtScene(options: SceneOptions): CourtScene {
  const rand = mulberry32(options.seed ?? 42);
  const particles: Particle[] = Array.from(
    { length: options.particleCount },
    () => ({
      p: [(rand() - 0.5) * 14, 0.4 + rand() * 8, (rand() - 0.5) * 18] as Vec3,
      speed: 0.05 + rand() * 0.12,
      phase: rand() * Math.PI * 2,
      size: 0.012 + rand() * 0.03,
      warm: rand() < 0.35,
    })
  );
  const standLights: Vec3[] = Array.from(
    { length: options.standLightCount },
    () => {
      // A bowl of distant stand / crowd lights behind the far baseline and along the sides.
      const angle = (rand() - 0.5) * Math.PI * 1.25;
      const radius = 15 + rand() * 6;
      return [
        Math.sin(angle) * radius,
        1.5 + rand() * 6.5,
        -Math.cos(angle) * radius * 0.9 - 2,
      ];
    }
  );
  const lines = courtLines();
  const net = netGeometry();

  const strokeSegment = (
    ctx: CanvasRenderingContext2D,
    cam: Camera,
    seg: Segment
  ) => {
    const a = project(cam, seg[0]);
    const b = project(cam, seg[1]);
    if (!a || !b) return;
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
  };

  return {
    render(ctx, width, height, t, pointerX, pointerY) {
      const layout = layoutFor(width, height);
      const baseCam = makeCamera(
        layout.cameraPos,
        layout.cameraTarget,
        width,
        height
      );
      const cam = makeCamera(
        add(layout.cameraPos, [pointerX * 0.9, -pointerY * 0.45, 0]),
        add(layout.cameraTarget, [pointerX * 0.25, 0, 0]),
        width,
        height
      );

      // Backdrop
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, '#030B17');
      bg.addColorStop(0.55, '#061426');
      bg.addColorStop(1, '#0A1D35');
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Distant stand lights
      ctx.globalCompositeOperation = 'lighter';
      for (const s of standLights) {
        const p = project(cam, s);
        if (!p) continue;
        const r = Math.max(0.6, (0.07 * cam.focal) / p.z);
        ctx.fillStyle = 'rgba(120,170,255,0.18)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Floor: court surface
      ctx.globalCompositeOperation = 'source-over';
      const corners: Vec3[] = [
        [-HALF_W - 1.2, 0, -HALF_L - 2],
        [HALF_W + 1.2, 0, -HALF_L - 2],
        [HALF_W + 1.2, 0, HALF_L + 2],
        [-HALF_W - 1.2, 0, HALF_L + 2],
      ];
      const pc = corners.map((c) => project(cam, c));
      if (pc.every(Boolean)) {
        const pts = pc as Projected[];
        const floor = ctx.createLinearGradient(0, pts[0].y, 0, height);
        floor.addColorStop(0, 'rgba(12,52,92,0.55)');
        floor.addColorStop(1, 'rgba(8,38,72,0.95)');
        ctx.fillStyle = floor;
        ctx.beginPath();
        pts.forEach((p, i) =>
          i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)
        );
        ctx.closePath();
        ctx.fill();
      }

      // Pools of light on the floor beneath each lamp
      ctx.globalCompositeOperation = 'lighter';
      for (const lamp of LAMPS) {
        const p = project(cam, [lamp[0] * 0.45, 0, lamp[2]]);
        if (!p) continue;
        const r = (4.2 * cam.focal) / p.z;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(1, 0.32);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        g.addColorStop(0, 'rgba(22,139,255,0.20)');
        g.addColorStop(1, 'rgba(22,139,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Court lines: soft electric glow, then crisp white
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (const seg of lines) strokeSegment(ctx, cam, seg);
      ctx.strokeStyle = 'rgba(22,139,255,0.35)';
      ctx.lineWidth = Math.max(3, width / 300);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(235,244,255,0.85)';
      ctx.lineWidth = Math.max(1, width / 900);
      ctx.stroke();

      // Light beams from the rigs
      ctx.globalCompositeOperation = 'lighter';
      for (const lamp of LAMPS) {
        const top = project(cam, lamp);
        const f1 = project(cam, [lamp[0] * 0.45 - 1.6, 0, lamp[2]]);
        const f2 = project(cam, [lamp[0] * 0.45 + 1.6, 0, lamp[2]]);
        if (!top || !f1 || !f2) continue;
        const g = ctx.createLinearGradient(
          top.x,
          top.y,
          (f1.x + f2.x) / 2,
          f1.y
        );
        g.addColorStop(0, 'rgba(170,205,255,0.10)');
        g.addColorStop(1, 'rgba(170,205,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(top.x - 2, top.y);
        ctx.lineTo(f1.x, f1.y);
        ctx.lineTo(f2.x, f2.y);
        ctx.lineTo(top.x + 2, top.y);
        ctx.closePath();
        ctx.fill();

        const r = Math.max(6, (0.9 * cam.focal) / top.z);
        const glow = ctx.createRadialGradient(top.x, top.y, 0, top.x, top.y, r);
        glow.addColorStop(0, 'rgba(255,255,255,0.95)');
        glow.addColorStop(0.25, 'rgba(160,205,255,0.55)');
        glow.addColorStop(1, 'rgba(22,139,255,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(top.x, top.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Net
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      for (const seg of net.mesh) strokeSegment(ctx, cam, seg);
      ctx.strokeStyle = 'rgba(200,220,245,0.16)';
      ctx.lineWidth = 0.7;
      ctx.stroke();
      ctx.beginPath();
      for (const seg of net.posts) strokeSegment(ctx, cam, seg);
      ctx.strokeStyle = 'rgba(245,198,93,0.9)';
      ctx.lineWidth = Math.max(1.5, width / 700);
      ctx.stroke();
      ctx.beginPath();
      strokeSegment(ctx, cam, net.tape);
      ctx.strokeStyle = 'rgba(255,255,255,0.95)';
      ctx.lineWidth = Math.max(2, width / 520);
      ctx.stroke();

      // Shuttle pose + soft shadow on the floor
      const pose = shuttlePoseAt(baseCam, layout, t, pointerX, pointerY);
      const shadow = project(cam, [pose.position[0], 0, pose.position[2]]);
      if (shadow) {
        const r = (0.9 * cam.focal) / shadow.z;
        ctx.save();
        ctx.translate(shadow.x, shadow.y);
        ctx.scale(1, 0.3);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        g.addColorStop(0, 'rgba(0,6,16,0.55)');
        g.addColorStop(1, 'rgba(0,6,16,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const centre = project(cam, pose.position);
      const shuttleDepth = centre ? centre.z : Infinity;

      // Particles (drifting dust caught in the light)
      const drawParticles = (front: boolean) => {
        ctx.globalCompositeOperation = 'lighter';
        for (const pt of particles) {
          const y = ((pt.p[1] + t * pt.speed) % 8.5) + 0.3;
          const world: Vec3 = [
            pt.p[0] + Math.sin(t * 0.3 + pt.phase) * 0.25,
            y,
            pt.p[2],
          ];
          const p = project(cam, world);
          if (!p || p.z < shuttleDepth !== front) continue;
          const r = Math.max(0.5, (pt.size * cam.focal) / p.z);
          const alpha = Math.min(0.75, 2.4 / p.z);
          ctx.fillStyle = pt.warm
            ? `rgba(245,198,93,${alpha})`
            : `rgba(170,210,255,${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      };
      drawParticles(false);

      // Halo behind the shuttle
      if (centre) {
        const r = (1.6 * cam.focal) / centre.z;
        const halo = ctx.createRadialGradient(
          centre.x,
          centre.y,
          0,
          centre.x,
          centre.y,
          r
        );
        halo.addColorStop(0, 'rgba(22,139,255,0.28)');
        halo.addColorStop(1, 'rgba(22,139,255,0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(centre.x, centre.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shuttlecock
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineJoin = 'round';
      for (const prim of shuttlePrimitives(cam, pose)) {
        ctx.beginPath();
        if (prim.type === 'poly') {
          prim.pts.forEach((p, i) =>
            i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)
          );
          ctx.closePath();
          ctx.fillStyle = prim.fill;
          ctx.fill();
          if (prim.stroke) {
            ctx.strokeStyle = prim.stroke;
            ctx.lineWidth = prim.lineWidth ?? 1;
            ctx.stroke();
          }
        } else {
          ctx.moveTo(prim.a.x, prim.a.y);
          ctx.lineTo(prim.b.x, prim.b.y);
          ctx.strokeStyle = prim.stroke;
          ctx.lineWidth = prim.lineWidth;
          ctx.stroke();
        }
      }

      drawParticles(true);
      ctx.globalCompositeOperation = 'source-over';
    },
  };
}

/* ------------------------------------------------------------------ */
/* Static poster geometry (used on the server for the fallback SVG)    */
/* ------------------------------------------------------------------ */

export interface PosterGeometry {
  width: number;
  height: number;
  court: Array<[number, number, number, number]>;
  netTape: [number, number, number, number] | null;
  shuttle: Primitive[];
}

export function posterGeometry(width = 1600, height = 900): PosterGeometry {
  const layout = layoutFor(width, height);
  const cam = makeCamera(layout.cameraPos, layout.cameraTarget, width, height);
  const seg = (s: Segment): [number, number, number, number] | null => {
    const a = project(cam, s[0]);
    const b = project(cam, s[1]);
    return a && b ? [a.x, a.y, b.x, b.y] : null;
  };
  const r1 = (n: number) => Math.round(n * 10) / 10;
  const round = (s: [number, number, number, number]) =>
    s.map(r1) as [number, number, number, number];
  const shuttle = shuttlePrimitives(cam, shuttlePoseAt(cam, layout, 0)).map(
    (p) =>
      p.type === 'poly'
        ? { ...p, pts: p.pts.map((q) => ({ x: r1(q.x), y: r1(q.y) })) }
        : {
            ...p,
            a: { x: r1(p.a.x), y: r1(p.a.y) },
            b: { x: r1(p.b.x), y: r1(p.b.y) },
          }
  );
  const tape = seg(netGeometry().tape);
  return {
    width,
    height,
    court: courtLines()
      .map(seg)
      .filter((s): s is [number, number, number, number] => s !== null)
      .map(round),
    netTape: tape ? round(tape) : null,
    shuttle,
  };
}
