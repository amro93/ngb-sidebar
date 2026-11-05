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
    <label class="form-label fw-semibold mb-1" for="c-theme">Theme (CSS variables)</label>
    <select id="c-theme" class="form-select form-select-sm" [value]="theme()"
            (change)="theme.set($any($event.target).value)">
      <option value="">Default (Bootstrap)</option>
      <option value="demo-theme-dark">Dark</option>
      <option value="demo-theme-indigo">Indigo</option>
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
  <ngb-sidebar-layout [fill]="false" [class]="theme()">
    <ngb-sidebar id="config-demo" variant="floating" collapsible="icon" overlay
                 [width]="width()" [iconWidth]="iconWidth()" [dismissable]="dismissable()"
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
  styles: [\`
    /* Theme the sidebar with CSS variables */
    .demo-theme-dark {
      --ngb-sidebar-bg: #111827;
      --ngb-sidebar-color: #e5e7eb;
      --ngb-sidebar-muted: #9ca3af;
      --ngb-sidebar-border-color: #1f2937;
      --ngb-sidebar-hover-bg: #1f2937;
      --ngb-sidebar-active-bg: #374151;
      --ngb-sidebar-active-color: #fff;
    }
    .demo-theme-indigo {
      --ngb-sidebar-bg: #eef2ff;
      --ngb-sidebar-active-bg: #4f46e5;
      --ngb-sidebar-active-color: #fff;
      --ngb-sidebar-hover-bg: #e0e7ff;
      --ngb-sidebar-radius: 999px;
    }
  \`],
})
export class ConfigDemo {
  width = signal('16rem');
  iconWidth = signal('3rem');
  theme = signal('');
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
  theme = signal('');
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
