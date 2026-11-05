import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  OnDestroy,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
  model,
  numberAttribute,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  NGB_DRAWER_VERSION,
  DrawerAppendTo,
  DrawerHideEvent,
  DrawerPosition,
} from './ngb-drawer.interface';
import {
  NgbDrawerCloseIconDirective,
  NgbDrawerContentDirective,
  NgbDrawerFooterDirective,
  NgbDrawerHeadlessDirective,
  NgbDrawerHeaderDirective,
  DrawerTemplateContext,
} from './ngb-drawer.templates';

let nextId = 0;
/** Shared counter so the most recently opened sidebar is always on top. */
let zIndexCounter = 0;
/** Open sidebars that block body scroll (scroll is restored when the last one closes). */
let scrollLocks = 0;

/** Bootstrap offcanvas placement class for each position (`full` slides up full height). */
const OFFCANVAS_POSITION: Record<DrawerPosition, string> = {
  left: 'offcanvas-start',
  right: 'offcanvas-end',
  top: 'offcanvas-top',
  bottom: 'offcanvas-bottom',
  full: 'offcanvas-bottom',
};

const FOCUSABLE =
  'a[href],area[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),' +
  'select:not([disabled]),textarea:not([disabled]),iframe,[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';

/**
 * Overlay panel built on Bootstrap 5's `.offcanvas` that slides in from any viewport edge.
 *
 * ```html
 * <ngb-drawer [(visible)]="open" position="right" header="Settings">...</ngb-drawer>
 * ```
 */
@Component({
  selector: 'ngb-drawer',
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet],
  templateUrl: './ngb-drawer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgbDrawerComponent implements OnDestroy {
  public static readonly VERSION = NGB_DRAWER_VERSION;

  private readonly document = inject(DOCUMENT);
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef);

  // --- Visibility ---
  /** Two-way bindable visibility: `[(visible)]`. */
  visible = model<boolean>(false);

  // --- Layout ---
  position = input<DrawerPosition>('left');
  fullScreen = input(false, { transform: booleanAttribute });
  header = input<string | undefined>(undefined);
  /** Width (left/right) or height (top/bottom), e.g. `'30rem'`. */
  size = input<string | undefined>(undefined);
  style = input<Record<string, any> | null>(null);
  styleClass = input<string>('');
  maskStyleClass = input<string>('');
  appendTo = input<DrawerAppendTo>('body');

  // --- Behaviour ---
  /** Render a backdrop mask behind the panel. */
  modal = input(true, { transform: booleanAttribute });
  /** Close when the mask is clicked. */
  dismissible = input(true, { transform: booleanAttribute });
  /** Whether the user may close the sidebar (close button and Escape). */
  closable = input(true, { transform: booleanAttribute });
  showCloseIcon = input(true, { transform: booleanAttribute });
  closeOnEscape = input(true, { transform: booleanAttribute });
  /** Prevent body scrolling while open (always on for modal full screen). */
  blockScroll = input(false, { transform: booleanAttribute });
  autoZIndex = input(true, { transform: booleanAttribute });
  baseZIndex = input(0, { transform: numberAttribute });
  /** Focus the first focusable element on show and keep Tab inside while modal. */
  focusTrap = input(true, { transform: booleanAttribute });
  /** Return focus to the previously focused element after hiding. */
  restoreFocus = input(true, { transform: booleanAttribute });
  /** Animation duration in ms (0 disables animation). */
  transitionDuration = input(300, { transform: numberAttribute });
  /** CSS class(es) of the close icon. Empty string uses Bootstrap's `.btn-close`. */
  closeIcon = input<string>('');
  ariaCloseLabel = input<string>('Close');
  ariaLabel = input<string | undefined>(undefined);
  ariaLabelledBy = input<string | undefined>(undefined);

  // --- Events ---
  /** Emitted once the show animation has started and focus was moved. */
  onShow = output<void>();
  /** Emitted after the hide animation completes. */
  onHide = output<DrawerHideEvent>();

  // --- Templates ---
  readonly headerTpl = contentChild(NgbDrawerHeaderDirective);
  readonly contentTpl = contentChild(NgbDrawerContentDirective);
  readonly footerTpl = contentChild(NgbDrawerFooterDirective);
  readonly headlessTpl = contentChild(NgbDrawerHeadlessDirective);
  readonly closeIconTpl = contentChild(NgbDrawerCloseIconDirective);

  private readonly container = viewChild<ElementRef<HTMLElement>>('container');
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');

  readonly id = `ngb-drawer-${nextId++}`;
  readonly headerId = `${this.id}-header`;

  /** DOM is rendered (stays true during the leave animation). */
  readonly rendered = signal(false);
  /** "Shown" CSS state is applied (drives the animation). */
  readonly active = signal(false);
  readonly zIndex = signal<number | null>(null);
  readonly maskZIndex = computed(() => {
    const z = this.zIndex();
    return z === null ? null : z - 1;
  });

  readonly effectivePosition = computed<DrawerPosition>(() =>
    this.fullScreen() ? 'full' : this.position(),
  );

  readonly labelledBy = computed(
    () => this.ariaLabelledBy() ?? (this.header() || this.headerTpl() ? this.headerId : null),
  );

  /** Bootstrap offcanvas classes (plus `ngb-drawer-*` hooks for tests and custom styling). */
  readonly panelClasses = computed(() => {
    const pos = this.effectivePosition();
    const cls: Record<string, boolean> = {
      [OFFCANVAS_POSITION[pos]]: true,
      [`ngb-drawer-${pos}`]: true,
      show: this.active(),
      'ngb-drawer-active': this.active(),
    };
    if (this.styleClass()) cls[this.styleClass()] = true;
    return cls;
  });

  /** Sizes and timing go through Bootstrap's own offcanvas CSS variables. */
  readonly panelStyle = computed(() => {
    const s: Record<string, any> = {
      '--bs-offcanvas-transition': `transform ${this.transitionDuration()}ms ease-in-out`,
    };
    const size = this.size();
    const pos = this.effectivePosition();
    if (pos === 'full') {
      s['--bs-offcanvas-height'] = '100vh';
    } else if (size && (pos === 'left' || pos === 'right')) {
      s['--bs-offcanvas-width'] = size;
    } else if (size) {
      s['--bs-offcanvas-height'] = size;
    }
    return { ...s, ...(this.style() ?? {}) };
  });

  readonly tplContext: DrawerTemplateContext = {
    $implicit: () => this.close(),
    close: () => this.close(),
  };

  private previouslyFocused: Element | null = null;
  private hideReason: DrawerHideEvent['reason'] = 'programmatic';
  private leaveTimer: ReturnType<typeof setTimeout> | null = null;
  private enterTimer: ReturnType<typeof setTimeout> | null = null;
  private scrollBlocked = false;
  private readonly keydownListener = (e: KeyboardEvent) => this.onDocumentKeydown(e);

  constructor() {
    effect(() => {
      const v = this.visible();
      untracked(() => (v ? this.show() : this.hide()));
    });
  }

  /** Open the sidebar. */
  open(): void {
    this.visible.set(true);
  }

  /** Close the sidebar. */
  close(reason: DrawerHideEvent['reason'] = 'programmatic'): void {
    if (!this.visible()) return;
    this.hideReason = reason;
    this.visible.set(false);
  }

  /** Toggle visibility. */
  toggle(): void {
    this.visible() ? this.close() : this.open();
  }

  onMaskClick(): void {
    if (this.modal() && this.dismissible()) this.close('mask');
  }

  private show(): void {
    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }
    if (this.active() || this.enterTimer) return;
    this.previouslyFocused = this.document.activeElement;
    if (this.autoZIndex()) this.zIndex.set(1100 + this.baseZIndex() + ++zIndexCounter);
    else this.zIndex.set(this.baseZIndex() || null);
    this.rendered.set(true);
    this.document.addEventListener('keydown', this.keydownListener);
    if (this.blockScroll() || (this.modal() && this.effectivePosition() === 'full')) {
      if (scrollLocks++ === 0) this.document.body.style.overflow = 'hidden';
      this.scrollBlocked = true;
    }
    // Let the element render in its hidden state first so the enter transition runs.
    this.enterTimer = setTimeout(() => {
      this.enterTimer = null;
      this.moveToTarget();
      // Force a reflow so the transform transition starts from the off-screen position.
      void this.container()?.nativeElement.offsetWidth;
      this.active.set(true);
      if (this.focusTrap()) this.focusFirst();
      this.onShow.emit();
    });
  }

  private hide(): void {
    if (this.enterTimer) {
      clearTimeout(this.enterTimer);
      this.enterTimer = null;
    }
    if (!this.rendered() || this.leaveTimer) return;
    this.active.set(false);
    this.document.removeEventListener('keydown', this.keydownListener);
    this.unblockScroll();
    const reason = this.hideReason;
    this.hideReason = 'programmatic';
    this.leaveTimer = setTimeout(() => {
      this.leaveTimer = null;
      this.restoreTarget();
      this.rendered.set(false);
      if (this.restoreFocus() && this.previouslyFocused instanceof HTMLElement) {
        this.previouslyFocused.focus();
      }
      this.previouslyFocused = null;
      this.onHide.emit({ reason });
    }, this.transitionDuration());
  }

  private moveToTarget(): void {
    const el = this.root()?.nativeElement;
    const target = this.appendTo();
    if (!el || !target || target === 'self') return;
    (target === 'body' ? this.document.body : target).appendChild(el);
  }

  /** Move the DOM back under the host so Angular can remove it cleanly. */
  private restoreTarget(): void {
    const el = this.root()?.nativeElement;
    const host = this.hostEl.nativeElement;
    if (el && el.parentElement !== host) host.appendChild(el);
  }

  private unblockScroll(): void {
    if (!this.scrollBlocked) return;
    this.scrollBlocked = false;
    if (--scrollLocks === 0) this.document.body.style.overflow = '';
  }

  private focusables(): HTMLElement[] {
    const c = this.container()?.nativeElement;
    return c ? Array.from(c.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
  }

  private focusFirst(): void {
    const items = this.focusables();
    const target =
      items.find((el) => el.hasAttribute('autofocus')) ??
      items.find((el) => !el.classList.contains('ngb-drawer-close')) ??
      items[0] ??
      this.container()?.nativeElement;
    target?.focus();
  }

  /** Only the top-most open sidebar reacts to Escape. */
  private isTopMost(): boolean {
    const mine = this.zIndex() ?? 0;
    return Array.from(
      this.document.querySelectorAll<HTMLElement>('.ngb-drawer.ngb-drawer-active'),
    ).every((e) => (Number(e.style.zIndex) || 0) <= mine);
  }

  private onDocumentKeydown(e: KeyboardEvent): void {
    if (!this.active()) return;
    if (e.key === 'Escape' && this.closeOnEscape() && this.closable() && this.isTopMost()) {
      e.preventDefault();
      this.close('escape');
      return;
    }
    if (e.key === 'Tab' && this.focusTrap() && this.modal() && this.isTopMost()) {
      const items = this.focusables();
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = this.document.activeElement;
      const inside = !!this.container()?.nativeElement.contains(activeEl);
      if (e.shiftKey && (activeEl === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (activeEl === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.leaveTimer) clearTimeout(this.leaveTimer);
    if (this.enterTimer) clearTimeout(this.enterTimer);
    this.document.removeEventListener('keydown', this.keydownListener);
    this.unblockScroll();
    this.root()?.nativeElement.remove();
  }
}
