import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  OnInit,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { NgbSidebarComponent } from './sidebar.component';
import { NGB_SIDEBAR_LAYOUT, NgbSidebarRegistry } from './sidebar.registry';
import { SidebarMenuButtonSize } from './sidebar.types';

const SLOT = '<ng-content></ng-content>';

/** Sticky top area (logo, workspace switcher, search). */
@Component({
  selector: 'ngb-sidebar-header',
  standalone: true,
  template: SLOT,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ngb-sidebar-header d-flex flex-column flex-shrink-0 gap-2 p-2' },
})
export class NgbSidebarHeaderComponent {}

/** Scrollable middle area holding the groups. */
@Component({
  selector: 'ngb-sidebar-content',
  standalone: true,
  template: SLOT,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'ngb-sidebar-content d-flex flex-column flex-grow-1 gap-2 overflow-x-hidden overflow-y-auto',
  },
})
export class NgbSidebarContentComponent {}

/** Sticky bottom area (user menu, settings). */
@Component({
  selector: 'ngb-sidebar-footer',
  standalone: true,
  template: SLOT,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ngb-sidebar-footer d-flex flex-column flex-shrink-0 gap-2 p-2' },
})
export class NgbSidebarFooterComponent {}

/** Horizontal divider. */
@Component({
  selector: 'ngb-sidebar-separator',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ngb-sidebar-separator d-block border-top mx-2 my-1', role: 'separator' },
})
export class NgbSidebarSeparatorComponent {}

/** A titled section. Set `collapsible` to fold its content by clicking the label. */
@Component({
  selector: 'ngb-sidebar-group',
  standalone: true,
  template: SLOT,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngb-sidebar-group d-flex flex-column position-relative px-2',
    role: 'group',
    '[attr.data-collapsible]': 'collapsible() || null',
    '[attr.data-open]': 'open()',
  },
})
export class NgbSidebarGroupComponent {
  collapsible = input(false, { transform: booleanAttribute });
  /** Two-way open state when `collapsible`. */
  open = model<boolean>(true);

  toggle(): void {
    if (this.collapsible()) this.open.update((v) => !v);
  }
}

/** Group title. Toggles the group when it is collapsible. */
@Component({
  selector: 'ngb-sidebar-group-label',
  standalone: true,
  template: SLOT,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'ngb-sidebar-group-label d-flex align-items-center gap-2 px-2 rounded small fw-semibold text-body-secondary text-nowrap overflow-hidden',
    '[attr.role]': 'group?.collapsible() ? "button" : null',
    '[attr.tabindex]': 'group?.collapsible() ? 0 : null',
    '[attr.aria-expanded]': 'group?.collapsible() ? group!.open() : null',
    '(click)': 'group?.toggle()',
    '(keydown.enter)': 'group?.toggle()',
    '(keydown.space)': '$event.preventDefault(); group?.toggle()',
  },
})
export class NgbSidebarGroupLabelComponent {
  protected readonly group = inject(NgbSidebarGroupComponent, { optional: true });
}

/** Icon button aligned to the right of a group label (e.g. "add project"). */
@Directive({
  selector: '[ngbSidebarGroupAction]',
  standalone: true,
  host: {
    class:
      'ngb-sidebar-group-action btn btn-sm btn-link link-secondary p-0 position-absolute top-0 end-0 mt-1 me-3',
  },
})
export class NgbSidebarGroupActionDirective {}

/** Body of a group. */
@Component({
  selector: 'ngb-sidebar-group-content',
  standalone: true,
  template: SLOT,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ngb-sidebar-group-content d-block w-100' },
})
export class NgbSidebarGroupContentComponent {}

/** A list of menu items. */
@Component({
  selector: 'ngb-sidebar-menu',
  standalone: true,
  template: SLOT,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ngb-sidebar-menu nav nav-pills flex-column flex-nowrap gap-1', role: 'list' },
})
export class NgbSidebarMenuComponent {}

/** Nested list of sub items inside a (collapsible) menu item. */
@Component({
  selector: 'ngb-sidebar-menu-sub',
  standalone: true,
  template: SLOT,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'ngb-sidebar-menu-sub nav nav-pills flex-column flex-nowrap gap-1 border-start ms-3 ps-2 my-1',
    role: 'list',
  },
})
export class NgbSidebarMenuSubComponent {}

/**
 * A menu entry. Use `<ngb-sidebar-menu-item>` at the first level and `<ngb-sidebar-menu-sub-item>`
 * inside `<ngb-sidebar-menu-sub>`; both can be `collapsible` to nest further.
 */
@Component({
  selector: 'ngb-sidebar-menu-item, ngb-sidebar-menu-sub-item',
  standalone: true,
  template: SLOT,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngb-sidebar-menu-item nav-item d-block position-relative',
    role: 'listitem',
    '[attr.data-collapsible]': 'collapsible() || null',
    '[attr.data-open]': 'collapsible() ? open() : null',
  },
})
export class NgbSidebarMenuItemComponent implements OnInit {
  /** Clicking the button toggles a nested `<ngb-sidebar-menu-sub>`. */
  collapsible = input(false, { transform: booleanAttribute });
  /** Start expanded. */
  defaultOpen = input(false, { transform: booleanAttribute });
  /** Two-way expanded state. */
  open = model<boolean>(false);

  ngOnInit(): void {
    if (this.defaultOpen()) this.open.set(true);
  }

  toggle(): void {
    if (this.collapsible()) this.open.update((v) => !v);
  }
}

@Directive()
abstract class MenuButtonBase {
  private readonly sidebar = inject(NgbSidebarComponent, { optional: true });
  protected readonly item = inject(NgbSidebarMenuItemComponent, { optional: true });

  /** Highlight as the current page (`aria-current="page"`). */
  isActive = input(false, { transform: booleanAttribute });
  /** Shown as a tooltip (`title`) while the sidebar is collapsed to icons. */
  tooltip = input<string | undefined>(undefined);
  size = input<SidebarMenuButtonSize>('md');

  protected readonly title = computed(() =>
    this.sidebar?.iconCollapsed() ? (this.tooltip() ?? null) : null,
  );

  protected onClick(): void {
    this.item?.toggle();
  }
}

/** Main clickable element of a menu item (`<button>` or `<a>`). */
@Directive({
  selector: '[ngbSidebarMenuButton]',
  standalone: true,
  host: {
    class: 'ngb-sidebar-menu-button nav-link d-flex align-items-center gap-2 w-100 px-2 text-start',
    '[class.active]': 'isActive()',
    '[class.link-body-emphasis]': '!isActive()',
    '[class.py-1]': 'size() === "sm"',
    '[class.small]': 'size() === "sm"',
    '[class.py-2]': 'size() === "lg"',
    '[attr.data-active]': 'isActive() || null',
    '[attr.data-size]': 'size()',
    '[attr.aria-current]': 'isActive() ? "page" : null',
    '[attr.aria-expanded]': 'item?.collapsible() ? item!.open() : null',
    '[attr.title]': 'title()',
    '(click)': 'onClick()',
  },
})
export class NgbSidebarMenuButtonDirective extends MenuButtonBase {}

/** Clickable element of a sub item. */
@Directive({
  selector: '[ngbSidebarMenuSubButton]',
  standalone: true,
  host: {
    class:
      'ngb-sidebar-menu-sub-button nav-link d-flex align-items-center gap-2 w-100 px-2 py-1 small text-start',
    '[class.active]': 'isActive()',
    '[class.link-secondary]': '!isActive()',
    '[attr.data-active]': 'isActive() || null',
    '[attr.data-size]': 'size()',
    '[attr.aria-current]': 'isActive() ? "page" : null',
    '[attr.aria-expanded]': 'item?.collapsible() ? item!.open() : null',
    '(click)': 'onClick()',
  },
})
export class NgbSidebarMenuSubButtonDirective extends MenuButtonBase {}

/** Small counter/label on the right of a menu item. */
@Component({
  selector: 'ngb-sidebar-menu-badge',
  standalone: true,
  template: SLOT,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'ngb-sidebar-menu-badge badge rounded-pill position-absolute top-50 end-0 translate-middle-y me-2',
    '[class]': 'badgeClass()',
  },
})
export class NgbSidebarMenuBadgeComponent {
  /** Bootstrap color classes, e.g. `text-bg-danger`. */
  badgeClass = input<string>('bg-secondary-subtle text-secondary-emphasis');
}

/** Secondary icon button on a menu item (e.g. "more" menu). */
@Directive({
  selector: '[ngbSidebarMenuAction]',
  standalone: true,
  host: {
    class:
      'ngb-sidebar-menu-action btn btn-sm btn-link link-body-emphasis p-0 position-absolute top-50 end-0 translate-middle-y me-1',
    '[attr.data-show-on-hover]': 'showOnHover() || null',
  },
})
export class NgbSidebarMenuActionDirective {
  /** Only visible while the item is hovered or focused. */
  showOnHover = input(false, { transform: booleanAttribute });
}

/**
 * Toggles a sidebar. Without `target` it controls the first sidebar of the surrounding layout
 * (or the sidebar it is placed in).
 */
@Directive({
  selector: '[ngbSidebarTrigger]',
  standalone: true,
  exportAs: 'ngbSidebarTrigger',
  host: {
    class: 'ngb-sidebar-trigger',
    '[attr.aria-controls]': 'sidebar()?.id() ?? null',
    '[attr.aria-expanded]': 'sidebar() ? sidebar()!.expanded() : null',
    '[attr.aria-label]': 'ariaLabel()',
    '(click)': 'sidebar()?.toggle()',
  },
})
export class NgbSidebarTriggerDirective {
  private readonly registry = inject(NgbSidebarRegistry);
  private readonly layout = inject(NGB_SIDEBAR_LAYOUT, { optional: true });
  private readonly parent = inject(NgbSidebarComponent, { optional: true });

  /** Id of the sidebar to toggle. */
  target = input<string | undefined>(undefined);
  ariaLabel = input<string>('Toggle sidebar');

  readonly sidebar = computed(() => {
    const t = this.target();
    if (t) return this.registry.get(t);
    return this.parent ?? this.layout?.sidebars()[0];
  });
}

/** Thin hit area along the sidebar edge that toggles it. Place it inside `<ngb-sidebar>`. */
@Directive({
  selector: '[ngbSidebarRail]',
  standalone: true,
  host: {
    class: 'ngb-sidebar-rail',
    tabindex: '-1',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.title]': 'ariaLabel()',
    '(click)': 'sidebar?.toggle()',
  },
})
export class NgbSidebarRailDirective {
  protected readonly sidebar = inject(NgbSidebarComponent, { optional: true });
  ariaLabel = input<string>('Toggle sidebar');
}
