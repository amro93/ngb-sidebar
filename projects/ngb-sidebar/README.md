# @amro93/ngb-sidebar

Lightweight, accessible, standalone Angular **Sidebar / Drawer** component styled with pure Bootstrap 5. Signal-based API, no extra runtime dependencies.

## Install

```bash
npm install @amro93/ngb-sidebar bootstrap
```

## Usage

```ts
import { NgbSidebarComponent } from '@amro93/ngb-sidebar';

@Component({
  imports: [NgbSidebarComponent],
  template: `
    <button class="btn btn-primary" (click)="visible.set(true)">Open</button>
    <ngb-sidebar [(visible)]="visible" position="right" header="Settings">
      Content
    </ngb-sidebar>
  `,
})
export class Demo {
  visible = signal(false);
}
```

## Inputs

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` (model) | `false` | Two-way visibility `[(visible)]`. |
| `position` | `'left' \| 'right' \| 'top' \| 'bottom' \| 'full'` | `'left'` | Edge to slide in from. |
| `fullScreen` | `boolean` | `false` | Cover the whole viewport. |
| `header` | `string` | – | Header title text. |
| `size` | `string` | – | Width (left/right) or height (top/bottom). |
| `style` / `styleClass` | object / string | – | Inline style / class for the panel. |
| `maskStyleClass` | `string` | `''` | Class for the backdrop mask. |
| `appendTo` | `'body' \| 'self' \| HTMLElement` | `'body'` | Where the panel DOM is attached. |
| `modal` | `boolean` | `true` | Show a backdrop mask and trap focus. |
| `dismissible` | `boolean` | `true` | Close on mask click. |
| `closable` | `boolean` | `true` | Allow closing via button / Escape. |
| `showCloseIcon` | `boolean` | `true` | Render the close button. |
| `closeIcon` | `string` | `''` | Icon class (e.g. `bi bi-x-lg`); empty uses `.btn-close`. |
| `closeOnEscape` | `boolean` | `true` | Close on Escape (top-most sidebar only). |
| `blockScroll` | `boolean` | `false` | Lock body scroll while open. |
| `autoZIndex` / `baseZIndex` | `boolean` / `number` | `true` / `0` | Layering management. |
| `focusTrap` / `restoreFocus` | `boolean` | `true` | Focus management. |
| `transitionDuration` | `number` (ms) | `300` | Animation duration; `0` disables. |
| `ariaLabel` / `ariaLabelledBy` / `ariaCloseLabel` | `string` | – / – / `'Close'` | Accessibility labels. |

## Outputs

| Output | Payload | Description |
| --- | --- | --- |
| `visibleChange` | `boolean` | Two-way binding change. |
| `onShow` | `void` | Emitted when shown. |
| `onHide` | `{ reason: 'close-button' \| 'escape' \| 'mask' \| 'programmatic' }` | Emitted after the hide animation. |

## Methods

`open()`, `close()`, `toggle()` – usable via a template reference (`#sb`).

## Templates

All templates receive `close` as both `$implicit` and `close` in their context.

| Directive | Purpose |
| --- | --- |
| `ng-template ngbSidebarHeader` | Custom header. |
| `ng-template ngbSidebarContent` | Content (alternative to projected content). |
| `ng-template ngbSidebarFooter` | Footer area. |
| `ng-template ngbSidebarCloseIcon` | Custom close icon. |
| `ng-template ngbSidebarHeadless` | Replace the whole panel body. |

```html
<ngb-sidebar [(visible)]="open">
  <ng-template ngbSidebarFooter let-close>
    <button class="btn btn-primary" (click)="close()">Save</button>
  </ng-template>
</ngb-sidebar>
```

## Accessibility

`role="dialog"`, `aria-modal`, header-linked `aria-labelledby`, focus moved into the panel on show, Tab trapped while modal, focus restored on hide, Escape support and `prefers-reduced-motion` respected.

## License

MIT
