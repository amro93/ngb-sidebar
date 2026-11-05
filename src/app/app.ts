import { Component, signal } from '@angular/core';
import {
  NgbSidebarComponent,
  NgbSidebarCloseIconDirective,
  NgbSidebarFooterDirective,
  NgbSidebarHeadlessDirective,
  NgbSidebarHeaderDirective,
  SidebarHideEvent,
  SidebarPosition,
} from '@amro93/ngb-sidebar';
import { APP_VERSION } from '../version';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgbSidebarComponent,
    NgbSidebarHeaderDirective,
    NgbSidebarFooterDirective,
    NgbSidebarHeadlessDirective,
    NgbSidebarCloseIconDirective,
  ],
  template: `
    <nav class="navbar bg-body-tertiary border-bottom">
      <div class="container">
        <span class="navbar-brand">ngb-sidebar <small class="text-muted">v{{ version }}</small></span>
        <a class="btn btn-outline-secondary btn-sm" href="https://github.com/amro93/ngb-sidebar">
          <i class="bi bi-github"></i> GitHub
        </a>
      </div>
    </nav>

    <main class="container py-4">
      <p class="lead">Standalone Angular sidebar / drawer built on Bootstrap 5.</p>

      <section class="mb-4">
        <h2 class="h4">Basic</h2>
        <button class="btn btn-primary" (click)="basic.set(true)">
          <i class="bi bi-arrow-right"></i> Open
        </button>
        <ngb-sidebar [(visible)]="basic" header="Sidebar">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </ngb-sidebar>
      </section>

      <section class="mb-4">
        <h2 class="h4">Position</h2>
        <div class="d-flex flex-wrap gap-2">
          @for (p of positions; track p) {
            <button class="btn btn-outline-primary" (click)="openPos(p)">{{ p }}</button>
          }
        </div>
        <ngb-sidebar [(visible)]="posVisible" [position]="pos()" [header]="'Position: ' + pos()">
          <p>Slides in from the {{ pos() }}.</p>
        </ngb-sidebar>
      </section>

      <section class="mb-4">
        <h2 class="h4">Full screen</h2>
        <button class="btn btn-primary" (click)="full.set(true)">
          <i class="bi bi-arrows-fullscreen"></i> Open
        </button>
        <ngb-sidebar [(visible)]="full" fullScreen header="Full screen">
          <p>Covers the whole viewport and blocks page scroll.</p>
        </ngb-sidebar>
      </section>

      <section class="mb-4">
        <h2 class="h4">Size</h2>
        <button class="btn btn-primary" (click)="sized.set(true)">Open (40rem)</button>
        <ngb-sidebar [(visible)]="sized" position="right" size="40rem" header="Wide sidebar">
          <p>Width set via the <code>size</code> input (use <code>style</code> or
            <code>styleClass</code> for more control).</p>
        </ngb-sidebar>
      </section>

      <section class="mb-4">
        <h2 class="h4">Templates (header, footer, close icon)</h2>
        <button class="btn btn-primary" (click)="tpl.set(true)">Open</button>
        <ngb-sidebar [(visible)]="tpl" position="right">
          <ng-template ngbSidebarHeader>
            <div class="d-flex align-items-center gap-2">
              <span class="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center" style="width:2rem;height:2rem">A</span>
              <strong>Amy Elsner</strong>
            </div>
          </ng-template>
          <ng-template ngbSidebarCloseIcon><i class="bi bi-chevron-right"></i></ng-template>
          <p>Custom header, close icon and footer.</p>
          <ng-template ngbSidebarFooter let-close>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary flex-fill" (click)="close()">Cancel</button>
              <button class="btn btn-primary flex-fill" (click)="close()">Save</button>
            </div>
          </ng-template>
        </ngb-sidebar>
      </section>

      <section class="mb-4">
        <h2 class="h4">Headless</h2>
        <button class="btn btn-primary" (click)="headless.set(true)"><i class="bi bi-list"></i> Menu</button>
        <ngb-sidebar [(visible)]="headless" styleClass="bg-dark text-white">
          <ng-template ngbSidebarHeadless let-close>
            <div class="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">
              <strong>My App</strong>
              <button class="btn-close btn-close-white" aria-label="Close" (click)="close()"></button>
            </div>
            <ul class="nav flex-column p-2">
              @for (item of menu; track item.label) {
                <li class="nav-item">
                  <a class="nav-link text-white" href="#" (click)="$event.preventDefault(); close()">
                    <i [class]="item.icon"></i> {{ item.label }}
                  </a>
                </li>
              }
            </ul>
          </ng-template>
        </ngb-sidebar>
      </section>

      <section class="mb-4">
        <h2 class="h4">Behaviour options</h2>
        <div class="d-flex flex-wrap gap-3 mb-2">
          <div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="o-modal" [checked]="modal()" (change)="modal.set(!modal())" /><label class="form-check-label" for="o-modal">modal</label></div>
          <div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="o-dis" [checked]="dismissible()" (change)="dismissible.set(!dismissible())" /><label class="form-check-label" for="o-dis">dismissible</label></div>
          <div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="o-esc" [checked]="closeOnEscape()" (change)="closeOnEscape.set(!closeOnEscape())" /><label class="form-check-label" for="o-esc">closeOnEscape</label></div>
          <div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="o-icon" [checked]="showCloseIcon()" (change)="showCloseIcon.set(!showCloseIcon())" /><label class="form-check-label" for="o-icon">showCloseIcon</label></div>
          <div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="o-bs" [checked]="blockScroll()" (change)="blockScroll.set(!blockScroll())" /><label class="form-check-label" for="o-bs">blockScroll</label></div>
        </div>
        <button class="btn btn-primary" (click)="opts.set(true)">Open</button>
        <ngb-sidebar
          [(visible)]="opts"
          header="Options"
          [modal]="modal()"
          [dismissible]="dismissible()"
          [closeOnEscape]="closeOnEscape()"
          [showCloseIcon]="showCloseIcon()"
          [blockScroll]="blockScroll()"
          (onShow)="log('onShow')"
          (onHide)="onHide($event)"
        >
          <input class="form-control mb-2" placeholder="Focus is trapped here" />
          <button class="btn btn-secondary" (click)="opts.set(false)">Close programmatically</button>
        </ngb-sidebar>
        <pre class="bg-body-tertiary p-2 mt-2 small">{{ events().join('\\n') || 'events…' }}</pre>
      </section>
    </main>
  `,
})
export class App {
  readonly version = APP_VERSION;
  readonly positions: SidebarPosition[] = ['left', 'right', 'top', 'bottom'];
  readonly menu = [
    { label: 'Dashboard', icon: 'bi bi-speedometer2' },
    { label: 'Orders', icon: 'bi bi-cart' },
    { label: 'Settings', icon: 'bi bi-gear' },
  ];

  basic = signal(false);
  posVisible = signal(false);
  pos = signal<SidebarPosition>('left');
  full = signal(false);
  sized = signal(false);
  tpl = signal(false);
  headless = signal(false);
  opts = signal(false);
  modal = signal(true);
  dismissible = signal(true);
  closeOnEscape = signal(true);
  showCloseIcon = signal(true);
  blockScroll = signal(false);
  events = signal<string[]>([]);

  openPos(p: SidebarPosition) {
    this.pos.set(p);
    this.posVisible.set(true);
  }

  log(msg: string) {
    this.events.update((e) => [...e.slice(-4), msg]);
  }

  onHide(e: SidebarHideEvent) {
    this.log(`onHide (${e.reason})`);
  }
}
