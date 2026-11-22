// Rubber Hose UI: the core every component is built on. A copy is stamped into each component file; the first one loaded
// sets window.RubberHose and the others use it. Edit this file, then run `node tools/build.mjs` to stamp it into the components.
// It holds the clock, the drawing helpers (painted layers, noodle limbs, gloves, shoes, lettering), the hand-lettering
// face, and the base class for the elements. The bodies are painted layers; the limbs are drawn here, because a rubber
// hose limb is a thick ink line with no elbow, and a line drawn in code can stretch as far as the control needs.
(() => {
if (window.RubberHose) return;

const TAU = Math.PI * 2, INK = '#251d16';
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = {
  out: (t) => 1 - (1 - t) ** 3,
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  back: (t) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2,
};
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Film runs at 24 drawings a second and everything here is drawn on ones. Lettering and effects count in twelfths.
const FPS = 24;
// Everything alive bounces to the same beat. beat() goes 0, 1, 0 once a beat; ph shifts a character off the beat.
const BPS = 2.1;
const beat = (t, ph = 0) => Math.abs(Math.sin(Math.PI * (t * BPS + ph)));
// A spring that has just been let go: 1 at k = 0, ringing down to 0. k counts drawings.
const ring = (k, life = 14, w = 0.95, d = 3.4) => (k < 0 || k > life ? 0 : Math.exp(-k / d) * Math.cos(k * w));

// ---- the clock: one requestAnimationFrame loop for every element on the page. Set RubberHose.paused and call
// advance(dt) to step it by hand, which is how the tools photograph a reaction one drawing at a time.
let now = 0, raf = 0, last = -1;
const frames = new Set();
const mq = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
let calm = !!mq && mq.matches; mq?.addEventListener?.('change', () => { calm = mq.matches; });
const run = (dt) => { for (const f of [...frames]) f(now, dt); };
function tick(ms) {
  raf = 0; const t = ms / 1000, dt = last < 0 ? 0 : Math.min(0.05, Math.max(0, t - last)); last = t;
  if (!api.paused) { now += dt; run(dt); }
  if (frames.size) start();
}
const start = () => { if (!raf) raf = requestAnimationFrame(tick); };
const advance = (dt) => { now += dt; run(dt); };

// ---- painted layers. Each component file carries its own as data URIs and hands them over with addArt().
const ART = {}, imgs = new Map();
function art(name) { let i = imgs.get(name); if (!i && ART[name]) { i = new Image(); i.src = ART[name]; imgs.set(name, i); } return i; }
// layers start decoding as soon as they are handed over, so the first drawing that needs one has it
const addArt = (o) => { for (const k in o) { ART[k] ||= o[k]; art(k); } };
const ready = (i) => !!i && i.complete && i.naturalWidth > 0;
// @@core-art   (tools/build.mjs puts the gloves, the shoe and the lettering face here)

// The hand-lettering face, for the labels drawn on the canvas and the text inside the elements.
const FACE = '"Hose Hand", "Patrick Hand", "Comic Sans MS", "Chalkboard SE", cursive';
let face = 0;   // goes to 1 when the face has loaded, so anything that measured lettering before then can measure it again
if (typeof FONT === 'string' && window.FontFace && document.fonts) {
  try { const f = new FontFace('Hose Hand', `url(${FONT}) format("woff2")`); document.fonts.add(f); f.load().then(() => { face = 1; }, () => {}); } catch {}
}

// Draw a layer at width w with its anchor (ax, ay, as fractions of the layer) on (x, y), turned and squashed about that anchor.
function place(g, i, x, y, w, { rot = 0, sx = 1, sy = 1, ax = 0.5, ay = 0.5, flip = false } = {}) {
  if (!ready(i)) return; const h = w * i.naturalHeight / i.naturalWidth;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(flip ? -sx : sx, sy); g.drawImage(i, -w * ax, -h * ay, w, h); g.restore();
}

// One limb: an ink line from a to b that sags sideways by `sag`. Returns the direction it is pointing when it arrives.
// If `to` is given the line bends so that it arrives pointing that way, which is how an arm goes straight into a cuff.
function hose(g, x0, y0, x1, y1, sag = 0, w = 7, to) {
  const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, cx = (x0 + x1) / 2 - dy / l * sag, cy = (y0 + y1) / 2 + dx / l * sag;
  const a = to ?? Math.atan2(y1 - cy, x1 - cx), k = Math.max(12, l) * 0.36;
  g.strokeStyle = INK; g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0);
  g.bezierCurveTo(x0 + (cx - x0) * 0.67, y0 + (cy - y0) * 0.67, x1 - Math.cos(a) * k, y1 - Math.sin(a) * k, x1, y1); g.stroke();
  return a;
}
// A glove on the end of an arm. The arm ends inside the cuff, at (x, y), and the fingers point along `ang`.
// There are four gloves: an open hand from the inside (palm) and from the back (glove, with the dart lines), and a fist
// from the front (fist, thumb across the fingers) and from the back (knuckle, dart lines). Each is drawn fingers up with
// its thumb on the right, which makes the two inside views right hands and the two back views left hands. A hand is on
// the viewer's left when the body is to its right (`inward` is 1), and that is the character's right hand; so the
// layer is mirrored whenever the hand that is wanted is the other one.
const GLOVES = { palm: [0.42, 0.9, true], glove: [0.42, 0.9, false], fist: [0.47, 0.9, true], knuckle: [0.42, 0.9, false] };
function hand(g, kind, x, y, ang, w = 30, inward = 1) {
  const [ax, ay, inside] = GLOVES[kind];
  place(g, art(kind), x, y, w, { rot: ang + Math.PI / 2, ax, ay, flip: (inward > 0) !== inside });
}
// An arm and its hand. `turn` swings the hand away from the way the arm would arrive; the arm bends to follow it.
function arm(g, kind, x0, y0, x1, y1, sag = 0, o = {}) {
  hand(g, kind, x1, y1, reach(g, x0, y0, x1, y1, sag, o), o.w ?? 30, o.inward ?? (Math.sign(x0 - x1) || 1));
}
// The arm without the hand; it returns the way the hand should point. An arm joins a body best when the body is drawn
// over its shoulder, so where the hand has to be in front of the body, draw this first, then the body, then hand().
function reach(g, x0, y0, x1, y1, sag = 0, { w = 30, turn = 0, to, lw } = {}) {
  const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, cx = (x0 + x1) / 2 - dy / l * sag, cy = (y0 + y1) / 2 + dx / l * sag;
  return hose(g, x0, y0, x1, y1, sag, lw ?? clamp(w * 0.25, 4.2, 11), to ?? Math.atan2(y1 - cy, x1 - cx) + turn);
}
// A leg with a shoe on it. dir is 1 for a toe pointing right and -1 for left.
// The leg goes into the shoe: the shoe is drawn first, anchored on the middle of its opening, and the leg is drawn over
// it but cut off along the front edge of the opening, so it passes in front of the back of the collar and disappears
// inside. HOLE is the opening on the shoe layer: its centre and its two radii, as fractions of the layer's width.
const HOLE = { ax: 0.269, ay: 0.122, rx: 0.132, ry: 0.034 };
function leg(g, x0, y0, x1, y1, sag = 0, { w = 36, dir = 1, rot = 0, lw } = {}) {
  const hy = y1 - 3, r = rot * dir;
  place(g, art('shoe'), x1, hy, w, { ax: HOLE.ax, ay: HOLE.ay, flip: dir < 0, rot: r });
  const mouth = new Path2D(), cut = new Path2D(); mouth.rect(-400, -400, 800, 400); mouth.ellipse(0, 0, w * HOLE.rx, w * HOLE.ry, 0, 0, TAU);
  cut.addPath(mouth, new DOMMatrix().translateSelf(x1, hy).rotateSelf(r * 180 / Math.PI));
  g.save(); g.clip(cut);
  hose(g, x0, y0, x1, hy + 1, sag, Math.min(lw ?? clamp(w * 0.2, 4.2, 9), w * HOLE.rx * 2 - 1.6), Math.PI / 2 + (x1 - x0) * 0.004);
  g.restore();
}

// Short ink strokes round a point: the marks that mean "this just happened".
function ticks(g, x, y, n, r0, r1, a0 = 0, a1 = TAU, lw = 2.4, seed = 0) {
  g.strokeStyle = INK; g.lineWidth = lw; g.beginPath();
  for (let i = 0; i < n; i++) {
    const a = lerp(a0, a1, n === 1 ? 0.5 : i / (a1 - a0 >= TAU - 0.01 ? n : n - 1)) + (hash(i * 3.7 + seed) - 0.5) * 0.12, k = 0.8 + hash(i * 9.1 + seed) * 0.4;
    g.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); g.lineTo(x + Math.cos(a) * (r0 + (r1 - r0) * k), y + Math.sin(a) * (r0 + (r1 - r0) * k));
  }
  g.stroke();
}
// n copies of a layer thrown out from a point. k runs 0 to 1 over the life of the throw; they leave by shrinking.
function burst(g, i, x, y, k, n, { r0 = 14, r1 = 70, size = 24, a0 = -Math.PI, a1 = 0, seed = 0, spin = 1, drop = 0 } = {}) {
  if (k < 0 || k >= 1) return;
  for (let j = 0; j < n; j++) {
    const a = lerp(a0, a1, (j + 0.5) / n) + (hash(j * 5.3 + seed) - 0.5) * 0.3, r = lerp(r0, r1 * (0.75 + hash(j * 2.1 + seed) * 0.5), ease.out(k));
    place(g, i, x + Math.cos(a) * r, y + Math.sin(a) * r + drop * k * k, size * (k < 0.5 ? 1 : 2 - 2 * k), { rot: (hash(j + seed) - 0.5 + k * spin) * 1.2 });
  }
}
// Lettering that lands a size too big, settles, shakes while it holds and leaves by shrinking. fr counts twelfths of a second.
function sfx(g, i, cx, cy, w, fr, hold, still, rot = 0) {
  const n = Math.round(hold * 12); if (fr < 0 || fr > n + 2 || !ready(i)) return;
  const s = still ? 1 : fr > n ? [0.7, 0.35][fr - n - 1] || 0 : [1.35, 0.92, 1.06, 1][Math.min(3, fr)];
  const jx = still ? 0 : (hash(fr * 3.1) - 0.5) * 2.4, jy = still ? 0 : (hash(fr * 5.3) - 0.5) * 2.4;
  place(g, i, cx + jx, cy + jy, w * s, { rot });
}
// Hand lettering on the canvas.
function write(g, s, x, y, size, { align = 'center', rot = 0, col = INK } = {}) {
  g.save(); g.translate(x, y); g.rotate(rot); g.font = `${size}px ${FACE}`; g.textAlign = align; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(s, 0, 0); g.restore();
}
// The widest of some lines of lettering at a size, so a label can be shrunk to fit.
const ruler = document.createElement('canvas').getContext('2d');
const widthOf = (s, size) => { ruler.font = `${size}px ${FACE}`; return ruler.measureText(s).width; };
// The biggest size, from `max` down to `min`, at which every line fits in `w`.
const fitSize = (lines, w, max, min = 9) => { let s = max; while (s > min && lines.some((l) => widthOf(l, s) > w)) s -= 0.5; return s; };
// Break a sentence into at most `max` lines that fit in `w`, at the biggest size from `big` down to `small` that allows it.
// Returns [lines, size].
function setType(text, w, big, max = 2, small = 9) {
  const words = String(text).trim().split(/\s+/);
  for (let s = big; ; s -= 0.5) {
    const lines = []; let cur = '';
    for (const wd of words) { const next = cur ? cur + ' ' + wd : wd; if (cur && widthOf(next, s) > w) { lines.push(cur); cur = wd; } else cur = next; }
    lines.push(cur);
    if (s <= small || (lines.length <= max && lines.every((l) => widthOf(l, s) <= w))) return [lines.slice(0, max), s];
  }
}

const BASE_CSS = `
:host{display:inline-block;position:relative;max-width:100%;vertical-align:middle;-webkit-tap-highlight-color:transparent;color:${INK};font:400 19px/1.3 ${FACE};contain:layout}
:host([hidden]){display:none}
*{box-sizing:border-box}
.box{position:absolute;left:0;top:0;transform-origin:0 0}
canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.hit{position:absolute;inset:0;margin:0;padding:0;border:0;border-radius:22px;background:none;cursor:pointer;appearance:none;-webkit-appearance:none;font-size:0;color:transparent}
input.hit{opacity:0;width:100%;height:100%}
.hit:disabled{cursor:not-allowed}
.hit:focus{outline:none}
.hit:focus-visible,.box:has(input.hit:focus-visible){outline:3px dashed var(--hose-focus,${INK});outline-offset:-5px;border-radius:22px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;

// The base for every component. Each one is a drawing W by H (300 by 210 unless it says otherwise) with a real control
// over it. The element is W pixels wide by default; give it any other width and the whole thing scales to fit.
class Base extends HTMLElement {
  constructor() {
    super(); this.root = this.attachShadow({ mode: 'open', delegatesFocus: !!this.constructor.delegates });
    if (this.constructor.formAssociated && this.attachInternals) this.internals = this.attachInternals();
  }
  connectedCallback() {
    // a component built from its <option>s waits until the parser has read them
    if (!this.ready && this.constructor.fromChildren && document.readyState === 'loading') {
      if (!this.waiting) { this.waiting = true; document.addEventListener('DOMContentLoaded', () => { this.waiting = false; if (this.isConnected) this.connectedCallback(); }, { once: true }); }
      return;
    }
    if (!this.ready) {
      this.ready = true; [this.W, this.H] = this.size();
      this.root.innerHTML = `<style>${BASE_CSS}:host{width:${this.W}px;aspect-ratio:${this.W} / ${this.H}}.box{width:${this.W}px;height:${this.H}px}${this.constructor.css || ''}</style><div class="box" part="box"><canvas aria-hidden="true"></canvas>${this.render()}</div>`;
      this.box = this.$('.box'); this.canvas = this.$('canvas'); this.g = this.canvas.getContext('2d');
      const g = this.g; g.begin = () => { const r = this.ratio; g.setTransform(r, 0, 0, r, 0, 0); g.clearRect(0, 0, this.W, this.H); g.lineJoin = 'round'; g.lineCap = 'round'; g.imageSmoothingQuality = 'high'; };
      this.fit(); this.setup();
      this.sizer = new ResizeObserver(() => this.fit());
      this.seer = new IntersectionObserver((es) => { this.seen = es[es.length - 1].isIntersecting; this.listen(); }, { rootMargin: '80px' });
    }
    this.tickFn ||= (t, dt) => this.frame(t, dt);
    this.sizer.observe(this); this.seer.observe(this); this.seen = true; this.listen();
  }
  disconnectedCallback() { frames.delete(this.tickFn); this.sizer?.disconnect(); this.seer?.disconnect(); }
  // drawn only while it is on the page and near the screen
  listen() { if (this.isConnected && this.seen) { frames.add(this.tickFn); start(); } else frames.delete(this.tickFn); }
  // the drawing is scaled to the element's width, and the canvas is given enough pixels for it
  fit() {
    const s = (this.clientWidth || this.W) / this.W; this.scale = s; this.box.style.transform = s === 1 ? '' : `scale(${s})`;
    const r = Math.min(4, Math.max(2, window.devicePixelRatio || 1) * Math.max(0.5, s)), w = Math.round(this.W * r), h = Math.round(this.H * r);
    this.ratio = r; if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; if (api.paused && this.frame) this.frame(now, 0); }
  }
  $(s) { return this.root.querySelector(s); }
  $$(s) { return [...this.root.querySelectorAll(s)]; }
  size() { return [300, 210]; } render() { return ''; } setup() {} frame() {}
  emit(type, detail) { this.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail })); }
  // Every character has a line to say about what just happened. It is in el.line, and each new one fires hose:line
  // with { text }. Show it under the control or ignore it.
  say(text) { if (text === this.line) return; this.line = text; this.emit('hose:line', { text }); }
}
const define = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };

const api = window.RubberHose = {
  version: 1, paused: false,
  get now() { return now; }, get calm() { return calm; }, get face() { return face; },
  TAU, INK, FPS, FACE, clamp, lerp, ease, hash, esc, beat, ring,
  advance, addArt, art, ready, place, hose, hand, arm, reach, leg, ticks, burst, sfx, write, widthOf, fitSize, setType,
  Base, define,
};
})();
