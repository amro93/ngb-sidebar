import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NGB_SIDEBAR, NgbSidebarMenuItem } from '@amro93/ngb-sidebar';

const HTML = `
<div class="d-flex flex-wrap gap-3 align-items-end mb-3 small">
  <div>
    <label class="form-label fw-semibold mb-1" for="c-width">width</label>
    <select id="c-width" class="form-select form-select-sm" [value]="width()"
            (change)="width.set($any($event.target).value)">
      <option>14rem</option><option>16rem</option><option>20rem</option>
    </select>
  </div>
  <div>
    <label class="form-label fw-semibold mb-1" for="c-iw">iconWidth</label>
    <select id="c-iw" class="form-select form-select-sm" [value]="iconWidth()"
            (change)="iconWidth.set($any($event.target).value)">
      <option>3rem</option><option>3.5rem</option><option>4rem</option>
    </select>
  </div>
  <div>
    <label class="form-label fw-semibold mb-1" for="c-theme">theme (data-bs-theme)</label>
    <select id="c-theme" class="form-select form-select-sm" [value]="theme() ?? ''"
            (change)="theme.set($any($event.target).value || null)">
      <option value="">inherit</option>
      <option value="light">light</option>
      <option value="dark">dark</option>
    </select>
  </div>
  <div>
    <label class="form-label fw-semibold mb-1" for="c-panel">panelClass</label>
    <select id="c-panel" class="form-select form-select-sm" [value]="panelClass()"
            (change)="panelClass.set($any($event.target).value)">
      <option>bg-body-tertiary</option>
      <option>bg-body</option>
      <option>bg-primary-subtle</option>
      <option>bg-success-subtle</option>
    </select>
  </div>
  <div class="form-check form-switch mb-1">
    <input class="form-check-input" type="checkbox" id="c-dis" [checked]="dismissable()"
           (change)="dismissable.set(!dismissable())" />
    <label class="form-check-label" for="c-dis">dismissable (overlay)</label>
  </div>
  <div class="text-body-secondary">
    <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>B</kbd> toggles · state persisted in
    <code>localStorage['demo-sidebar']</code>
  </div>
</div>

<div class="demo-frame">
  <ngb-sidebar-layout [fill]="false">
    <ngb-sidebar id="config-demo" variant="floating" collapsible="icon" overlay
                 [width]="width()" [iconWidth]="iconWidth()" [dismissable]="dismissable()"
                 [theme]="theme()" [panelClass]="panelClass()"
                 keyboardShortcut="b" stateKey="demo-sidebar" backdrop>
      <ngb-sidebar-content class="pt-2">
        <ngb-sidebar-nav [model]="menu" />
      </ngb-sidebar-content>
      <button ngbSidebarRail></button>
    </ngb-sidebar>
    <ngb-sidebar-main>
      <header class="demo-topbar">
        <button class="btn btn-sm btn-light" ngbSidebarTrigger><i class="bi bi-layout-sidebar"></i></button>
        <span class="small text-body-secondary">Floating · icon · overlay with backdrop</span>
      </header>
      <div class="demo-body"><div class="demo-block flex-fill"></div></div>
    </ngb-sidebar-main>
  </ngb-sidebar-layout>
</div>
`;

const TS = `
import { Component, signal } from '@angular/core';
import { NGB_SIDEBAR, NgbSidebarMenuItem } from '@amro93/ngb-sidebar';

@Component({
  selector: 'app-config-demo',
  imports: [...NGB_SIDEBAR],
  templateUrl: './config-demo.html',
})
export class ConfigDemo {
  width = signal('16rem');
  iconWidth = signal('3rem');
  theme = signal<'light' | 'dark' | null>(null); // Bootstrap color mode for the sidebar only
  panelClass = signal('bg-body-tertiary'); // any Bootstrap background utility
  dismissable = signal(true);

  menu: NgbSidebarMenuItem[] = [
    { label: 'Home', icon: 'bi bi-house', active: true },
    { label: 'Inbox', icon: 'bi bi-inbox', badge: 7 },
    { label: 'Reports', icon: 'bi bi-file-bar-graph', items: [{ label: 'Daily' }, { label: 'Monthly' }] },
    { label: 'Settings', icon: 'bi bi-gear' },
  ];
}
`;

@Component({
  selector: 'app-config-demo',
  standalone: true,
  imports: [...NGB_SIDEBAR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: HTML,
})
export class ConfigDemo {
  static readonly html = HTML;
  static readonly ts = TS;

  width = signal('16rem');
  iconWidth = signal('3rem');
  theme = signal<'light' | 'dark' | null>(null); // Bootstrap color mode for the sidebar only
  panelClass = signal('bg-body-tertiary'); // any Bootstrap background utility
  dismissable = signal(true);
  menu: NgbSidebarMenuItem[] = [
    { label: 'Home', icon: 'bi bi-house', active: true },
    { label: 'Inbox', icon: 'bi bi-inbox', badge: 7 },
    {
      label: 'Reports',
      icon: 'bi bi-file-bar-graph',
      items: [{ label: 'Daily' }, { label: 'Monthly' }],
    },
    { label: 'Settings', icon: 'bi bi-gear' },
  ];
}
