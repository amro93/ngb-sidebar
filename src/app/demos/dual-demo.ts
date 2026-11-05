import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NGB_SIDEBAR } from '@amro93/ngb-sidebar';

const HTML = `
<div class="demo-frame">
  <ngb-sidebar-layout [fill]="false">
    <!-- Left: icon-collapsible navigation -->
    <ngb-sidebar id="dual-nav" collapsible="icon" [(open)]="navOpen" [keyboardShortcut]="null">
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
          <ngb-sidebar-group-label>Navigation</ngb-sidebar-group-label>
          <ngb-sidebar-group-content>
            <ngb-sidebar-menu>
              <ngb-sidebar-menu-item>
                <button ngbSidebarMenuButton isActive tooltip="Home"><i class="bi bi-house"></i><span>Home</span></button>
              </ngb-sidebar-menu-item>
              <ngb-sidebar-menu-item>
                <button ngbSidebarMenuButton tooltip="Inbox"><i class="bi bi-inbox"></i><span>Inbox</span></button>
                <ngb-sidebar-menu-badge>5</ngb-sidebar-menu-badge>
              </ngb-sidebar-menu-item>
              <ngb-sidebar-menu-item>
                <button ngbSidebarMenuButton tooltip="Search"><i class="bi bi-search"></i><span>Search</span></button>
              </ngb-sidebar-menu-item>
            </ngb-sidebar-menu>
          </ngb-sidebar-group-content>
        </ngb-sidebar-group>
        <ngb-sidebar-group>
          <ngb-sidebar-group-label>Projects</ngb-sidebar-group-label>
          <ngb-sidebar-group-content>
            <ngb-sidebar-menu>
              <ngb-sidebar-menu-item collapsible defaultOpen>
                <button ngbSidebarMenuButton tooltip="Analytics">
                  <i class="bi bi-bar-chart"></i><span>Analytics</span>
                  <i class="bi bi-chevron-down ngb-sidebar-rotate"></i>
                </button>
                <ngb-sidebar-menu-sub>
                  <ngb-sidebar-menu-sub-item><button ngbSidebarMenuSubButton isActive>Overview</button></ngb-sidebar-menu-sub-item>
                  <ngb-sidebar-menu-sub-item><button ngbSidebarMenuSubButton>Reports</button></ngb-sidebar-menu-sub-item>
                </ngb-sidebar-menu-sub>
              </ngb-sidebar-menu-item>
              <ngb-sidebar-menu-item>
                <button ngbSidebarMenuButton tooltip="Team"><i class="bi bi-people"></i><span>Team</span></button>
              </ngb-sidebar-menu-item>
            </ngb-sidebar-menu>
          </ngb-sidebar-group-content>
        </ngb-sidebar-group>
      </ngb-sidebar-content>
      <button ngbSidebarRail></button>
    </ngb-sidebar>

    <ngb-sidebar-main>
      <header class="demo-topbar">
        <button class="btn btn-sm btn-light" ngbSidebarTrigger target="dual-nav" aria-label="Toggle navigation">
          <i class="bi bi-layout-sidebar"></i>
        </button>
        <div class="lh-sm">
          <div class="fw-semibold small">Dashboard</div>
          <div class="small text-body-secondary">Weekly metrics overview</div>
        </div>
        <button class="btn btn-sm btn-primary ms-auto" ngbSidebarTrigger target="dual-chat" aria-label="Toggle assistant">
          <i class="bi bi-stars me-1"></i>Assistant
        </button>
      </header>
      <div class="demo-body">
        <div class="row g-3">
          <div class="col"><div class="demo-stat"><small>Page views</small><strong>12,482</strong></div></div>
          <div class="col"><div class="demo-stat"><small>New users</small><strong>342</strong></div></div>
          <div class="col"><div class="demo-stat"><small>Bounce rate</small><strong>34%</strong></div></div>
        </div>
        <div class="demo-block flex-fill"></div>
      </div>
    </ngb-sidebar-main>

    <!-- Right: offcanvas chat panel -->
    <ngb-sidebar id="dual-chat" side="right" collapsible="offcanvas" width="20rem"
                 [(open)]="chatOpen" [keyboardShortcut]="null" ariaLabel="Assistant">
      <ngb-sidebar-header class="border-bottom flex-row align-items-center">
        <i class="bi bi-stars text-primary"></i><strong class="small">Assistant</strong>
        <button class="btn-close ms-auto" aria-label="Close" (click)="chatOpen.set(false)"></button>
      </ngb-sidebar-header>
      <ngb-sidebar-content class="p-3 small">
        <div class="align-self-end bg-primary text-white rounded-3 px-3 py-2">Show me this week's metrics</div>
        <div class="bg-body border rounded-3 px-3 py-2">
          Here are your key metrics for this week:
          <ul class="mb-0 mt-1 ps-3">
            <li>Page views: <strong>12,482</strong></li>
            <li>New users: <strong>342</strong></li>
            <li>Bounce rate: <strong>34%</strong></li>
          </ul>
        </div>
      </ngb-sidebar-content>
      <ngb-sidebar-footer>
        <div class="input-group input-group-sm">
          <input class="form-control" placeholder="Ask anything…" aria-label="Message" />
          <button class="btn btn-primary" aria-label="Send"><i class="bi bi-send"></i></button>
        </div>
      </ngb-sidebar-footer>
    </ngb-sidebar>
  </ngb-sidebar-layout>
</div>
`;

const TS = `
import { Component, signal } from '@angular/core';
import { NGB_SIDEBAR } from '@amro93/ngb-sidebar';

@Component({
  selector: 'app-dual-demo',
  imports: [...NGB_SIDEBAR],
  templateUrl: './dual-demo.html',
})
export class DualDemo {
  // Each sidebar has its own id, state and trigger (ngbSidebarTrigger [target]).
  navOpen = signal(true);
  chatOpen = signal(false);
}
`;

@Component({
  selector: 'app-dual-demo',
  standalone: true,
  imports: [...NGB_SIDEBAR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: HTML,
})
export class DualDemo {
  static readonly html = HTML;
  static readonly ts = TS;
  navOpen = signal(true);
  chatOpen = signal(false);
}
