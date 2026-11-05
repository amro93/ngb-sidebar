import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  booleanAttribute,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  NgbSidebarGroupComponent,
  NgbSidebarGroupContentComponent,
  NgbSidebarGroupLabelComponent,
  NgbSidebarMenuActionDirective,
  NgbSidebarMenuBadgeComponent,
  NgbSidebarMenuButtonDirective,
  NgbSidebarMenuComponent,
  NgbSidebarMenuItemComponent,
  NgbSidebarMenuSubButtonDirective,
  NgbSidebarMenuSubComponent,
  NgbSidebarSeparatorComponent,
} from './sidebar-parts';
import { NgbSidebarMenuItem, SidebarItemClickEvent } from './sidebar.types';

/** Context of the `ngbSidebarNavItem` template. */
export interface SidebarNavItemContext {
  $implicit: NgbSidebarMenuItem;
  depth: number;
  active: boolean;
  expanded: boolean;
  hasChildren: boolean;
}

/** Custom content for each item of `<ngb-sidebar-nav>` (replaces icon + label + chevron). */
@Directive({ selector: 'ng-template[ngbSidebarNavItem]', standalone: true })
export class NgbSidebarNavItemDirective {
  readonly templateRef = inject<TemplateRef<SidebarNavItemContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _dir: NgbSidebarNavItemDirective,
    ctx: unknown,
  ): ctx is SidebarNavItemContext {
    return true;
  }
}

/**
 * Data-driven, infinitely nestable menu built from `NgbSidebarMenuItem[]`.
 * Supports groups, separators, badges, actions, links, commands, active tracking and accordion mode.
 */
@Component({
  selector: 'ngb-sidebar-nav',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgbSidebarGroupComponent,
    NgbSidebarGroupLabelComponent,
    NgbSidebarGroupContentComponent,
    NgbSidebarMenuComponent,
    NgbSidebarMenuItemComponent,
    NgbSidebarMenuSubComponent,
    NgbSidebarMenuButtonDirective,
    NgbSidebarMenuSubButtonDirective,
    NgbSidebarMenuBadgeComponent,
    NgbSidebarMenuActionDirective,
    NgbSidebarSeparatorComponent,
  ],
  templateUrl: './sidebar-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ngb-sidebar-nav', role: 'navigation', '[attr.aria-label]': 'ariaLabel()' },
})
export class NgbSidebarNavComponent {
  /** Menu model. */
  model = input<NgbSidebarMenuItem[]>([]);
  /** Two-way active item. When unbound, `item.active` flags are used initially. */
  activeItem = model<NgbSidebarMenuItem | null>(null);
  /** Only one expanded sibling at a time. */
  accordion = input(false, { transform: booleanAttribute });
  /** Expand the ancestors of the active item automatically. */
  autoExpandActive = input(true, { transform: booleanAttribute });
  /** Clicking an item makes it active. */
  selectOnClick = input(true, { transform: booleanAttribute });
  /** Group labels collapse their group. */
  collapsibleGroups = input(false, { transform: booleanAttribute });
  ariaLabel = input<string>('Main');

  itemClick = output<SidebarItemClickEvent>();
  actionClick = output<SidebarItemClickEvent>();
  expandedChange = output<{ item: NgbSidebarMenuItem; expanded: boolean }>();

  readonly itemTpl = contentChild(NgbSidebarNavItemDirective);

  private readonly expandedSet = signal<ReadonlySet<NgbSidebarMenuItem>>(new Set());

  constructor() {
    // Initialise from model flags.
    effect(() => {
      const items = this.model();
      untracked(() => {
        const set = new Set<NgbSidebarMenuItem>();
        let active: NgbSidebarMenuItem | null = null;
        walk(items, (item) => {
          if (item.expanded) set.add(item);
          if (item.active && !active) active = item;
        });
        this.expandedSet.set(set);
        if (!this.activeItem() && active) this.activeItem.set(active);
      });
    });
    // Reveal the active item.
    effect(() => {
      const active = this.activeItem();
      if (!active || !this.autoExpandActive()) return;
      const path = findPath(this.model(), active);
      if (!path) return;
      untracked(() =>
        this.expandedSet.update((s) => {
          const n = new Set(s);
          path.slice(0, -1).forEach((p) => n.add(p));
          return n;
        }),
      );
    });
  }

  isVisible = (item: NgbSidebarMenuItem) => item.visible !== false;
  hasChildren = (item: NgbSidebarMenuItem) => !!item.items?.some((i) => i.visible !== false);
  isExpanded = (item: NgbSidebarMenuItem) => this.expandedSet().has(item);
  isActive = (item: NgbSidebarMenuItem) => this.activeItem() === item;
  /** True when a descendant is active (used to style collapsed parents). */
  hasActiveChild = (item: NgbSidebarMenuItem): boolean => {
    const a = this.activeItem();
    return !!a && a !== item && !!findPath(item.items ?? [], a);
  };

  setExpanded(item: NgbSidebarMenuItem, expanded: boolean, siblings: NgbSidebarMenuItem[]): void {
    if (this.isExpanded(item) === expanded) return;
    this.expandedSet.update((s) => {
      const n = new Set(s);
      if (expanded) {
        if (this.accordion()) siblings.forEach((sib) => n.delete(sib));
        n.add(item);
      } else {
        n.delete(item);
      }
      return n;
    });
    this.expandedChange.emit({ item, expanded });
  }

  /** Expand every item that has children. */
  expandAll(): void {
    const n = new Set<NgbSidebarMenuItem>();
    walk(this.model(), (i) => this.hasChildren(i) && n.add(i));
    this.expandedSet.set(n);
  }

  collapseAll(): void {
    this.expandedSet.set(new Set());
  }

  onItemClick(event: Event, item: NgbSidebarMenuItem): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    if (!this.hasChildren(item) && this.selectOnClick()) this.activeItem.set(item);
    const e = { originalEvent: event, item };
    item.command?.(e);
    this.itemClick.emit(e);
  }

  onActionClick(event: Event, item: NgbSidebarMenuItem): void {
    event.stopPropagation();
    this.actionClick.emit({ originalEvent: event, item });
  }

  ctx(item: NgbSidebarMenuItem, depth: number): SidebarNavItemContext {
    return {
      $implicit: item,
      depth,
      active: this.isActive(item),
      expanded: this.isExpanded(item),
      hasChildren: this.hasChildren(item),
    };
  }
}

function walk(items: NgbSidebarMenuItem[], fn: (i: NgbSidebarMenuItem) => unknown): void {
  for (const i of items) {
    fn(i);
    if (i.items) walk(i.items, fn);
  }
}

/** Path from a root item to `target` (inclusive), or null. */
function findPath(
  items: NgbSidebarMenuItem[],
  target: NgbSidebarMenuItem,
): NgbSidebarMenuItem[] | null {
  for (const i of items) {
    if (i === target) return [i];
    const sub = i.items && findPath(i.items, target);
    if (sub) return [i, ...sub];
  }
  return null;
}
