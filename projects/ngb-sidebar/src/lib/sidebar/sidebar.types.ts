/** Visual style of the sidebar. */
export type SidebarVariant = 'sidebar' | 'floating' | 'inset';

/**
 * How the sidebar collapses:
 * - `icon`: shrinks to an icon rail
 * - `offcanvas`: slides fully off screen
 * - `none`: always expanded, cannot collapse
 */
export type SidebarCollapsible = 'icon' | 'offcanvas' | 'none';

/** Side of the layout the sidebar is attached to. */
export type SidebarSide = 'left' | 'right';

/** Current visual state of the sidebar. */
export type SidebarState = 'expanded' | 'collapsed';

/** Size of a menu button. */
export type SidebarMenuButtonSize = 'sm' | 'md' | 'lg';

/**
 * Item model for the data-driven `<ngb-sidebar-nav>`.
 * Items nest without limit through `items`.
 */
export interface NgbSidebarMenuItem {
  /** Stable key, used for expand state and `trackBy`. Falls back to the label path. */
  id?: string;
  label?: string;
  /** Icon CSS class, e.g. `bi bi-house`. */
  icon?: string;
  badge?: string | number;
  /** Badge classes, e.g. `text-bg-danger`. */
  badgeClass?: string;
  /** Renders the item as an `<a href>`. */
  url?: string;
  target?: string;
  /** Called when the item is clicked. */
  command?: (event: SidebarItemClickEvent) => void;
  /** Child items (renders a collapsible sub menu). */
  items?: NgbSidebarMenuItem[];
  /** Initially expanded. */
  expanded?: boolean;
  /** Initially active (ignored when `activeItem` is bound on the nav). */
  active?: boolean;
  disabled?: boolean;
  /** Set to `false` to hide the item. */
  visible?: boolean;
  /** Renders a separator line. */
  separator?: boolean;
  /** Renders a labelled group whose `items` are its menu (top level only). */
  group?: boolean;
  /** Tooltip, also shown as `title` while the sidebar is collapsed to icons. */
  tooltip?: string;
  styleClass?: string;
  /** Icon of a secondary action button shown on the item (e.g. `bi bi-three-dots`). */
  actionIcon?: string;
  actionLabel?: string;
  /** Show the action button only on hover. Default `true`. */
  actionOnHover?: boolean;
  /** Any custom data. */
  data?: unknown;
}

/** How the sidebar behaves below its `breakpoint` (mobile view). */
export interface NgbSidebarMobileOptions {
  /** Collapse mode on mobile. Default `'offcanvas'`. */
  collapsible: SidebarCollapsible;
  /** Float over the content instead of pushing it. Default `true`. */
  overlay: boolean;
  /** Show a backdrop while open. Default `true`. */
  backdrop: boolean;
  /** Open state when entering mobile view. Default `false`. */
  defaultOpen: boolean;
  /** Collapse after a (non-collapsible) menu item is clicked. Default `true`. */
  closeOnNavigate: boolean;
  /** Hover-to-open on mobile (touch screens have no hover). Default `false`. */
  openOnHover: boolean;
  /** Side override; `null` keeps the desktop side. Default `null`. */
  side: SidebarSide | null;
  /** Variant override; `null` keeps the desktop variant. Default `'sidebar'`. */
  variant: SidebarVariant | null;
  /** Width override, e.g. `'85vw'`; `null` keeps the desktop width. Default `'18rem'`. */
  width: string | null;
}

/** App-wide defaults, provided with `provideNgbSidebarConfig()`. */
export interface NgbSidebarConfig {
  /** Default `breakpoint` (px) for every sidebar; `null` disables mobile mode. */
  breakpoint: number | null;
  /** Default mobile behavior for every sidebar. */
  mobile: Partial<NgbSidebarMobileOptions>;
  /** Default for the `swipe` input (touch swipe to show/hide). */
  swipe: boolean;
  /** Default for the `swipeEdge` input (px). */
  swipeEdge: number;
  /** Default for the `swipeThreshold` input (0–1). */
  swipeThreshold: number;
}

export interface SidebarItemClickEvent {
  originalEvent: Event;
  item: NgbSidebarMenuItem;
}
