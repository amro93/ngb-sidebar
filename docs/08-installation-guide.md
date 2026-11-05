# Installation Guide

How to install and configure `@amro93/ngb-sidebar` in an Angular application.

## Prerequisites

- **Angular 20 or higher** (standalone components and signal APIs).
- **Bootstrap 5.3 CSS** — the components are built from Bootstrap classes (`nav-pills`, `offcanvas`,
  `badge`, utilities). Bootstrap's JavaScript is **not** required.
- Optional: **Bootstrap Icons** (used in the examples; any icon font or SVG works).

## 1. Install the Package

```bash
npm install @amro93/ngb-sidebar bootstrap bootstrap-icons
```

## 2. Configure Styles

### Option A: `src/styles.scss` (recommended)

```scss
@use 'bootstrap/scss/bootstrap';
@import 'bootstrap-icons/font/bootstrap-icons.css';
```

### Option B: `angular.json`

```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "node_modules/bootstrap-icons/font/bootstrap-icons.css",
  "src/styles.scss"
]
```

The sidebar's own small stylesheet (collapse mechanics) ships inside the component — nothing else to add.

## 3. Import the Components

Everything is standalone. Spread `NGB_SIDEBAR` into `imports` (or use `NgbSidebarModule`):

```typescript
import { Component } from '@angular/core';
import { NGB_SIDEBAR } from '@amro93/ngb-sidebar';

@Component({
  selector: 'app-shell',
  imports: [...NGB_SIDEBAR],
  template: `
    <ngb-sidebar-layout>
      <ngb-sidebar id="main" collapsible="icon">
        <ngb-sidebar-content>
          <ngb-sidebar-group>
            <ngb-sidebar-group-label>Navigation</ngb-sidebar-group-label>
            <ngb-sidebar-group-content>
              <ngb-sidebar-menu>
                <ngb-sidebar-menu-item>
                  <a ngbSidebarMenuButton href="/" isActive tooltip="Home">
                    <i class="bi bi-house"></i><span>Home</span>
                  </a>
                </ngb-sidebar-menu-item>
              </ngb-sidebar-menu>
            </ngb-sidebar-group-content>
          </ngb-sidebar-group>
        </ngb-sidebar-content>
        <button ngbSidebarRail></button>
      </ngb-sidebar>

      <ngb-sidebar-main>
        <button class="btn btn-light" ngbSidebarTrigger target="main">
          <i class="bi bi-layout-sidebar"></i>
        </button>
        <router-outlet />
      </ngb-sidebar-main>
    </ngb-sidebar-layout>
  `,
})
export class Shell {}
```

### Overlay drawer only

```typescript
import { NgbDrawerComponent, NGB_DRAWER_TEMPLATES } from '@amro93/ngb-sidebar';

@Component({
  imports: [NgbDrawerComponent, ...NGB_DRAWER_TEMPLATES],
  template: `
    <button class="btn btn-primary" (click)="open.set(true)">Open</button>
    <ngb-drawer [(visible)]="open" position="right" header="Settings">…</ngb-drawer>
  `,
})
export class Settings {
  open = signal(false);
}
```

### NgModule-based apps

```typescript
import { NgbSidebarModule } from '@amro93/ngb-sidebar';

@NgModule({ imports: [NgbSidebarModule] })
export class AppModule {}
```

## 4. Next Steps

- Full API and theming: [README](../README.md).
- Live examples with code: https://amro93.github.io/ngb-sidebar/
