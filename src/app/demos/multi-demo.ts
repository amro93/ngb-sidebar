import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NGB_SIDEBAR } from '@amro93/ngb-sidebar';

const HTML = `
<div class="demo-frame">
  <ngb-sidebar-layout [fill]="false">
    <!-- 1. Icon bar that expands on hover -->
    <ngb-sidebar id="multi-icons" collapsible="icon" openOnHover [open]="false"
                 [keyboardShortcut]="null" ariaLabel="Products">
      <ngb-sidebar-header>
        <ngb-sidebar-menu>
          <ngb-sidebar-menu-item>
            <button ngbSidebarMenuButton tooltip="Acme Inc">
              <span class="demo-logo demo-logo-sm">A</span><span class="fw-semibold">Acme Inc</span>
            </button>
          </ngb-sidebar-menu-item>
        </ngb-sidebar-menu>
      </ngb-sidebar-header>
      <ngb-sidebar-content>
        <ngb-sidebar-group>
          <ngb-sidebar-group-content>
            <ngb-sidebar-menu>
              @for (p of products; track p.label) {
                <ngb-sidebar-menu-item>
                  <button ngbSidebarMenuButton [isActive]="product() === p.label"
                          (click)="product.set(p.label)">
                    <i [class]="p.icon"></i><span>{{ p.label }}</span>
                  </button>
                </ngb-sidebar-menu-item>
              }
            </ngb-sidebar-menu>
          </ngb-sidebar-group-content>
        </ngb-sidebar-group>
      </ngb-sidebar-content>
    </ngb-sidebar>

    <!-- 2. Secondary panel -->
    <ngb-sidebar id="multi-secondary" collapsible="offcanvas" width="14rem"
                 [(open)]="secondaryOpen" [keyboardShortcut]="null" [ariaLabel]="product()">
      <ngb-sidebar-header class="border-bottom">
        <strong class="px-2">{{ product() }}</strong>
      </ngb-sidebar-header>
      <ngb-sidebar-content>
        @for (section of sections; track section.label) {
          <ngb-sidebar-group collapsible>
            <ngb-sidebar-group-label>
              {{ section.label }} <i class="ngb-sidebar-chevron ngb-sidebar-group-chevron"></i>
            </ngb-sidebar-group-label>
            <ngb-sidebar-group-content>
              <ngb-sidebar-menu>
                @for (link of section.links; track link) {
                  <ngb-sidebar-menu-item>
                    <button ngbSidebarMenuButton size="sm" [isActive]="page() === link"
                            (click)="page.set(link)">
                      <span>{{ link }}</span>
                    </button>
                    @if (link === 'Vault') {
                      <ngb-sidebar-menu-badge class="text-bg-warning">BETA</ngb-sidebar-menu-badge>
                    }
                  </ngb-sidebar-menu-item>
                }
              </ngb-sidebar-menu>
            </ngb-sidebar-group-content>
          </ngb-sidebar-group>
        }
      </ngb-sidebar-content>
    </ngb-sidebar>

    <ngb-sidebar-main>
      <header class="demo-topbar">
        <button class="btn btn-sm btn-light" ngbSidebarTrigger target="multi-secondary">
          <i class="bi bi-layout-sidebar"></i>
        </button>
        <span class="small"><strong>{{ product() }}</strong> / {{ page() }}</span>
      </header>
      <div class="demo-body"><div class="demo-block flex-fill"></div></div>
    </ngb-sidebar-main>
  </ngb-sidebar-layout>
</div>
`;

const TS = `
import { Component, signal } from '@angular/core';
import { NGB_SIDEBAR } from '@amro93/ngb-sidebar';

@Component({
  selector: 'app-multi-demo',
  imports: [...NGB_SIDEBAR],
  templateUrl: './multi-demo.html',
})
export class MultiDemo {
  product = signal('Settings');
  page = signal('General');
  secondaryOpen = signal(true);

  products = [
    { icon: 'bi bi-house', label: 'Home' },
    { icon: 'bi bi-table', label: 'Table Editor' },
    { icon: 'bi bi-terminal', label: 'SQL Editor' },
    { icon: 'bi bi-database', label: 'Database' },
    { icon: 'bi bi-shield-lock', label: 'Authentication' },
    { icon: 'bi bi-lightning', label: 'Edge Functions' },
    { icon: 'bi bi-archive', label: 'Storage' },
    { icon: 'bi bi-gear', label: 'Settings' },
  ];

  sections = [
    { label: 'Configuration', links: ['General', 'Compute and Disk', 'Infrastructure', 'Integrations', 'API Keys', 'JWT Keys', 'Log Drains', 'Add-ons'] },
    { label: 'Integrations', links: ['Data API', 'Vault'] },
    { label: 'Billing', links: ['Subscription', 'Usage'] },
  ];
}
`;

@Component({
  selector: 'app-multi-demo',
  standalone: true,
  imports: [...NGB_SIDEBAR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: HTML,
})
export class MultiDemo {
  static readonly html = HTML;
  static readonly ts = TS;

  product = signal('Settings');
  page = signal('General');
  secondaryOpen = signal(true);
  products = [
    { icon: 'bi bi-house', label: 'Home' },
    { icon: 'bi bi-table', label: 'Table Editor' },
    { icon: 'bi bi-terminal', label: 'SQL Editor' },
    { icon: 'bi bi-database', label: 'Database' },
    { icon: 'bi bi-shield-lock', label: 'Authentication' },
    { icon: 'bi bi-lightning', label: 'Edge Functions' },
    { icon: 'bi bi-archive', label: 'Storage' },
    { icon: 'bi bi-gear', label: 'Settings' },
  ];
  sections = [
    {
      label: 'Configuration',
      links: [
        'General',
        'Compute and Disk',
        'Infrastructure',
        'Integrations',
        'API Keys',
        'JWT Keys',
        'Log Drains',
        'Add-ons',
      ],
    },
    { label: 'Integrations', links: ['Data API', 'Vault'] },
    { label: 'Billing', links: ['Subscription', 'Usage'] },
  ];
}
