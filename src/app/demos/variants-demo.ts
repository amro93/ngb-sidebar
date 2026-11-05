import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NGB_SIDEBAR, SidebarCollapsible, SidebarSide, SidebarVariant } from '@amro93/ngb-sidebar';
import { NAV_GROUPS, NavItem } from '../data/demo-data';

const HTML = `
<div class="d-flex flex-wrap align-items-end gap-3 mb-3">
  <div>
    <label class="form-label small fw-semibold mb-1" for="v-variant">Variant</label>
    <select id="v-variant" class="form-select form-select-sm" [value]="variant()"
            (change)="variant.set($any($event.target).value)">
      <option value="sidebar">Sidebar</option>
      <option value="floating">Floating</option>
      <option value="inset">Inset</option>
    </select>
  </div>
  <div>
    <label class="form-label small fw-semibold mb-1" for="v-collapsible">Collapsible</label>
    <select id="v-collapsible" class="form-select form-select-sm" [value]="collapsible()"
            (change)="collapsible.set($any($event.target).value)">
      <option value="icon">Icon</option>
      <option value="offcanvas">Offcanvas</option>
      <option value="none">None</option>
    </select>
  </div>
  <div>
    <div class="form-label small fw-semibold mb-1">Side</div>
    <div class="btn-group btn-group-sm" role="group" aria-label="Side">
      <button type="button" class="btn btn-outline-primary" [class.active]="side() === 'left'"
              (click)="side.set('left')">Left</button>
      <button type="button" class="btn btn-outline-primary" [class.active]="side() === 'right'"
              (click)="side.set('right')">Right</button>
    </div>
  </div>
  <div class="form-check form-switch mb-1">
    <input class="form-check-input" type="checkbox" id="v-overlay" [checked]="overlay()"
           (change)="overlay.set(!overlay())" />
    <label class="form-check-label small" for="v-overlay">Overlay</label>
  </div>
  <div class="form-check form-switch mb-1">
    <input class="form-check-input" type="checkbox" id="v-hover" [checked]="openOnHover()"
           (change)="openOnHover.set(!openOnHover())" />
    <label class="form-check-label small" for="v-hover">Open on hover</label>
  </div>
  <div class="form-check form-switch mb-1">
    <input class="form-check-input" type="checkbox" id="v-backdrop" [checked]="backdrop()"
           (change)="backdrop.set(!backdrop())" />
    <label class="form-check-label small" for="v-backdrop">Backdrop</label>
  </div>
</div>

<div class="demo-frame">
  <ngb-sidebar-layout [fill]="false">
    <ngb-sidebar id="variants-demo" [variant]="variant()" [collapsible]="collapsible()"
                 [side]="side()" [overlay]="overlay()" [openOnHover]="openOnHover()"
                 [backdrop]="backdrop()" [(open)]="open" [keyboardShortcut]="null">
      <ngb-sidebar-header>
        <ngb-sidebar-menu>
          <ngb-sidebar-menu-item>
            <button ngbSidebarMenuButton size="lg" tooltip="Acme Inc">
              <span class="demo-logo">A</span>
              <span class="d-flex flex-column lh-sm">
                <span class="fw-semibold">Acme Inc</span>
                <small class="text-body-secondary">Enterprise</small>
              </span>
            </button>
          </ngb-sidebar-menu-item>
        </ngb-sidebar-menu>
      </ngb-sidebar-header>

      <ngb-sidebar-content>
        @for (group of groups; track group.label) {
          <ngb-sidebar-group>
            <ngb-sidebar-group-label>{{ group.label }}</ngb-sidebar-group-label>
            <ngb-sidebar-group-content>
              <ngb-sidebar-menu>
                @for (item of group.items; track item.label) {
                  <ngb-sidebar-menu-item [collapsible]="!!item.subItems"
                                         [defaultOpen]="hasActiveSub(item)">
                    <button ngbSidebarMenuButton [isActive]="active() === item.label"
                            [tooltip]="item.label"
                            (click)="!item.subItems && active.set(item.label)">
                      <i [class]="item.icon"></i>
                      <span>{{ item.label }}</span>
                      @if (item.subItems) {
                        <i class="bi bi-chevron-down ngb-sidebar-rotate"></i>
                      }
                    </button>
                    @if (item.badge) {
                      <ngb-sidebar-menu-badge>{{ item.badge }}</ngb-sidebar-menu-badge>
                    }
                    @if (item.subItems) {
                      <ngb-sidebar-menu-sub>
                        @for (sub of item.subItems; track sub.label) {
                          <ngb-sidebar-menu-sub-item>
                            <button ngbSidebarMenuSubButton [isActive]="active() === sub.label"
                                    (click)="active.set(sub.label)">
                              <span>{{ sub.label }}</span>
                            </button>
                          </ngb-sidebar-menu-sub-item>
                        }
                      </ngb-sidebar-menu-sub>
                    } @else if (!item.badge) {
                      <button ngbSidebarMenuAction showOnHover aria-label="More">
                        <i class="bi bi-three-dots-vertical"></i>
                      </button>
                    }
                  </ngb-sidebar-menu-item>
                }
              </ngb-sidebar-menu>
            </ngb-sidebar-group-content>
          </ngb-sidebar-group>
        }
      </ngb-sidebar-content>

      <ngb-sidebar-footer>
        <ngb-sidebar-menu>
          <ngb-sidebar-menu-item>
            <button ngbSidebarMenuButton size="lg" tooltip="John Doe">
              <span class="demo-avatar">JD</span>
              <span class="d-flex flex-column lh-sm">
                <span class="fw-semibold">John Doe</span>
                <small class="text-body-secondary">john&#64;acme.com</small>
              </span>
            </button>
          </ngb-sidebar-menu-item>
        </ngb-sidebar-menu>
      </ngb-sidebar-footer>
      <button ngbSidebarRail></button>
    </ngb-sidebar>

    <ngb-sidebar-main>
      <header class="demo-topbar">
        <button class="btn btn-sm btn-light" ngbSidebarTrigger target="variants-demo">
          <i class="bi bi-layout-sidebar"></i>
        </button>
        <span class="small text-body-secondary">{{ active() }}</span>
        <span class="ms-auto badge text-bg-light border">open: {{ open() }}</span>
      </header>
      <div class="demo-body">
        <div class="demo-block" style="height: 8rem"></div>
        <div class="demo-block flex-fill"></div>
      </div>
    </ngb-sidebar-main>
  </ngb-sidebar-layout>
</div>
`;

const TS = `
import { Component, signal } from '@angular/core';
import { NGB_SIDEBAR, SidebarCollapsible, SidebarSide, SidebarVariant } from '@amro93/ngb-sidebar';

interface NavItem { icon: string; label: string; badge?: string; subItems?: { label: string }[] }
interface NavGroup { label: string; items: NavItem[] }

@Component({
  selector: 'app-variants-demo',
  imports: [...NGB_SIDEBAR],
  templateUrl: './variants-demo.html',
})
export class VariantsDemo {
  variant = signal<SidebarVariant>('sidebar');
  collapsible = signal<SidebarCollapsible>('icon');
  side = signal<SidebarSide>('left');
  overlay = signal(false);
  openOnHover = signal(false);
  backdrop = signal(false);
  open = signal(true);
  active = signal('Home');

  groups: NavGroup[] = [
    { label: 'Navigation', items: [
      { icon: 'bi bi-house', label: 'Home' },
      { icon: 'bi bi-inbox', label: 'Inbox', badge: '12' },
      { icon: 'bi bi-search', label: 'Search' },
      { icon: 'bi bi-bell', label: 'Notifications', badge: '3' },
    ] },
    { label: 'Projects', items: [
      { icon: 'bi bi-bar-chart', label: 'Analytics',
        subItems: [{ label: 'Overview' }, { label: 'Reports' }, { label: 'Real-time' }] },
      { icon: 'bi bi-people', label: 'Team' },
      { icon: 'bi bi-calendar3', label: 'Calendar' },
      { icon: 'bi bi-folder', label: 'Documents',
        subItems: [{ label: 'Shared' }, { label: 'Private' }, { label: 'Archived' }] },
    ] },
    { label: 'Billing', items: [
      { icon: 'bi bi-credit-card', label: 'Payments' },
      { icon: 'bi bi-cart', label: 'Orders' },
      { icon: 'bi bi-star', label: 'Subscriptions' },
    ] },
  ];

  hasActiveSub(item: NavItem): boolean {
    return !!item.subItems?.some((s) => s.label === this.active());
  }
}
`;

@Component({
  selector: 'app-variants-demo',
  standalone: true,
  imports: [...NGB_SIDEBAR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: HTML,
})
export class VariantsDemo {
  static readonly html = HTML;
  static readonly ts = TS;

  variant = signal<SidebarVariant>('sidebar');
  collapsible = signal<SidebarCollapsible>('icon');
  side = signal<SidebarSide>('left');
  overlay = signal(false);
  openOnHover = signal(false);
  backdrop = signal(false);
  open = signal(true);
  active = signal('Home');
  groups = NAV_GROUPS;

  hasActiveSub(item: NavItem): boolean {
    return !!item.subItems?.some((s) => s.label === this.active());
  }
}
