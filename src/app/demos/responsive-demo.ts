import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  NGB_SIDEBAR,
  NgbSidebarMobileOptions,
  SidebarCollapsible,
  SidebarSide,
} from '@amro93/ngb-sidebar';

const HTML = `
<div class="row g-2 align-items-end mb-3 small">
  <div class="col-12">
    <div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" id="r-sim" [checked]="simulate()"
             (change)="simulate.set(!simulate())" />
      <label class="form-check-label fw-semibold" for="r-sim">
        Simulate mobile view (sets <code>breakpoint</code> above any screen width)
      </label>
    </div>
  </div>
  <div class="col-6 col-md-3">
    <label class="form-label fw-semibold mb-1" for="r-coll">mobile.collapsible</label>
    <select id="r-coll" class="form-select form-select-sm" [value]="collapsible()"
            (change)="collapsible.set($any($event.target).value)">
      <option value="offcanvas">offcanvas</option>
      <option value="icon">icon</option>
      <option value="none">none</option>
    </select>
  </div>
  <div class="col-6 col-md-3">
    <label class="form-label fw-semibold mb-1" for="r-side">mobile.side</label>
    <select id="r-side" class="form-select form-select-sm" [value]="side()"
            (change)="side.set($any($event.target).value)">
      <option value="left">left</option>
      <option value="right">right</option>
    </select>
  </div>
  <div class="col-6 col-md-3">
    <label class="form-label fw-semibold mb-1" for="r-width">mobile.width</label>
    <select id="r-width" class="form-select form-select-sm" [value]="width()"
            (change)="width.set($any($event.target).value)">
      <option>18rem</option><option>80%</option><option>100%</option>
    </select>
  </div>
  <div class="col-12 d-flex flex-wrap gap-3">
    @for (opt of toggles; track opt.key) {
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" [id]="'r-' + opt.key"
               [checked]="flags()[opt.key]" (change)="toggle(opt.key)" />
        <label class="form-check-label" [for]="'r-' + opt.key">mobile.{{ opt.key }}</label>
      </div>
    }
  </div>
  <div class="col-12 d-flex flex-wrap gap-3 align-items-center">
    <div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" id="r-swipe" [checked]="swipe()"
             (change)="swipe.set(!swipe())" />
      <label class="form-check-label" for="r-swipe">swipe</label>
    </div>
    <label class="d-flex align-items-center gap-1" for="r-edge">
      swipeEdge
      <input id="r-edge" type="number" min="8" max="96" class="form-control form-control-sm"
             style="width: 5rem" [value]="swipeEdge()"
             (change)="swipeEdge.set(+$any($event.target).value)" />
    </label>
    <span class="text-body-secondary">
      <i class="bi bi-hand-index"></i> On a touch screen: swipe in from the edge to open, swipe the panel back to close.
    </span>
  </div>
</div>

<div class="demo-frame">
  <ngb-sidebar-layout [fill]="false">
    <ngb-sidebar #sb="ngbSidebar" id="responsive-demo" collapsible="icon"
                 [breakpoint]="simulate() ? 100000 : 1024" [mobile]="mobile()" [swipe]="swipe()" [swipeEdge]="swipeEdge()"
                 [keyboardShortcut]="null">
      <ngb-sidebar-header>
        <ngb-sidebar-menu>
          <ngb-sidebar-menu-item>
            <button ngbSidebarMenuButton size="lg" tooltip="Acme Inc" keepOpen>
              <span class="demo-logo">A</span><span class="fw-semibold">Acme Inc</span>
            </button>
          </ngb-sidebar-menu-item>
        </ngb-sidebar-menu>
      </ngb-sidebar-header>
      <ngb-sidebar-content>
        <ngb-sidebar-group>
          <ngb-sidebar-group-label>Menu</ngb-sidebar-group-label>
          <ngb-sidebar-group-content>
            <ngb-sidebar-menu>
              @for (item of items; track item.label) {
                <ngb-sidebar-menu-item>
                  <!-- closeOnNavigate collapses the sidebar on mobile after this click -->
                  <button ngbSidebarMenuButton [tooltip]="item.label"
                          [isActive]="active() === item.label" (click)="active.set(item.label)">
                    <i [class]="item.icon"></i><span>{{ item.label }}</span>
                  </button>
                  @if (item.badge) {
                    <ngb-sidebar-menu-badge badgeClass="text-bg-danger">{{ item.badge }}</ngb-sidebar-menu-badge>
                  }
                </ngb-sidebar-menu-item>
              }
            </ngb-sidebar-menu>
          </ngb-sidebar-group-content>
        </ngb-sidebar-group>
      </ngb-sidebar-content>
      <ngb-sidebar-footer>
        <ngb-sidebar-menu>
          <ngb-sidebar-menu-item>
            <button ngbSidebarMenuButton tooltip="John Doe" keepOpen>
              <span class="demo-avatar">JD</span><span>John Doe</span>
            </button>
          </ngb-sidebar-menu-item>
        </ngb-sidebar-menu>
      </ngb-sidebar-footer>
    </ngb-sidebar>

    <ngb-sidebar-main>
      <header class="demo-topbar">
        <button class="btn btn-sm btn-light" ngbSidebarTrigger>
          <i class="bi" [class.bi-list]="sb.isMobile()" [class.bi-layout-sidebar]="!sb.isMobile()"></i>
        </button>
        <strong class="small">{{ active() }}</strong>
        <span class="ms-auto badge" [class]="sb.isMobile() ? 'text-bg-warning' : 'text-bg-secondary'">
          {{ sb.isMobile() ? 'mobile' : 'desktop' }} · {{ sb.state() }}
        </span>
      </header>
      <div class="demo-body">
        <div class="demo-block" style="height: 6rem"></div>
        <div class="demo-block flex-fill"></div>
      </div>
    </ngb-sidebar-main>
  </ngb-sidebar-layout>
</div>
`;

const TS = `
import { Component, computed, signal } from '@angular/core';
import { NGB_SIDEBAR, NgbSidebarMobileOptions, SidebarCollapsible, SidebarSide } from '@amro93/ngb-sidebar';

@Component({
  selector: 'app-responsive-demo',
  imports: [...NGB_SIDEBAR],
  templateUrl: './responsive-demo.html',
})
export class ResponsiveDemo {
  simulate = signal(false);
  swipe = signal(true);
  swipeEdge = signal(24);
  active = signal('Home');

  // Mobile behavior settings (everything is optional; these are the defaults
  // except width). Set them app-wide with provideNgbSidebarConfig({ breakpoint, mobile }).
  collapsible = signal<SidebarCollapsible>('offcanvas');
  side = signal<SidebarSide>('left');
  width = signal('18rem');
  flags = signal({ overlay: true, backdrop: true, defaultOpen: false, closeOnNavigate: true });

  mobile = computed<Partial<NgbSidebarMobileOptions>>(() => ({
    collapsible: this.collapsible(),
    side: this.side(),
    width: this.width(),
    ...this.flags(),
  }));

  toggles = [{ key: 'overlay' }, { key: 'backdrop' }, { key: 'defaultOpen' }, { key: 'closeOnNavigate' }] as const;

  toggle(key: 'overlay' | 'backdrop' | 'defaultOpen' | 'closeOnNavigate') {
    this.flags.update((f) => ({ ...f, [key]: !f[key] }));
  }

  items = [
    { icon: 'bi bi-house', label: 'Home' },
    { icon: 'bi bi-inbox', label: 'Inbox', badge: '3' },
    { icon: 'bi bi-search', label: 'Search' },
    { icon: 'bi bi-people', label: 'Team' },
    { icon: 'bi bi-bell', label: 'Notifications' },
    { icon: 'bi bi-gear', label: 'Settings' },
  ];
}
`;

type FlagKey = 'overlay' | 'backdrop' | 'defaultOpen' | 'closeOnNavigate';

@Component({
  selector: 'app-responsive-demo',
  standalone: true,
  imports: [...NGB_SIDEBAR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: HTML,
})
export class ResponsiveDemo {
  static readonly html = HTML;
  static readonly ts = TS;

  simulate = signal(false);
  swipe = signal(true);
  swipeEdge = signal(24);
  active = signal('Home');
  collapsible = signal<SidebarCollapsible>('offcanvas');
  side = signal<SidebarSide>('left');
  width = signal('18rem');
  flags = signal<Record<FlagKey, boolean>>({
    overlay: true,
    backdrop: true,
    defaultOpen: false,
    closeOnNavigate: true,
  });

  mobile = computed<Partial<NgbSidebarMobileOptions>>(() => ({
    collapsible: this.collapsible(),
    side: this.side(),
    width: this.width(),
    ...this.flags(),
  }));

  readonly toggles: { key: FlagKey }[] = [
    { key: 'overlay' },
    { key: 'backdrop' },
    { key: 'defaultOpen' },
    { key: 'closeOnNavigate' },
  ];

  toggle(key: FlagKey): void {
    this.flags.update((f) => ({ ...f, [key]: !f[key] }));
  }

  items = [
    { icon: 'bi bi-house', label: 'Home' },
    { icon: 'bi bi-inbox', label: 'Inbox', badge: '3' },
    { icon: 'bi bi-search', label: 'Search' },
    { icon: 'bi bi-people', label: 'Team' },
    { icon: 'bi bi-bell', label: 'Notifications' },
    { icon: 'bi bi-gear', label: 'Settings' },
  ];
}
