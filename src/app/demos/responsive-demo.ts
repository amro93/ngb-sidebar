import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NGB_SIDEBAR } from '@amro93/ngb-sidebar';

const HTML = `
<p class="small text-body-secondary mb-2">
  Below <code>breakpoint</code> (1024px) the sidebar becomes an off-canvas overlay with a backdrop
  and starts closed; above it, it stays in icon mode and pushes the content. Resize the window to try it.
  Current mode: <span class="badge text-bg-primary">{{ sb.isMobile() ? 'mobile' : 'desktop' }}</span>
</p>
<div class="demo-frame">
  <ngb-sidebar-layout [fill]="false">
    <ngb-sidebar #sb="ngbSidebar" id="responsive-demo" collapsible="icon" [breakpoint]="1024"
                 [keyboardShortcut]="null">
      <ngb-sidebar-header>
        <ngb-sidebar-menu>
          <ngb-sidebar-menu-item>
            <button ngbSidebarMenuButton size="lg" tooltip="Acme Inc">
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
                  <button ngbSidebarMenuButton [tooltip]="item.label"
                          [isActive]="active() === item.label"
                          (click)="active.set(item.label); sb.isMobile() && sb.collapse()">
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
            <button ngbSidebarMenuButton tooltip="John Doe">
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
        <span class="ms-auto small text-body-secondary">
          {{ sb.isMobile() ? 'Mobile' : 'Desktop' }} · {{ sb.state() }}
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
import { Component, signal } from '@angular/core';
import { NGB_SIDEBAR } from '@amro93/ngb-sidebar';

@Component({
  selector: 'app-responsive-demo',
  imports: [...NGB_SIDEBAR],
  templateUrl: './responsive-demo.html',
})
export class ResponsiveDemo {
  // No media-query code needed: [breakpoint]="1024" switches the sidebar to
  // an off-canvas overlay (with backdrop) on small screens automatically.
  active = signal('Home');
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

  active = signal('Home');
  items = [
    { icon: 'bi bi-house', label: 'Home' },
    { icon: 'bi bi-inbox', label: 'Inbox', badge: '3' },
    { icon: 'bi bi-search', label: 'Search' },
    { icon: 'bi bi-people', label: 'Team' },
    { icon: 'bi bi-bell', label: 'Notifications' },
    { icon: 'bi bi-gear', label: 'Settings' },
  ];
}
