import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DrawerHideEvent,
  DrawerPosition,
  NGB_DRAWER_TEMPLATES,
  NgbDrawerComponent,
} from '@amro93/ngb-sidebar';

const HTML = `
<div class="d-flex flex-wrap gap-2 mb-3">
  @for (p of positions; track p) {
    <button class="btn btn-outline-primary btn-sm" (click)="openAt(p)">
      <i class="bi" [class]="icons[p]"></i> {{ p }}
    </button>
  }
  <button class="btn btn-primary btn-sm" (click)="full.set(true)">
    <i class="bi bi-arrows-fullscreen"></i> Full screen
  </button>
  <button class="btn btn-primary btn-sm" (click)="templated.set(true)">
    <i class="bi bi-layout-text-window"></i> Templates
  </button>
  <button class="btn btn-dark btn-sm" (click)="headless.set(true)">
    <i class="bi bi-list"></i> Headless menu
  </button>
</div>
<pre class="code-box small mb-0">{{ events().join('\\n') || 'onShow / onHide events appear here' }}</pre>

<!-- Positions -->
<ngb-drawer [(visible)]="visible" [position]="position()" [header]="'Drawer: ' + position()"
            blockScroll (onShow)="log('onShow')" (onHide)="onHide($event)">
  <p>Slides in from the <strong>{{ position() }}</strong>. Press <kbd>Esc</kbd>, click the mask
    or the close button to close it — the hide reason is reported by <code>onHide</code>.</p>
  <input class="form-control" placeholder="Focus is trapped inside" />
</ngb-drawer>

<!-- Full screen -->
<ngb-drawer [(visible)]="full" fullScreen header="Full screen">
  <p>Covers the whole viewport and blocks page scrolling.</p>
</ngb-drawer>

<!-- Header / footer / close icon templates -->
<ngb-drawer [(visible)]="templated" position="right" size="24rem">
  <ng-template ngbDrawerHeader>
    <div class="d-flex align-items-center gap-2">
      <span class="demo-avatar">AE</span><strong>Amy Elsner</strong>
    </div>
  </ng-template>
  <ng-template ngbDrawerCloseIcon><i class="bi bi-chevron-right"></i></ng-template>
  <p>Custom header, close icon and footer.</p>
  <ng-template ngbDrawerFooter let-close>
    <div class="d-flex gap-2">
      <button class="btn btn-outline-secondary flex-fill" (click)="close()">Cancel</button>
      <button class="btn btn-primary flex-fill" (click)="close()">Save</button>
    </div>
  </ng-template>
</ngb-drawer>

<!-- Headless: full control, e.g. a mobile navigation menu -->
<ngb-drawer [(visible)]="headless" styleClass="text-bg-dark" size="18rem">
  <ng-template ngbDrawerHeadless let-close>
    <div class="d-flex align-items-center justify-content-between p-3 border-bottom border-secondary">
      <strong><i class="bi bi-boxes me-2"></i>My App</strong>
      <button class="btn-close btn-close-white" aria-label="Close" (click)="close()"></button>
    </div>
    <ul class="nav flex-column p-2">
      @for (item of menu; track item.label) {
        <li class="nav-item">
          <a class="nav-link text-white rounded" href="#" (click)="$event.preventDefault(); close()">
            <i [class]="item.icon + ' me-2'"></i>{{ item.label }}
          </a>
        </li>
      }
    </ul>
  </ng-template>
</ngb-drawer>
`;

const TS = `
import { Component, signal } from '@angular/core';
import { DrawerHideEvent, DrawerPosition, NGB_DRAWER_TEMPLATES, NgbDrawerComponent } from '@amro93/ngb-sidebar';

@Component({
  selector: 'app-drawer-demo',
  imports: [NgbDrawerComponent, ...NGB_DRAWER_TEMPLATES],
  templateUrl: './drawer-demo.html',
})
export class DrawerDemo {
  positions: DrawerPosition[] = ['left', 'right', 'top', 'bottom'];
  icons: Record<string, string> = {
    left: 'bi-arrow-right', right: 'bi-arrow-left', top: 'bi-arrow-down', bottom: 'bi-arrow-up',
  };
  position = signal<DrawerPosition>('left');
  visible = signal(false);
  full = signal(false);
  templated = signal(false);
  headless = signal(false);
  events = signal<string[]>([]);

  menu = [
    { label: 'Dashboard', icon: 'bi bi-speedometer2' },
    { label: 'Orders', icon: 'bi bi-cart' },
    { label: 'Settings', icon: 'bi bi-gear' },
  ];

  openAt(p: DrawerPosition) {
    this.position.set(p);
    this.visible.set(true);
  }

  log(msg: string) {
    this.events.update((e) => [msg, ...e].slice(0, 5));
  }

  onHide(e: DrawerHideEvent) {
    this.log('onHide (reason: ' + e.reason + ')');
  }
}
`;

@Component({
  selector: 'app-drawer-demo',
  standalone: true,
  imports: [NgbDrawerComponent, ...NGB_DRAWER_TEMPLATES],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: HTML,
})
export class DrawerDemo {
  static readonly html = HTML;
  static readonly ts = TS;

  positions: DrawerPosition[] = ['left', 'right', 'top', 'bottom'];
  icons: Record<string, string> = {
    left: 'bi-arrow-right',
    right: 'bi-arrow-left',
    top: 'bi-arrow-down',
    bottom: 'bi-arrow-up',
  };
  position = signal<DrawerPosition>('left');
  visible = signal(false);
  full = signal(false);
  templated = signal(false);
  headless = signal(false);
  events = signal<string[]>([]);
  menu = [
    { label: 'Dashboard', icon: 'bi bi-speedometer2' },
    { label: 'Orders', icon: 'bi bi-cart' },
    { label: 'Settings', icon: 'bi bi-gear' },
  ];

  openAt(p: DrawerPosition): void {
    this.position.set(p);
    this.visible.set(true);
  }

  log(msg: string): void {
    this.events.update((e) => [msg, ...e].slice(0, 5));
  }

  onHide(e: DrawerHideEvent): void {
    this.log('onHide (reason: ' + e.reason + ')');
  }
}
