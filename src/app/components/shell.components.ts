import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { NGB_SIDEBAR } from '@amro93/ngb-sidebar';

export interface DemoLink {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="navbar border-bottom sticky-top bg-body shadow-sm py-2">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary" href="#">
          <i class="bi bi-layout-sidebar-inset fs-4"></i>
          <span>ngb-sidebar</span>
          <span class="badge bg-primary-subtle text-primary border border-primary-subtle"
            >v{{ appVersion() }}</span
          >
        </a>
        <div class="d-flex align-items-center gap-2">
          <button
            class="btn btn-outline-secondary btn-sm"
            (click)="themeToggle.emit()"
            [title]="isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <i
              class="bi"
              [class.bi-moon-stars-fill]="!isDarkMode()"
              [class.bi-sun-fill]="isDarkMode()"
            ></i>
          </button>
          <a
            href="https://stackblitz.com/github/amro93/ngb-sidebar"
            target="_blank"
            rel="noopener"
            class="btn btn-outline-primary btn-sm d-none d-sm-inline-flex align-items-center gap-1"
          >
            <i class="bi bi-lightning-charge-fill"></i> StackBlitz
          </a>
          <a
            href="https://github.com/amro93/ngb-sidebar"
            target="_blank"
            rel="noopener"
            class="btn btn-dark btn-sm d-inline-flex align-items-center gap-1"
          >
            <i class="bi bi-github"></i> GitHub
          </a>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  appVersion = input('');
  isDarkMode = input(false);
  themeToggle = output<void>();
}

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [...NGB_SIDEBAR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero-banner p-4 p-md-5 mb-4">
      <div class="row align-items-center g-4">
        <div class="col-md-7 text-center text-md-start">
          <div class="d-flex flex-wrap gap-2 mb-3 justify-content-center justify-content-md-start">
            <span class="badge bg-white text-primary badge-feature"
              ><i class="bi bi-bootstrap-fill me-1"></i> Bootstrap 5 classes</span
            >
            <span class="badge bg-white text-primary badge-feature"
              ><i class="bi bi-diagram-3 me-1"></i> Nested menus</span
            >
            <span class="badge bg-white text-primary badge-feature"
              ><i class="bi bi-code-square me-1"></i> Standalone</span
            >
            <span class="badge bg-white text-primary badge-feature"
              ><i class="bi bi-lightning-fill me-1"></i> Signals</span
            >
          </div>
          <h1 class="display-5 fw-bold mb-3">Angular Sidebar Component</h1>
          <p class="lead opacity-90 mb-4">
            A composable navigation sidebar with icon &amp; off-canvas collapse, floating and inset
            variants, hover-to-open, responsive overlay, unlimited sub-menus and an offcanvas drawer
            — built from
            <strong>Bootstrap 5 classes</strong> (nav pills, offcanvas, badges, utilities). No other
            UI library needed.
          </p>
          <div class="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
            <a href="#examples" class="btn btn-light btn-lg fw-semibold text-primary shadow-sm">
              <i class="bi bi-play-circle-fill me-1"></i> Explore Examples
            </a>
            <a href="#api-reference" class="btn btn-outline-light btn-lg fw-semibold">
              <i class="bi bi-journal-code me-1"></i> API Reference
            </a>
          </div>
        </div>
        <div class="col-md-5 d-none d-md-block">
          <div class="bg-body rounded-4 shadow-lg overflow-hidden text-body" style="height: 18rem">
            <ngb-sidebar-layout [fill]="false" style="height: 100%">
              <ngb-sidebar collapsible="icon" width="11rem" [keyboardShortcut]="null">
                <ngb-sidebar-content class="pt-2">
                  <ngb-sidebar-group>
                    <ngb-sidebar-group-content>
                      <ngb-sidebar-menu>
                        @for (i of heroItems; track i.label) {
                          <ngb-sidebar-menu-item>
                            <button
                              ngbSidebarMenuButton
                              [isActive]="heroActive() === i.label"
                              [tooltip]="i.label"
                              (click)="heroActive.set(i.label)"
                            >
                              <i [class]="i.icon"></i><span>{{ i.label }}</span>
                            </button>
                          </ngb-sidebar-menu-item>
                        }
                      </ngb-sidebar-menu>
                    </ngb-sidebar-group-content>
                  </ngb-sidebar-group>
                </ngb-sidebar-content>
                <button ngbSidebarRail></button>
              </ngb-sidebar>
              <ngb-sidebar-main>
                <div class="demo-topbar">
                  <button class="btn btn-sm btn-light" ngbSidebarTrigger>
                    <i class="bi bi-layout-sidebar"></i>
                  </button>
                  <span class="small fw-semibold">{{ heroActive() }}</span>
                </div>
                <div class="demo-body"><div class="demo-block flex-fill"></div></div>
              </ngb-sidebar-main>
            </ngb-sidebar-layout>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroSectionComponent {
  heroActive = signal('Home');
  heroItems = [
    { icon: 'bi bi-house', label: 'Home' },
    { icon: 'bi bi-inbox', label: 'Inbox' },
    { icon: 'bi bi-bar-chart', label: 'Analytics' },
    { icon: 'bi bi-gear', label: 'Settings' },
  ];
}

@Component({
  selector: 'app-quick-nav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="quick-nav-sidebar sticky-top" style="top: 4.5rem; z-index: 1010">
      <div class="d-lg-none mb-3">
        <button
          class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-between py-2 shadow-sm"
          (click)="collapsed.set(!collapsed())"
          [attr.aria-expanded]="!collapsed()"
        >
          <span class="fw-semibold"
            ><i class="bi bi-list me-2 fs-5"></i>Quick Navigation ({{ links().length }} Demos)</span
          >
          <i
            class="bi"
            [class.bi-chevron-down]="collapsed()"
            [class.bi-chevron-up]="!collapsed()"
          ></i>
        </button>
      </div>
      <div class="card shadow-sm border d-lg-block" [class.d-none]="collapsed()">
        <div
          class="card-header bg-body py-2 px-3 fw-bold text-primary d-flex align-items-center justify-content-between"
        >
          <span><i class="bi bi-compass me-1"></i> Showcase</span>
          <span class="badge bg-primary-subtle text-primary border border-primary-subtle"
            >{{ links().length }} Demos</span
          >
        </div>
        <div class="card-body p-2" style="max-height: calc(100vh - 8rem); overflow-y: auto">
          <nav class="nav flex-column quick-nav-vertical-pills">
            @for (l of links(); track l.id; let i = $index) {
              <a
                class="nav-link py-2 px-3 rounded-2"
                [href]="'#' + l.id"
                (click)="collapsed.set(true)"
              >
                <i [class]="l.icon + ' text-primary me-2'"></i>{{ i + 1 }}. {{ l.label }}
              </a>
            }
            <a
              class="nav-link py-2 px-3 rounded-2"
              href="#api-reference"
              (click)="collapsed.set(true)"
            >
              <i class="bi bi-journal-code text-secondary me-2"></i>API Reference
            </a>
          </nav>
        </div>
      </div>
    </div>
  `,
})
export class QuickNavComponent {
  links = input<DemoLink[]>([]);
  collapsed = signal(true);
}

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="mt-5 text-center text-muted small border-top pt-4">
      <div class="d-flex justify-content-center gap-3 mb-2">
        <a href="https://github.com/amro93/ngb-sidebar" class="text-decoration-none text-muted"
          >GitHub Repository</a
        >
        <span>&bull;</span>
        <a
          href="https://www.npmjs.com/package/@amro93/ngb-sidebar"
          class="text-decoration-none text-muted"
          >npm</a
        >
        <span>&bull;</span>
        <a href="https://github.com/amro93/ngb-select" class="text-decoration-none text-muted"
          >ngb-select</a
        >
        <span>&bull;</span>
        <a href="https://opensource.org/licenses/MIT" class="text-decoration-none text-muted"
          >MIT License</a
        >
      </div>
      <p class="mb-0">
        Designed &amp; built with <strong>Angular Standalone</strong> &amp;
        <strong>Bootstrap 5</strong> &bull; v{{ appVersion() }}
      </p>
    </footer>
  `,
})
export class FooterComponent {
  appVersion = input('');
}
