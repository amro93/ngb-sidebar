import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  model,
  numberAttribute,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NGB_SIDEBAR_VERSION } from '../version';
import { NGB_SIDEBAR_LAYOUT, NgbSidebarRegistry } from './sidebar.registry';
import { SidebarCollapsible, SidebarSide, SidebarState, SidebarVariant } from './sidebar.types';

let nextId = 0;

/**
 * Compound navigation sidebar: collapsible to icons or off canvas, three variants,
 * left/right side, overlay and open-on-hover modes, keyboard shortcut and responsive breakpoint.
 *
 * ```html
 * <ngb-sidebar-layout>
 *   <ngb-sidebar id="main" collapsible="icon">
 *     <ngb-sidebar-header>...</ngb-sidebar-header>
 *     <ngb-sidebar-content>...</ngb-sidebar-content>
 *     <ngb-sidebar-footer>...</ngb-sidebar-footer>
 *     <button ngbSidebarRail></button>
 *   </ngb-sidebar>
 *   <ngb-sidebar-main>
 *     <button ngbSidebarTrigger target="main">☰</button>
 *   </ngb-sidebar-main>
 * </ngb-sidebar-layout>
 * ```
 */
@Component({
  selector: 'ngb-sidebar',
  standalone: true,
  exportAs: 'ngbSidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngb-sidebar',
    '[attr.id]': 'id()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-collapsible]': 'effectiveCollapsible()',
    '[attr.data-side]': 'side()',
    '[attr.data-state]': 'state()',
    '[attr.data-mobile]': 'isMobile() || null',
    '[class.ngb-sidebar-overlay]': 'effectiveOverlay()',
    '[class.ngb-sidebar-expanded]': 'expanded()',
    '[class.ngb-sidebar-pushing]': 'pushing()',
    '[class.ngb-sidebar-floating-panel]': 'floatingPanel()',
    '[style.--ngb-sidebar-width]': 'width()',
    '[style.--ngb-sidebar-width-icon]': 'iconWidth()',
  },
})
export class NgbSidebarComponent implements OnInit {
  public static readonly VERSION = NGB_SIDEBAR_VERSION;

  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly registry = inject(NgbSidebarRegistry);
  private readonly layout = inject(NGB_SIDEBAR_LAYOUT, { optional: true });

  /** Id used by `ngbSidebarTrigger[target]` and `aria-controls`. */
  id = input<string>(`ngb-sidebar-${nextId++}`);
  variant = input<SidebarVariant>('sidebar');
  collapsible = input<SidebarCollapsible>('offcanvas');
  side = input<SidebarSide>('left');
  /** Float over the main content instead of pushing it. */
  overlay = input(false, { transform: booleanAttribute });
  /** Expand temporarily while the pointer is over a collapsed sidebar. */
  openOnHover = input(false, { transform: booleanAttribute });
  /** Escape and backdrop clicks close an overlay sidebar. */
  dismissable = input(true, { transform: booleanAttribute });
  /** Render a backdrop while open as an overlay. */
  backdrop = input(false, { transform: booleanAttribute });
  /** Two-way expanded state: `[(open)]`. */
  open = model<boolean>(true);
  /** Expanded width. */
  width = input<string>('16rem');
  /** Width when collapsed to icons. */
  iconWidth = input<string>('3rem');
  /** Ctrl/⌘ + key toggles the sidebar. `null` disables. */
  keyboardShortcut = input<string | null>('b');
  /** Below this viewport width (px) the sidebar becomes an off-canvas overlay with backdrop. */
  breakpoint = input<number | null, unknown>(null, {
    transform: (v: unknown) =>
      v === null || v === undefined || v === '' ? null : numberAttribute(v),
  });
  /** Persist the open state in localStorage under this key. */
  stateKey = input<string | null>(null);
  ariaLabel = input<string>('Sidebar');
  /**
   * Bootstrap classes for the panel background/text, e.g. `bg-body-tertiary` (default),
   * `bg-body`, `bg-primary-subtle`, `text-bg-dark`.
   */
  panelClass = input<string>('bg-body-tertiary');
  /** Bootstrap 5.3 color mode for the sidebar only (`data-bs-theme`), e.g. `'dark'`. */
  theme = input<'light' | 'dark' | null>(null);
  /** Delay (ms) before a hover-opened sidebar collapses after the pointer leaves. */
  hoverCloseDelay = input(150, { transform: numberAttribute });

  /** Viewport is below `breakpoint`. */
  readonly isMobile = signal(false);
  readonly hovering = signal(false);

  readonly effectiveCollapsible = computed<SidebarCollapsible>(() =>
    this.isMobile() ? 'offcanvas' : this.collapsible(),
  );
  readonly effectiveOverlay = computed(() => this.isMobile() || this.overlay());
  readonly expanded = computed(
    () =>
      this.effectiveCollapsible() === 'none' ||
      this.open() ||
      (this.openOnHover() && !this.isMobile() && this.hovering()),
  );
  readonly state = computed<SidebarState>(() => (this.expanded() ? 'expanded' : 'collapsed'));
  /** Collapsed down to the icon rail. */
  readonly iconCollapsed = computed(
    () => !this.expanded() && this.effectiveCollapsible() === 'icon',
  );
  /** Takes up its full width in the layout (pushes the main content). */
  readonly pushing = computed(
    () => !this.effectiveOverlay() && (this.open() || this.effectiveCollapsible() === 'none'),
  );
  /** Expanded over the content (overlay or hover) – gets elevated with a shadow. */
  readonly floatingPanel = computed(() => this.expanded() && !this.pushing());
  /** Bootstrap classes of the panel, derived from variant, side and state. */
  readonly panelClasses = computed(() => {
    const variant = this.variant();
    const cls = ['ngb-sidebar-panel', 'd-flex', 'flex-column', 'w-100'];
    if (variant !== 'inset' || this.floatingPanel()) cls.push(this.panelClass());
    if (variant === 'sidebar') cls.push(this.side() === 'left' ? 'border-end' : 'border-start');
    if (variant === 'floating') cls.push('border', 'rounded-3', 'shadow-sm');
    if (variant === 'inset' && this.floatingPanel()) cls.push('rounded-3');
    if (this.floatingPanel()) cls.push('shadow-lg');
    return cls.join(' ');
  });

  readonly showBackdrop = computed(
    () =>
      this.effectiveOverlay() &&
      this.open() &&
      this.effectiveCollapsible() !== 'none' &&
      (this.backdrop() || this.isMobile()),
  );

  /** Inside a layout the layout renders the backdrop. */
  protected readonly inLayout = !!this.layout;

  private hoverTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    const destroyRef = inject(DestroyRef);
    const onKey = (e: KeyboardEvent) => this.onDocumentKeydown(e);
    this.document.addEventListener('keydown', onKey);
    destroyRef.onDestroy(() => {
      this.document.removeEventListener('keydown', onKey);
      if (this.hoverTimer) clearTimeout(this.hoverTimer);
    });

    // Registry (re-registers when the id changes).
    effect((onCleanup) => {
      const id = this.id();
      this.registry.register(id, this);
      onCleanup(() => this.registry.unregister(id, this));
    });
    this.layout?.add(this);
    destroyRef.onDestroy(() => this.layout?.remove(this));

    // Responsive breakpoint.
    effect((onCleanup) => {
      const bp = this.breakpoint();
      if (!this.isBrowser || bp === null || typeof matchMedia === 'undefined') {
        this.isMobile.set(false);
        return;
      }
      const mql = matchMedia(`(max-width: ${bp - 0.02}px)`);
      const apply = (mobile: boolean) => {
        const changed = mobile !== this.isMobile();
        this.isMobile.set(mobile);
        if (changed) this.open.set(!mobile && this.readStoredState(true));
      };
      apply(mql.matches);
      const listener = (e: MediaQueryListEvent) => apply(e.matches);
      mql.addEventListener?.('change', listener);
      onCleanup(() => mql.removeEventListener?.('change', listener));
    });

    // Persist state.
    effect(() => {
      const key = this.stateKey();
      const open = this.open();
      if (key && this.isBrowser && !this.isMobile()) {
        try {
          localStorage.setItem(key, String(open));
        } catch {
          /* storage unavailable */
        }
      }
    });
  }

  ngOnInit(): void {
    if (this.stateKey()) this.open.set(this.readStoredState(this.open()));
  }

  private readStoredState(fallback: boolean): boolean {
    const key = this.stateKey();
    if (!key || !this.isBrowser) return fallback;
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : v === 'true';
    } catch {
      return fallback;
    }
  }

  /** Toggle the expanded state. */
  toggle(): void {
    if (this.effectiveCollapsible() === 'none') return;
    this.hovering.set(false);
    this.open.update((v) => !v);
  }

  expand(): void {
    this.open.set(true);
  }

  collapse(): void {
    if (this.effectiveCollapsible() === 'none') return;
    this.hovering.set(false);
    this.open.set(false);
  }

  /** Close when used as a dismissable overlay (backdrop click, Escape). */
  dismiss(): void {
    if (this.dismissable() && this.effectiveOverlay()) this.collapse();
  }

  onPointerEnter(): void {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
    if (this.openOnHover()) this.hovering.set(true);
  }

  onPointerLeave(): void {
    if (!this.hovering()) return;
    this.hoverTimer = setTimeout(() => {
      this.hoverTimer = null;
      this.hovering.set(false);
    }, this.hoverCloseDelay());
  }

  /** Focus moving out of a hover-opened sidebar collapses it. */
  onFocusOut(e: FocusEvent): void {
    const aside = e.currentTarget as HTMLElement;
    if (this.hovering() && !aside.contains(e.relatedTarget as Node | null)) this.onPointerLeave();
  }

  private onDocumentKeydown(e: KeyboardEvent): void {
    const key = this.keyboardShortcut();
    if (key && (e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === key.toLowerCase()) {
      e.preventDefault();
      this.toggle();
      return;
    }
    if (e.key === 'Escape' && this.open() && this.effectiveOverlay() && this.dismissable()) {
      if (this.effectiveCollapsible() === 'none') return;
      this.collapse();
    }
  }
}
