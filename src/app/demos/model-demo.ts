import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NGB_SIDEBAR, NgbSidebarMenuItem, SidebarItemClickEvent } from '@amro93/ngb-sidebar';

const HTML = `
<div class="row g-3">
  <div class="col-lg-8">
    <div class="demo-frame">
      <ngb-sidebar-layout [fill]="false">
        <ngb-sidebar id="model-demo" collapsible="icon" [keyboardShortcut]="null">
          <ngb-sidebar-content class="pt-2">
            <ngb-sidebar-nav [model]="menu" [(activeItem)]="active" collapsibleGroups
                             (itemClick)="log('itemClick', $event)"
                             (actionClick)="log('actionClick', $event)"
                             (expandedChange)="logExpand($event.item, $event.expanded)">
              <!-- Optional custom item template -->
              <ng-template ngbSidebarNavItem let-item let-depth="depth" let-hasChildren="hasChildren">
                @if (item.icon) { <i [class]="item.icon"></i> }
                <span>{{ item.label }}</span>
                @if (item.data === 'new') { <span class="badge text-bg-success ms-1" style="font-size:.6rem">NEW</span> }
                @if (hasChildren) { <i class="ngb-sidebar-chevron"></i> }
              </ng-template>
            </ngb-sidebar-nav>
          </ngb-sidebar-content>
          <button ngbSidebarRail></button>
        </ngb-sidebar>
        <ngb-sidebar-main>
          <header class="demo-topbar">
            <button class="btn btn-sm btn-light" ngbSidebarTrigger><i class="bi bi-layout-sidebar"></i></button>
            <span class="small">Active: <strong>{{ active()?.label ?? '—' }}</strong></span>
          </header>
          <div class="demo-body"><div class="demo-block flex-fill"></div></div>
        </ngb-sidebar-main>
      </ngb-sidebar-layout>
    </div>
  </div>
  <div class="col-lg-4">
    <div class="small fw-semibold mb-1">Events</div>
    <pre class="code-box small mb-0" style="min-height: 10rem">{{ logs().join('\\n') || 'Click items…' }}</pre>
  </div>
</div>
`;

const TS = `
import { Component, signal } from '@angular/core';
import { NGB_SIDEBAR, NgbSidebarMenuItem, SidebarItemClickEvent } from '@amro93/ngb-sidebar';

@Component({
  selector: 'app-model-demo',
  imports: [...NGB_SIDEBAR],
  templateUrl: './model-demo.html',
})
export class ModelDemo {
  active = signal<NgbSidebarMenuItem | null>(null);
  logs = signal<string[]>([]);

  menu: NgbSidebarMenuItem[] = [
    { group: true, label: 'Platform', items: [
      { label: 'Dashboard', icon: 'bi bi-speedometer2', active: true },
      { label: 'Inbox', icon: 'bi bi-inbox', badge: 24, badgeClass: 'text-bg-primary' },
      { label: 'Playground', icon: 'bi bi-terminal', expanded: true, items: [
        { label: 'History' },
        { label: 'Starred', badge: 3 },
        { label: 'Settings', items: [            // 3rd level
          { label: 'General' },
          { label: 'Advanced', data: 'new' },
        ] },
      ] },
      { label: 'Models', icon: 'bi bi-cpu', items: [
        { label: 'Genesis' }, { label: 'Explorer' }, { label: 'Quantum', disabled: true },
      ] },
    ] },
    { separator: true },
    { group: true, label: 'Projects', items: [
      { label: 'Design Engineering', icon: 'bi bi-vector-pen', actionIcon: 'bi bi-three-dots' },
      { label: 'Sales & Marketing', icon: 'bi bi-graph-up', actionIcon: 'bi bi-three-dots' },
      { label: 'Travel', icon: 'bi bi-map', actionIcon: 'bi bi-three-dots' },
    ] },
    { group: true, label: 'Links', items: [
      { label: 'Documentation', icon: 'bi bi-book', url: 'https://github.com/amro93/ngb-sidebar', target: '_blank' },
      { label: 'Say hello', icon: 'bi bi-emoji-smile',
        command: (e) => alert('command() called for ' + e.item.label) },
      { label: 'Hidden item', visible: false },
    ] },
  ];

  log(type: string, e: SidebarItemClickEvent) {
    this.logs.update((l) => [type + ': ' + e.item.label, ...l].slice(0, 6));
  }

  logExpand(item: NgbSidebarMenuItem, expanded: boolean) {
    this.logs.update((l) => [(expanded ? 'expand: ' : 'collapse: ') + item.label, ...l].slice(0, 6));
  }
}
`;

@Component({
  selector: 'app-model-demo',
  standalone: true,
  imports: [...NGB_SIDEBAR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: HTML,
})
export class ModelDemo {
  static readonly html = HTML;
  static readonly ts = TS;

  active = signal<NgbSidebarMenuItem | null>(null);
  logs = signal<string[]>([]);

  menu: NgbSidebarMenuItem[] = [
    {
      group: true,
      label: 'Platform',
      items: [
        { label: 'Dashboard', icon: 'bi bi-speedometer2', active: true },
        { label: 'Inbox', icon: 'bi bi-inbox', badge: 24, badgeClass: 'text-bg-primary' },
        {
          label: 'Playground',
          icon: 'bi bi-terminal',
          expanded: true,
          items: [
            { label: 'History' },
            { label: 'Starred', badge: 3 },
            {
              label: 'Settings',
              items: [{ label: 'General' }, { label: 'Advanced', data: 'new' }],
            },
          ],
        },
        {
          label: 'Models',
          icon: 'bi bi-cpu',
          items: [
            { label: 'Genesis' },
            { label: 'Explorer' },
            { label: 'Quantum', disabled: true },
          ],
        },
      ],
    },
    { separator: true },
    {
      group: true,
      label: 'Projects',
      items: [
        { label: 'Design Engineering', icon: 'bi bi-vector-pen', actionIcon: 'bi bi-three-dots' },
        { label: 'Sales & Marketing', icon: 'bi bi-graph-up', actionIcon: 'bi bi-three-dots' },
        { label: 'Travel', icon: 'bi bi-map', actionIcon: 'bi bi-three-dots' },
      ],
    },
    {
      group: true,
      label: 'Links',
      items: [
        {
          label: 'Documentation',
          icon: 'bi bi-book',
          url: 'https://github.com/amro93/ngb-sidebar',
          target: '_blank',
        },
        {
          label: 'Say hello',
          icon: 'bi bi-emoji-smile',
          command: (e) => this.logs.update((l) => ['command(): ' + e.item.label, ...l].slice(0, 6)),
        },
        { label: 'Hidden item', visible: false },
      ],
    },
  ];

  log(type: string, e: SidebarItemClickEvent): void {
    this.logs.update((l) => [type + ': ' + e.item.label, ...l].slice(0, 6));
  }

  logExpand(item: NgbSidebarMenuItem, expanded: boolean): void {
    this.logs.update((l) =>
      [(expanded ? 'expand: ' : 'collapse: ') + item.label, ...l].slice(0, 6),
    );
  }
}
