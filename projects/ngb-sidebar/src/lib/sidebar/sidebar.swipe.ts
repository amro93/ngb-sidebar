/**
 * Touch swipe handling for `<ngb-sidebar>`:
 * - swipe in from the sidebar's edge (or on a collapsed icon rail) to open,
 * - swipe the open panel back toward its edge to close.
 * The off-canvas panel follows the finger while dragging, then snaps by distance or flick speed.
 * Only horizontal touch gestures are handled; vertical scrolling and mouse input are left alone.
 */
export interface SwipeHost {
  /** Whether swipe gestures are currently enabled. */
  enabled(): boolean;
  /** Width (px) of the edge zone that starts an "open" swipe. */
  edge(): number;
  /** Fraction (0–1) of the panel width a drag must travel to toggle. */
  threshold(): number;
  isOpen(): boolean;
  /** Collapse mode in effect (`none` disables swiping). */
  collapsible(): 'icon' | 'offcanvas' | 'none';
  side(): 'left' | 'right';
  /** Element bounding the "edge" zone (the layout, or the viewport when absent). */
  container(): HTMLElement | null;
  /** The sliding panel (`.ngb-sidebar-aside`). */
  panel(): HTMLElement | null;
  /** The sidebar host, used to read the text direction. */
  host(): HTMLElement;
  setOpen(open: boolean): void;
}

interface Drag {
  startX: number;
  startY: number;
  startT: number;
  lastX: number;
  /** +1 when "inward" (opening) is towards +x, -1 otherwise. */
  sign: number;
  opening: boolean;
  decided: boolean;
  width: number;
  follow: boolean;
}

const DECIDE_PX = 10;
const FLICK_PX_PER_MS = 0.4;

export class SidebarSwipe {
  private drag: Drag | null = null;

  constructor(
    private readonly host: SwipeHost,
    private readonly doc: Document,
  ) {}

  readonly onStart = (e: TouchEvent): void => {
    if (!this.host.enabled() || this.host.collapsible() === 'none' || e.touches.length !== 1)
      return;
    const t = e.touches[0];
    const panel = this.host.panel();
    if (!panel) return;
    // Only gestures that start inside this sidebar's own layout (several layouts can share an edge).
    const container = this.host.container();
    const target = e.target as Node | null;
    if (container && !(target && container.contains(target))) return;
    const rtl = getComputedStyle(this.host.host()).direction === 'rtl';
    const startSide = this.host.side() === 'left'; // 'left' = inline start
    const physicalLeft = startSide !== rtl;
    const sign = physicalLeft ? 1 : -1;
    const insidePanel = panel.contains(e.target as Node);
    const open = this.host.isOpen();

    let opening: boolean;
    if (open) {
      if (!insidePanel) return;
      opening = false;
    } else {
      const box = (this.host.container() ?? this.doc.documentElement).getBoundingClientRect();
      const fromEdge = physicalLeft ? t.clientX - box.left : box.right - t.clientX;
      const inEdge = fromEdge >= 0 && fromEdge <= this.host.edge();
      const onRail = insidePanel && this.host.collapsible() === 'icon';
      if (!inEdge && !onRail) return;
      opening = true;
    }

    this.drag = {
      startX: t.clientX,
      startY: t.clientY,
      startT: Date.now(),
      lastX: t.clientX,
      sign,
      opening,
      decided: false,
      width: panel.getBoundingClientRect().width || panel.offsetWidth,
      follow: this.host.collapsible() === 'offcanvas',
    };
  };

  readonly onMove = (e: TouchEvent): void => {
    const d = this.drag;
    if (!d || e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - d.startX;
    const dy = t.clientY - d.startY;
    if (!d.decided) {
      if (Math.abs(dx) < DECIDE_PX && Math.abs(dy) < DECIDE_PX) return;
      if (Math.abs(dy) >= Math.abs(dx)) {
        this.drag = null; // vertical scroll: not ours
        return;
      }
      d.decided = true;
      if (d.follow) this.startFollow(d);
    }
    d.lastX = t.clientX;
    if (d.follow) this.follow(d, dx);
  };

  readonly onEnd = (): void => {
    const d = this.drag;
    this.drag = null;
    if (!d || !d.decided) return;
    const inward = (d.lastX - d.startX) * d.sign; // > 0 = towards open
    const velocity = inward / Math.max(1, Date.now() - d.startT);
    const distance = Math.max(1, d.width) * this.host.threshold();
    this.endFollow();
    if (d.opening && (inward > distance || velocity > FLICK_PX_PER_MS)) this.host.setOpen(true);
    if (!d.opening && (-inward > distance || -velocity > FLICK_PX_PER_MS)) this.host.setOpen(false);
  };

  readonly onCancel = (): void => {
    this.drag = null;
    this.endFollow();
  };

  private startFollow(d: Drag): void {
    const panel = this.host.panel();
    if (!panel) return;
    panel.style.transition = 'none';
    panel.style.visibility = 'visible';
    this.follow(d, 0);
  }

  /** Move the off-canvas panel with the finger (0 = open position, ±width = closed). */
  private follow(d: Drag, dx: number): void {
    const panel = this.host.panel();
    if (!panel) return;
    const inward = dx * d.sign;
    const offset = d.opening
      ? Math.min(0, -d.width + Math.max(0, inward))
      : Math.max(-d.width, Math.min(0, inward));
    panel.style.transform = `translateX(${offset * d.sign}px)`;
  }

  private endFollow(): void {
    const panel = this.host.panel();
    if (!panel) return;
    panel.style.transform = '';
    panel.style.transition = '';
    panel.style.visibility = '';
  }
}
