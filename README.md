# @amro93/ngb-sidebar

Composable, accessible Angular **navigation sidebar** — plus an overlay **drawer** — built from Bootstrap 5
classes (`nav-pills`, `offcanvas`, `badge`, utilities) with a small stylesheet only for the collapse mechanics
Bootstrap doesn't have. Standalone, signal-based, no runtime dependencies besides Angular.

- Collapse to an **icon rail**, slide **off canvas**, or never collapse
- **sidebar / floating / inset** variants, **left / right** side, multiple sidebars per layout
- **Overlay**, **open on hover**, **backdrop**, **rail**, **trigger** buttons
- **Responsive** `breakpoint` → mobile off-canvas with backdrop, no media-query code
- Groups (collapsible), menus, **unlimited nested sub menus**, badges, hover actions, tooltips in icon mode
- Data-driven `<ngb-sidebar-nav [model]>` with active tracking, accordion mode and custom item template
- Keyboard shortcut (Ctrl/⌘+B), Escape to dismiss, persisted state (`localStorage`)
- Themed the Bootstrap way: `theme="dark"` (`data-bs-theme`), `panelClass`, `badgeClass`, nav-pill variables
- `<ngb-drawer>`: Bootstrap **offcanvas** from any edge, full screen, templates, focus trap

**Demo & code examples:** https://amro93.github.io/ngb-sidebar/

## Install

```bash
npm install @amro93/ngb-sidebar bootstrap bootstrap-icons
```

```scss
// styles.scss
@use 'bootstrap/scss/bootstrap'; // required: the components use Bootstrap classes
@import 'bootstrap-icons/font/bootstrap-icons.css'; // optional, used in the examples
```

## Quick start

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

## `<ngb-sidebar>` API

| Input              | Type                                 | Default              | Description                                                            |
| ------------------ | ------------------------------------ | -------------------- | ---------------------------------------------------------------------- |
| `id`               | `string`                             | auto                 | Used by `ngbSidebarTrigger[target]`, `aria-controls` and the registry. |
| `open`             | `model<boolean>`                     | `true`               | Two-way expanded state `[(open)]`.                                     |
| `variant`          | `'sidebar' \| 'floating' \| 'inset'` | `'sidebar'`          | Visual style.                                                          |
| `collapsible`      | `'icon' \| 'offcanvas' \| 'none'`    | `'offcanvas'`        | Collapse behaviour.                                                    |
| `side`             | `'left' \| 'right'`                  | `'left'`             | Layout side.                                                           |
| `overlay`          | `boolean`                            | `false`              | Float over the main content instead of pushing it.                     |
| `openOnHover`      | `boolean`                            | `false`              | Expand a collapsed sidebar while hovered / focused.                    |
| `hoverCloseDelay`  | `number` (ms)                        | `150`                | Delay before a hover-opened sidebar collapses.                         |
| `backdrop`         | `boolean`                            | `false`              | Backdrop while open as an overlay.                                     |
| `dismissable`      | `boolean`                            | `true`               | Escape / backdrop click close an overlay sidebar.                      |
| `width`            | `string`                             | `'16rem'`            | Expanded width.                                                        |
| `iconWidth`        | `string`                             | `'3rem'`             | Icon-rail width.                                                       |
| `breakpoint`       | `number \| null`                     | `null`               | Below this px width: off-canvas overlay + backdrop, closed by default. |
| `keyboardShortcut` | `string \| null`                     | `'b'`                | Ctrl/⌘ + key toggles. `null` disables.                                 |
| `stateKey`         | `string \| null`                     | `null`               | Persist `open` in `localStorage`.                                      |
| `ariaLabel`        | `string`                             | `'Sidebar'`          | Label of the `<aside>` landmark.                                       |
| `panelClass`       | `string`                             | `'bg-body-tertiary'` | Bootstrap background/text classes of the panel.                        |
| `theme`            | `'light' \| 'dark' \| null`          | `null`               | Bootstrap color mode for the sidebar only (`data-bs-theme`).           |

Output: `openChange`. Methods (exportAs `ngbSidebar`): `toggle()`, `expand()`, `collapse()`, `dismiss()`.
Signals: `state()`, `expanded()`, `isMobile()`, `iconCollapsed()`.
Inject `NgbSidebarRegistry` to `toggle(id)` / `get(id)` any sidebar from code.

## Building blocks

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

## Theming

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

## `<ngb-drawer>` (overlay panel)

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

## Accessibility

`<aside>` landmark, `role="list"` / `listitem` menus, `aria-current="page"` on active buttons,
`aria-expanded` on collapsible items, groups and triggers, `aria-controls` on triggers, `inert` when
off-canvas, focus-visible rings, `prefers-reduced-motion` respected.

| Key             | Function                                                      |
| --------------- | ------------------------------------------------------------- |
| Tab / Shift+Tab | Move through sidebar items.                                   |
| Enter / Space   | Activate trigger, menu button, collapsible group label, rail. |
| Escape          | Close a dismissable overlay sidebar / the drawer.             |
| Ctrl/⌘ + B      | Toggle the sidebar (`keyboardShortcut`).                      |

## License

MIT

## Development

```bash
npm install
npm start            # demo app on http://localhost:4200
npm test             # library unit tests (vitest)
npm run build:lib    # dist/ngb-sidebar
npm run build:demo   # dist/ngb-sidebar-app
```

Docs: [installation](docs/08-installation-guide.md), [CI/CD](docs/05-cicd-pipeline.md),
[publishing](docs/PUBLISHING-GUIDE.md), [git & StackBlitz](docs/06-git-and-stackblitz.md).

CI (`.github/workflows`): PR checks (prettier, tests, library + demo build), npm publish on `master`
(trusted publishing, skipped when the version is already published) and GitHub Pages demo deploy after a
green CI run. Bump with `npm run version:patch|minor|major` (syncs the library and demo version constants).
