# Ngb-Sidebar (Angular Bootstrap Sidebar Component)

[![NPM Version](https://img.shields.io/npm/v/@amro93/ngb-sidebar.svg?logo=npm)](https://www.npmjs.com/package/@amro93/ngb-sidebar)
[![NPM Downloads](https://img.shields.io/npm/dm/@amro93/ngb-sidebar.svg?label=downloads%2Fmonth)](https://npm-stat.com/charts.html?package=%40amro93%2Fngb-sidebar)
[![Total Downloads](https://img.shields.io/npm/dt/@amro93/ngb-sidebar.svg?label=total%20downloads)](https://npm-stat.com/charts.html?package=%40amro93%2Fngb-sidebar)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@amro93/ngb-sidebar?label=min%2Bgzip)](https://bundlephobia.com/package/@amro93/ngb-sidebar)
[![CI & Publish](https://github.com/amro93/ngb-sidebar/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/amro93/ngb-sidebar/actions/workflows/npm-publish.yml)
[![Demo](https://github.com/amro93/ngb-sidebar/actions/workflows/deploy.yml/badge.svg)](https://amro93.github.io/ngb-sidebar/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/amro93/ngb-sidebar/blob/master/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/amro93/ngb-sidebar?style=social)](https://github.com/amro93/ngb-sidebar)

**[🌐 Live Demo](https://amro93.github.io/ngb-sidebar/)** · **[⚡ StackBlitz](https://stackblitz.com/github/amro93/ngb-sidebar)** · **[📦 npm](https://www.npmjs.com/package/@amro93/ngb-sidebar)** ·
**[🐙 GitHub](https://github.com/amro93/ngb-sidebar)** · **[📖 Docs](https://github.com/amro93/ngb-sidebar/tree/master/docs)** · **[📈 npm stats](https://npm-stat.com/charts.html?package=%40amro93%2Fngb-sidebar)**

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/amro93/ngb-sidebar)

A composable, accessible Angular **navigation sidebar** — plus an overlay **drawer** — built from
**Bootstrap 5 classes** (`nav-pills`, `offcanvas`, `badge`, utilities), with a small stylesheet only for the
collapse mechanics Bootstrap doesn't have. It covers the features of the PrimeNG Sidebar, optimized for
standard Bootstrap environments. Standalone, signal-based, no runtime dependencies besides Angular.

## 🚀 Features at a Glance

- 📦 **Standalone & Signals** - Angular 20+, `NGB_SIDEBAR` imports array or `NgbSidebarModule`, `model()` two-way state.
- 🎨 **Bootstrap 5 classes** - `nav-pills`, `badge`, `btn`, `offcanvas`, utilities; dark mode via `data-bs-theme`.
- ↔️ **Collapse modes** - shrink to an **icon rail**, slide **off canvas**, or never collapse.
- 🧩 **Variants & layouts** - `sidebar`, `floating`, `inset`; left / right; several sidebars per layout.
- 🖱️ **Overlay, open-on-hover, backdrop, rail & trigger** buttons.
- 📱 **Adaptive mobile behavior** - `breakpoint` + configurable `mobile` settings (off-canvas, backdrop, close on navigate, side, width), app-wide with `provideNgbSidebarConfig()`.
- 🗂️ **Menus & unlimited sub-menus** - collapsible groups, badges, hover actions, tooltips in icon mode.
- 🧠 **Data-driven menu** - `<ngb-sidebar-nav [model]>` with active tracking, accordion mode and custom item template.
- 👆 **Touch swipe** - swipe in from the edge to open, swipe back to close; the panel follows the finger (`swipe`, `swipeEdge`, `swipeThreshold`).
- ⌨️ **Keyboard** - Ctrl/⌘+B toggle, Escape to dismiss, focus management; persisted state (`localStorage`).
- 🌍 **RTL** - mirrors under `dir="rtl"` with Bootstrap's RTL stylesheet (`side="left"` = start edge).
- ♿ **Accessible** - landmarks, list roles, `aria-current`, `aria-expanded`, `aria-controls`, `inert`.
- 🪟 **`<ngb-drawer>`** - Bootstrap offcanvas from any edge, full screen, templates, focus trap.

## 🧪 Live Preview & Sandbox

- [View the GitHub Pages live demo](https://amro93.github.io/ngb-sidebar/) — 12 examples, each with HTML / TS code tabs
- [Play with it on StackBlitz](https://stackblitz.com/github/amro93/ngb-sidebar)
- [Package on npm](https://www.npmjs.com/package/@amro93/ngb-sidebar) · [download stats](https://npm-stat.com/charts.html?package=%40amro93%2Fngb-sidebar)

## 📦 Installation

```bash
npm install @amro93/ngb-sidebar bootstrap bootstrap-icons
```

```scss
// styles.scss
@use 'bootstrap/scss/bootstrap'; // required: the components use Bootstrap classes
@import 'bootstrap-icons/font/bootstrap-icons.css'; // optional, used in the examples
```

## 💻 Usage

```ts
import { Component } from '@angular/core';
import { NGB_SIDEBAR } from '@amro93/ngb-sidebar';

@Component({
  selector: 'app-shell',
  imports: [...NGB_SIDEBAR], // or NgbSidebarModule
  templateUrl: './shell.html',
})
export class Shell {}
```

```html
<ngb-sidebar-layout>
  <ngb-sidebar id="main" collapsible="icon">
    <ngb-sidebar-header>…logo / workspace switcher…</ngb-sidebar-header>

    <ngb-sidebar-content>
      <ngb-sidebar-group>
        <ngb-sidebar-group-label>Navigation</ngb-sidebar-group-label>
        <ngb-sidebar-group-content>
          <ngb-sidebar-menu>
            <ngb-sidebar-menu-item>
              <a ngbSidebarMenuButton href="/home" isActive tooltip="Home">
                <i class="bi bi-house"></i><span>Home</span>
              </a>
              <ngb-sidebar-menu-badge>12</ngb-sidebar-menu-badge>
            </ngb-sidebar-menu-item>

            <ngb-sidebar-menu-item collapsible defaultOpen>
              <button ngbSidebarMenuButton tooltip="Analytics">
                <i class="bi bi-bar-chart"></i><span>Analytics</span>
                <i class="bi bi-chevron-down ngb-sidebar-rotate"></i>
              </button>
              <ngb-sidebar-menu-sub>
                <ngb-sidebar-menu-sub-item>
                  <button ngbSidebarMenuSubButton isActive>Overview</button>
                </ngb-sidebar-menu-sub-item>
              </ngb-sidebar-menu-sub>
            </ngb-sidebar-menu-item>
          </ngb-sidebar-menu>
        </ngb-sidebar-group-content>
      </ngb-sidebar-group>
    </ngb-sidebar-content>

    <ngb-sidebar-footer>…user menu…</ngb-sidebar-footer>
    <button ngbSidebarRail></button>
  </ngb-sidebar>

  <ngb-sidebar-main>
    <button class="btn btn-light" ngbSidebarTrigger target="main">
      <i class="bi bi-layout-sidebar"></i>
    </button>
    <!-- page content / <router-outlet /> -->
  </ngb-sidebar-main>
</ngb-sidebar-layout>
```

> In icon mode a menu button keeps only its **first child** visible (icon, logo or avatar) and shows its
> `tooltip` as `title`. Add `.ngb-sidebar-hide-collapsed` to any element to hide it while collapsed.

### Mobile behavior (adaptive UI)

Below `breakpoint` the sidebar switches to its **mobile settings**. Defaults: off-canvas overlay with a
backdrop, closed when entering mobile view, closing after a menu item is clicked, `18rem` wide.

```html
<ngb-sidebar
  collapsible="icon"
  [breakpoint]="992"
  [mobile]="{ side: 'right', width: '85%', closeOnNavigate: true }"
></ngb-sidebar>
```

| Mobile option     | Default       | Description                                                       |
| ----------------- | ------------- | ----------------------------------------------------------------- |
| `collapsible`     | `'offcanvas'` | Collapse mode on mobile.                                          |
| `overlay`         | `true`        | Float over the content instead of pushing it.                     |
| `backdrop`        | `true`        | Backdrop while open.                                              |
| `defaultOpen`     | `false`       | Open state when entering mobile view (desktop state is restored). |
| `closeOnNavigate` | `true`        | Collapse after a non-collapsible menu button is clicked.          |
| `openOnHover`     | `false`       | Hover-to-open (touch screens have no hover).                      |
| `side`            | `null`        | Side override (`null` = desktop side).                            |
| `variant`         | `'sidebar'`   | Variant override (`null` = desktop variant).                      |
| `width`           | `'18rem'`     | Width override, e.g. `'85%'` (`null` = desktop width).            |

Menu buttons with `keepOpen`, `data-bs-toggle` or `aria-haspopup` never close the sidebar.

Set app-wide defaults once:

```ts
import { provideNgbSidebarConfig } from '@amro93/ngb-sidebar';

bootstrapApplication(App, {
  providers: [provideNgbSidebarConfig({ breakpoint: 768, mobile: { width: '80%' } })],
});
```

Precedence: built-in defaults < `provideNgbSidebarConfig` < the `[mobile]` / `[breakpoint]` inputs.

### Touch swipe to show / hide

On touch screens, swipe in from the sidebar's edge to open it (or swipe on a collapsed icon rail), and
swipe the open panel back toward its edge to close it. The off-canvas panel follows the finger and snaps
open or closed by distance or flick speed. Vertical scrolling and mouse input are never affected.

```html
<ngb-sidebar [swipe]="true" [swipeEdge]="32" [swipeThreshold]="0.25">…</ngb-sidebar>
```

| Property         | Default | Description                                                         |
| ---------------- | ------- | ------------------------------------------------------------------- |
| `swipe`          | `true`  | Enable touch swipe gestures.                                        |
| `swipeEdge`      | `24`    | Width (px) of the edge zone where an opening swipe can start.       |
| `swipeThreshold` | `0.3`   | Fraction of the panel width a swipe must travel (flicks also work). |

App-wide: `provideNgbSidebarConfig({ swipe: true, swipeEdge: 32, swipeThreshold: 0.25 })`.

### Data-driven menu (nested hierarchy)

```ts
import { NgbSidebarMenuItem } from '@amro93/ngb-sidebar';

menu: NgbSidebarMenuItem[] = [
  { group: true, label: 'Platform', items: [
    { label: 'Dashboard', icon: 'bi bi-speedometer2', active: true },
    { label: 'Inbox', icon: 'bi bi-inbox', badge: 24, badgeClass: 'text-bg-primary' },
    { label: 'Playground', icon: 'bi bi-terminal', items: [
      { label: 'History' },
      { label: 'Settings', items: [{ label: 'General' }, { label: 'Advanced' }] },
    ] },
  ] },
  { separator: true },
  { group: true, label: 'Projects', items: [
    { label: 'Travel', icon: 'bi bi-map', actionIcon: 'bi bi-three-dots' },
    { label: 'Docs', icon: 'bi bi-book', url: 'https://…', target: '_blank' },
    { label: 'Say hi', icon: 'bi bi-emoji-smile', command: (e) => console.log(e.item) },
  ] },
];
```

```html
<ngb-sidebar-content>
  <ngb-sidebar-nav
    [model]="menu"
    [(activeItem)]="active"
    accordion
    collapsibleGroups
    (itemClick)="go($event.item)"
    (actionClick)="more($event.item)"
  >
    <!-- optional custom content per item -->
    <ng-template ngbSidebarNavItem let-item let-hasChildren="hasChildren">
      <i [class]="item.icon"></i><span>{{ item.label }}</span> @if (hasChildren) {
      <i class="ngb-sidebar-chevron"></i> }
    </ng-template>
  </ngb-sidebar-nav>
</ngb-sidebar-content>
```

> Using Angular Router? Use the template API with `<a ngbSidebarMenuButton routerLink="/x"
routerLinkActive #rla="routerLinkActive" [isActive]="rla.isActive">`, or call `router.navigate` from
> `(itemClick)`.

### RTL (Right-to-Left) & Arabic

The sidebar uses CSS logical properties, and every directional class it renders is a Bootstrap utility, so
it mirrors itself with Bootstrap's official RTL build. `side="left"` means the **start** edge (right in RTL),
like Bootstrap's `offcanvas-start`.

```html
<!-- index.html -->
<html dir="rtl" lang="ar"></html>
```

```json
"styles": ["node_modules/bootstrap/dist/css/bootstrap.rtl.min.css", "src/styles.scss"]
```

```html
<ngb-sidebar collapsible="icon" ariaLabel="القائمة الرئيسية">
  <ngb-sidebar-content>
    <ngb-sidebar-nav [model]="[{ label: 'الرئيسية', icon: 'bi bi-house', active: true }]" />
  </ngb-sidebar-content>
</ngb-sidebar>
```

## ⚙️ `<ngb-sidebar>` API

| Input              | Type                                 | Default              | Description                                                               |
| ------------------ | ------------------------------------ | -------------------- | ------------------------------------------------------------------------- |
| `id`               | `string`                             | auto                 | Used by `ngbSidebarTrigger[target]`, `aria-controls` and the registry.    |
| `open`             | `model<boolean>`                     | `true`               | Two-way expanded state `[(open)]`.                                        |
| `variant`          | `'sidebar' \| 'floating' \| 'inset'` | `'sidebar'`          | Visual style.                                                             |
| `collapsible`      | `'icon' \| 'offcanvas' \| 'none'`    | `'offcanvas'`        | Collapse behaviour.                                                       |
| `side`             | `'left' \| 'right'`                  | `'left'`             | Layout side.                                                              |
| `overlay`          | `boolean`                            | `false`              | Float over the main content instead of pushing it.                        |
| `openOnHover`      | `boolean`                            | `false`              | Expand a collapsed sidebar while hovered / focused.                       |
| `hoverCloseDelay`  | `number` (ms)                        | `150`                | Delay before a hover-opened sidebar collapses.                            |
| `backdrop`         | `boolean`                            | `false`              | Backdrop while open as an overlay.                                        |
| `dismissable`      | `boolean`                            | `true`               | Escape / backdrop click close an overlay sidebar.                         |
| `width`            | `string`                             | `'16rem'`            | Expanded width.                                                           |
| `iconWidth`        | `string`                             | `'3rem'`             | Icon-rail width.                                                          |
| `breakpoint`       | `number \| null`                     | `null`               | Below this px width the `mobile` settings apply (app default via config). |
| `mobile`           | `Partial<NgbSidebarMobileOptions>`   | `{}`                 | Mobile behavior, see below.                                               |
| `swipe`            | `boolean`                            | `true`               | Touch swipe to show/hide (edge swipe opens, swipe back closes).           |
| `swipeEdge`        | `number` (px)                        | `24`                 | Edge zone where an opening swipe can start.                               |
| `swipeThreshold`   | `number` (0–1)                       | `0.3`                | Fraction of the width a swipe must travel to toggle.                      |
| `keyboardShortcut` | `string \| null`                     | `'b'`                | Ctrl/⌘ + key toggles. `null` disables.                                    |
| `stateKey`         | `string \| null`                     | `null`               | Persist `open` in `localStorage`.                                         |
| `ariaLabel`        | `string`                             | `'Sidebar'`          | Label of the `<aside>` landmark.                                          |
| `panelClass`       | `string`                             | `'bg-body-tertiary'` | Bootstrap background/text classes of the panel.                           |
| `theme`            | `'light' \| 'dark' \| null`          | `null`               | Bootstrap color mode for the sidebar only (`data-bs-theme`).              |

Output: `openChange`. Methods (exportAs `ngbSidebar`): `toggle()`, `expand()`, `collapse()`, `dismiss()`.
Signals: `state()`, `expanded()`, `isMobile()`, `iconCollapsed()`.
Inject `NgbSidebarRegistry` to `toggle(id)` / `get(id)` any sidebar from code.

## 🧱 Building blocks

| Selector                                               | Notes                                                                |
| ------------------------------------------------------ | -------------------------------------------------------------------- |
| `ngb-sidebar-layout`                                   | Flex root. `[fill]` (default `true`) = `min-height: 100vh`.          |
| `ngb-sidebar-main`                                     | Main area; becomes a card with the `inset` variant.                  |
| `ngb-sidebar-backdrop`                                 | Optional explicit backdrop for overlay sidebars.                     |
| `ngb-sidebar-header` / `-content` / `-footer`          | Pinned top, scrollable middle, pinned bottom.                        |
| `ngb-sidebar-group` (+ `-label`, `-content`)           | Section; `collapsible` + `[(open)]` folds it via the label.          |
| `[ngbSidebarGroupAction]`                              | Button next to a group label.                                        |
| `ngb-sidebar-menu` / `ngb-sidebar-menu-sub`            | Lists.                                                               |
| `ngb-sidebar-menu-item` / `-menu-sub-item`             | `collapsible`, `defaultOpen`, `[(open)]` — nest to any depth.        |
| `[ngbSidebarMenuButton]` / `[ngbSidebarMenuSubButton]` | `isActive`, `tooltip`, `size` (`sm`/`md`/`lg`).                      |
| `ngb-sidebar-menu-badge`                               | Bootstrap `badge`; `badgeClass` sets colors (e.g. `text-bg-danger`). |
| `[ngbSidebarMenuAction]`                               | Secondary button, `showOnHover`.                                     |
| `ngb-sidebar-separator`                                | Divider.                                                             |
| `[ngbSidebarTrigger]`                                  | `target` id, else first sidebar of the layout.                       |
| `[ngbSidebarRail]`                                     | Edge strip that toggles.                                             |
| `ngb-sidebar-nav`                                      | Data-driven menu (see above).                                        |

`ngb-sidebar-nav`: `model`, `[(activeItem)]`, `accordion`, `autoExpandActive` (true), `selectOnClick` (true),
`collapsibleGroups`, `ariaLabel`; outputs `itemClick`, `actionClick`, `expandedChange`;
methods `expandAll()`, `collapseAll()`; template `ngbSidebarNavItem` (context: item, depth, active, expanded,
hasChildren).

`NgbSidebarMenuItem`: `id, label, icon, badge, badgeClass, url, target, command, items, expanded, active,
disabled, visible, separator, group, tooltip, styleClass, actionIcon, actionLabel, actionOnHover, data`.

## 🎨 Theming

Everything visual is a Bootstrap class or variable, so theme it the Bootstrap way:

```html
<!-- Bootstrap 5.3 color mode for the sidebar only -->
<ngb-sidebar theme="dark">…</ngb-sidebar>

<!-- Any Bootstrap background utility for the panel (default: bg-body-tertiary) -->
<ngb-sidebar panelClass="bg-primary-subtle">…</ngb-sidebar>

<!-- Badge colors -->
<ngb-sidebar-menu-badge badgeClass="text-bg-danger">3</ngb-sidebar-menu-badge>
```

Active items are Bootstrap **nav pills** — recolor them with Bootstrap's own variables:

```css
.my-sidebar .nav-pills {
  --bs-nav-pills-link-active-bg: #4f46e5;
  --bs-nav-pills-link-active-color: #fff;
}
```

Sidebar-specific variables: `--ngb-sidebar-width`, `--ngb-sidebar-width-icon` (set via the `width` /
`iconWidth` inputs), `--ngb-sidebar-transition` and `--ngb-sidebar-z`.

### What is Bootstrap and what is custom

Built from Bootstrap classes: `nav nav-pills` / `nav-link` / `.active` menus, `badge`, `btn` / `btn-link`
actions, `btn-close`, `offcanvas` + `offcanvas-backdrop` (drawer and sidebar backdrop), borders, rounded
corners, shadows, `bg-*`, `text-*` and flex/spacing utilities. The drawer has **no custom CSS** at all.

The sidebar ships one small stylesheet only for what Bootstrap has no equivalent for: the collapse mechanics
(width reservation, icon rail, off-canvas slide, sticky panel), the rail strip, the CSS chevron, hover-only
actions and a hover background for nav links.

## 🪟 `<ngb-drawer>` (Bootstrap offcanvas)

```ts
import { NgbDrawerComponent, NGB_DRAWER_TEMPLATES } from '@amro93/ngb-sidebar';
```

```html
<ngb-drawer
  [(visible)]="open"
  position="right"
  header="Settings"
  size="24rem"
  blockScroll
  (onHide)="log($event.reason)"
>
  Content
  <ng-template ngbDrawerFooter let-close>
    <button class="btn btn-primary" (click)="close()">Save</button>
  </ng-template>
</ngb-drawer>
```

| Input                                           | Default         | Description                                       |
| ----------------------------------------------- | --------------- | ------------------------------------------------- |
| `visible` (model)                               | `false`         | Two-way visibility.                               |
| `position`                                      | `'left'`        | `left \| right \| top \| bottom \| full`.         |
| `fullScreen`, `header`, `size`                  | –               | Full viewport, title, width/height.               |
| `style`, `styleClass`, `maskStyleClass`         | –               | Styling.                                          |
| `appendTo`                                      | `'body'`        | `'body' \| 'self' \| HTMLElement`.                |
| `modal`, `dismissible`, `closable`              | `true`          | Mask, close on mask click, allow closing.         |
| `showCloseIcon`, `closeIcon`                    | `true`, `''`    | Close button / icon class (empty = `.btn-close`). |
| `closeOnEscape`, `blockScroll`                  | `true`, `false` | Keyboard / body scroll.                           |
| `autoZIndex`, `baseZIndex`                      | `true`, `0`     | Layering.                                         |
| `focusTrap`, `restoreFocus`                     | `true`          | Focus management.                                 |
| `transitionDuration`                            | `300`           | ms, `0` disables animation.                       |
| `ariaLabel`, `ariaLabelledBy`, `ariaCloseLabel` | –               | Accessibility.                                    |

Outputs: `onShow`, `onHide({ reason: 'close-button' | 'escape' | 'mask' | 'programmatic' })`.
Methods: `open()`, `close()`, `toggle()`. Templates: `ngbDrawerHeader`, `ngbDrawerContent`, `ngbDrawerFooter`,
`ngbDrawerCloseIcon`, `ngbDrawerHeadless` (context `let-close`).

## ♿ Accessibility

`<aside>` landmark, `role="list"` / `listitem` menus, `aria-current="page"` on active buttons,
`aria-expanded` on collapsible items, groups and triggers, `aria-controls` on triggers, `inert` when
off-canvas, focus-visible rings, `prefers-reduced-motion` respected.

| Key             | Function                                                      |
| --------------- | ------------------------------------------------------------- |
| Tab / Shift+Tab | Move through sidebar items.                                   |
| Enter / Space   | Activate trigger, menu button, collapsible group label, rail. |
| Escape          | Close a dismissable overlay sidebar / the drawer.             |
| Ctrl/⌘ + B      | Toggle the sidebar (`keyboardShortcut`).                      |

## 📖 Deep-Dive Documentation

- [Installation Guide](https://github.com/amro93/ngb-sidebar/blob/master/docs/08-installation-guide.md)
- [CI/CD Pipeline](https://github.com/amro93/ngb-sidebar/blob/master/docs/05-cicd-pipeline.md)
- [Publishing Guide](https://github.com/amro93/ngb-sidebar/blob/master/docs/PUBLISHING-GUIDE.md)
- [Git Conventions & StackBlitz](https://github.com/amro93/ngb-sidebar/blob/master/docs/06-git-and-stackblitz.md)

## 🤝 Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Follow the **Conventional Commits** standard for your commit messages.
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Ensure all GitHub Actions checks (formatting, tests, library and demo build) pass before requesting a review.
Issues and ideas: [https://github.com/amro93/ngb-sidebar/issues](https://github.com/amro93/ngb-sidebar/issues).

## 🛠️ Development

```bash
npm install
npm start            # demo app on http://localhost:4200
npm test             # library unit tests (vitest)
npm run build:lib    # dist/ngb-sidebar
npm run build:demo   # dist/ngb-sidebar-app
```

CI (`.github/workflows`): PR checks (prettier, tests, library + demo build), npm publish on `master`
(trusted publishing, skipped when the version is already published) and GitHub Pages demo deploy after a
green CI run. Bump with `npm run version:patch|minor|major` (syncs the library and demo version constants).

## 📄 License

Distributed under the MIT License. See [`LICENSE`](https://github.com/amro93/ngb-sidebar/blob/master/LICENSE) for more information.
