import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NGB_SIDEBAR } from '@amro93/ngb-sidebar';
import { WORKSPACES, Workspace } from '../data/demo-data';

const HTML = `
<div class="demo-frame">
  <ngb-sidebar-layout [fill]="false">
    <ngb-sidebar id="menu-demo" collapsible="icon" [breakpoint]="768" [(open)]="open"
                 [keyboardShortcut]="null">
      <!-- Workspace switcher -->
      <ngb-sidebar-header>
        <ngb-sidebar-menu>
          <ngb-sidebar-menu-item class="dropdown">
            <button ngbSidebarMenuButton size="lg" [tooltip]="workspace().name"
                    data-bs-toggle="dropdown" aria-expanded="false">
              <span class="demo-logo" [style.background]="workspace().color">{{ workspace().logo }}</span>
              <span class="d-flex flex-column lh-sm">
                <span class="fw-semibold">{{ workspace().name }}</span>
                <small class="text-body-secondary">{{ workspace().plan }}</small>
              </span>
              <i class="bi bi-chevron-expand ms-auto"></i>
            </button>
            <ul class="dropdown-menu shadow-sm w-100">
              <li><h6 class="dropdown-header">Workspaces</h6></li>
              @for (w of workspaces; track w.name; let i = $index) {
                <li>
                  <button class="dropdown-item d-flex align-items-center gap-2" (click)="workspace.set(w)">
                    <span class="demo-logo demo-logo-sm" [style.background]="w.color">{{ w.logo }}</span>
                    {{ w.name }}
                    @if (w === workspace()) { <i class="bi bi-check2 ms-auto"></i> }
                    @else { <kbd class="ms-auto small">⌘{{ i + 1 }}</kbd> }
                  </button>
                </li>
              }
              <li><hr class="dropdown-divider" /></li>
              <li><button class="dropdown-item"><i class="bi bi-plus-lg me-2"></i>Add workspace</button></li>
            </ul>
          </ngb-sidebar-menu-item>
        </ngb-sidebar-menu>
      </ngb-sidebar-header>

      <ngb-sidebar-content>
        <ngb-sidebar-group>
          <ngb-sidebar-group-label>Navigation</ngb-sidebar-group-label>
          <button ngbSidebarGroupAction class="btn btn-sm btn-link p-0 text-body-secondary"
                  aria-label="Add">
            <i class="bi bi-plus-lg"></i>
          </button>
          <ngb-sidebar-group-content>
            <nav aria-label="Main">
              <ngb-sidebar-menu>
                @for (item of items; track item.label) {
                  <ngb-sidebar-menu-item>
                    <button ngbSidebarMenuButton [isActive]="active() === item.label"
                            [tooltip]="item.label" (click)="active.set(item.label)">
                      <i [class]="item.icon"></i><span>{{ item.label }}</span>
                    </button>
                  </ngb-sidebar-menu-item>
                }
              </ngb-sidebar-menu>
            </nav>
          </ngb-sidebar-group-content>
        </ngb-sidebar-group>
      </ngb-sidebar-content>

      <!-- User menu -->
      <ngb-sidebar-footer>
        <ngb-sidebar-menu>
          <ngb-sidebar-menu-item class="dropup">
            <button ngbSidebarMenuButton size="lg" tooltip="John Doe"
                    data-bs-toggle="dropdown" aria-expanded="false">
              <span class="demo-avatar">JD</span>
              <span class="d-flex flex-column lh-sm">
                <span class="fw-semibold">John Doe</span>
                <small class="text-body-secondary">john&#64;acme.com</small>
              </span>
              <i class="bi bi-three-dots-vertical ms-auto"></i>
            </button>
            <ul class="dropdown-menu shadow-sm w-100">
              <li><h6 class="dropdown-header">john&#64;acme.com</h6></li>
              <li><button class="dropdown-item"><i class="bi bi-person me-2"></i>Profile</button></li>
              <li><button class="dropdown-item"><i class="bi bi-gear me-2"></i>Settings</button></li>
              <li><hr class="dropdown-divider" /></li>
              <li><button class="dropdown-item text-danger"><i class="bi bi-box-arrow-right me-2"></i>Sign out</button></li>
            </ul>
          </ngb-sidebar-menu-item>
        </ngb-sidebar-menu>
      </ngb-sidebar-footer>
      <button ngbSidebarRail></button>
    </ngb-sidebar>

    <ngb-sidebar-main>
      <header class="demo-topbar">
        <button class="btn btn-sm btn-light" ngbSidebarTrigger target="menu-demo">
          <i class="bi bi-layout-sidebar"></i>
        </button>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb small mb-0">
            <li class="breadcrumb-item">{{ workspace().name }}</li>
            <li class="breadcrumb-item active">{{ active() }}</li>
          </ol>
        </nav>
      </header>
      <div class="demo-body">
        <div class="row g-3">
          @for (n of [1, 2, 3]; track n) {
            <div class="col-4"><div class="demo-block" style="height: 5rem"></div></div>
          }
        </div>
        <div class="demo-block flex-fill"></div>
      </div>
    </ngb-sidebar-main>
  </ngb-sidebar-layout>
</div>
`;

const TS = `
import { Component, signal } from '@angular/core';
import { NGB_SIDEBAR } from '@amro93/ngb-sidebar';

interface Workspace { name: string; plan: string; logo: string; color: string }

@Component({
  selector: 'app-menu-demo',
  imports: [...NGB_SIDEBAR],
  templateUrl: './menu-demo.html',
})
export class MenuDemo {
  open = signal(true);
  active = signal('Home');

  workspaces: Workspace[] = [
    { name: 'Acme Inc', plan: 'Enterprise', logo: 'A', color: 'linear-gradient(135deg,#7c3aed,#4f46e5)' },
    { name: 'Globex', plan: 'Startup', logo: 'G', color: 'linear-gradient(135deg,#059669,#10b981)' },
    { name: 'Initech', plan: 'Free', logo: 'I', color: 'linear-gradient(135deg,#ea580c,#f59e0b)' },
  ];
  workspace = signal(this.workspaces[0]);

  items = [
    { icon: 'bi bi-house', label: 'Home' },
    { icon: 'bi bi-inbox', label: 'Inbox' },
    { icon: 'bi bi-search', label: 'Search' },
    { icon: 'bi bi-people', label: 'Team' },
    { icon: 'bi bi-bell', label: 'Notifications' },
  ];
}
`;

@Component({
  selector: 'app-menu-demo',
  standalone: true,
  imports: [...NGB_SIDEBAR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: HTML,
})
export class MenuDemo {
  static readonly html = HTML;
  static readonly ts = TS;

  open = signal(true);
  active = signal('Home');
  workspaces = WORKSPACES;
  workspace = signal<Workspace>(WORKSPACES[0]);
  items = [
    { icon: 'bi bi-house', label: 'Home' },
    { icon: 'bi bi-inbox', label: 'Inbox' },
    { icon: 'bi bi-search', label: 'Search' },
    { icon: 'bi bi-people', label: 'Team' },
    { icon: 'bi bi-bell', label: 'Notifications' },
  ];
}
