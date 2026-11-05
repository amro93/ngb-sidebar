import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

interface Row {
  name: string;
  type: string;
  def?: string;
  desc: string;
}

type Tab = 'sidebar' | 'parts' | 'nav' | 'model' | 'css' | 'drawer' | 'a11y';

@Component({
  selector: 'app-api-reference',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mt-4 pt-4 border-top">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 class="fw-bold text-primary mb-1">
            <i class="bi bi-journal-code me-2"></i>API Reference
          </h2>
          <p class="text-muted small mb-0">
            Inputs, outputs, building blocks, menu model, theming and accessibility.
          </p>
        </div>
        <span class="badge bg-light text-dark border">Version: v{{ appVersion() }}</span>
      </div>

      <div class="card border shadow-sm">
        <div class="card-header bg-body p-0">
          <ul class="nav api-nav-tabs flex-nowrap overflow-auto" role="tablist">
            @for (t of tabs; track t.id) {
              <li class="nav-item">
                <button
                  class="nav-link text-nowrap"
                  role="tab"
                  [attr.aria-selected]="tab() === t.id"
                  [class.active]="tab() === t.id"
                  (click)="tab.set(t.id)"
                >
                  <i [class]="t.icon + ' me-1'"></i>{{ t.label }}
                </button>
              </li>
            }
          </ul>
        </div>
        <div class="card-body p-0">
          @switch (tab()) {
            @case ('sidebar') {
              <div class="p-3 small text-body-secondary">
                <code>&lt;ngb-sidebar&gt;</code> — exportAs <code>ngbSidebar</code>. Methods:
                <code>toggle()</code>, <code>expand()</code>, <code>collapse()</code>,
                <code>dismiss()</code>. Readable signals: <code>state()</code>,
                <code>expanded()</code>, <code>isMobile()</code>, <code>iconCollapsed()</code>.
                Static <code>NgbSidebarComponent.VERSION</code>.
              </div>
              <ng-container *ngTemplateOutlet="table; context: { $implicit: sidebarInputs }" />
              <div class="px-3 pb-3 small">
                <strong>Outputs:</strong> <code>openChange: boolean</code> (two-way
                <code>[(open)]</code>).
                <br />
                <strong>Registry:</strong> inject <code>NgbSidebarRegistry</code> and call
                <code>toggle(id)</code> / <code>get(id)</code> to control any sidebar from code.
              </div>
            }
            @case ('parts') {
              <ng-container *ngTemplateOutlet="table; context: { $implicit: parts }" />
            }
            @case ('nav') {
              <div class="p-3 small text-body-secondary">
                <code>&lt;ngb-sidebar-nav [model]="items"&gt;</code> renders groups, separators and
                an unlimited hierarchy of items. Methods: <code>expandAll()</code>,
                <code>collapseAll()</code>.
              </div>
              <ng-container *ngTemplateOutlet="table; context: { $implicit: navApi }" />
            }
            @case ('model') {
              <ng-container *ngTemplateOutlet="table; context: { $implicit: menuItem }" />
            }
            @case ('css') {
              <div class="p-3 small text-body-secondary">
                Set these on <code>ngb-sidebar-layout</code> (or any ancestor / <code>:root</code>).
                Defaults use Bootstrap 5.3 tokens, so dark mode (<code>data-bs-theme="dark"</code>)
                works out of the box. The <code>.ngb-sidebar-hide-collapsed</code> class hides any
                element while collapsed to icons, <code>.ngb-sidebar-rotate</code> rotates a custom
                chevron when its item opens.
              </div>
              <ng-container *ngTemplateOutlet="table; context: { $implicit: cssVars }" />
            }
            @case ('drawer') {
              <div class="p-3 small text-body-secondary">
                <code>&lt;ngb-drawer&gt;</code> — overlay panel (PrimeNG's former Sidebar, now
                Drawer). Methods: <code>open()</code>, <code>close()</code>, <code>toggle()</code>.
                Templates: <code>ngbDrawerHeader</code>, <code>ngbDrawerContent</code>,
                <code>ngbDrawerFooter</code>, <code>ngbDrawerCloseIcon</code>,
                <code>ngbDrawerHeadless</code> (context: <code>let-close</code>).
              </div>
              <ng-container *ngTemplateOutlet="table; context: { $implicit: drawerApi }" />
            }
            @case ('a11y') {
              <div class="p-3 small">
                <p>
                  The sidebar renders an <code>&lt;aside&gt;</code> landmark labelled by
                  <code>ariaLabel</code>. Menus are <code>role="list"</code> with
                  <code>role="listitem"</code> entries; active buttons get
                  <code>aria-current="page"</code>, collapsible items <code>aria-expanded</code>.
                  <code>ngbSidebarTrigger</code> exposes <code>aria-controls</code> /
                  <code>aria-expanded</code>. A collapsed off-canvas sidebar is <code>inert</code>,
                  so it can't be tabbed into. Icon-mode buttons show their <code>tooltip</code> as
                  <code>title</code>.
                </p>
              </div>
              <ng-container *ngTemplateOutlet="table; context: { $implicit: keys }" />
            }
          }
        </div>
      </div>
    </section>

    <ng-template #table let-rows>
      <div class="table-responsive">
        <table class="table table-hover table-api mb-0 align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            @for (r of rows; track r.name) {
              <tr>
                <td>
                  <code>{{ r.name }}</code>
                </td>
                <td class="text-nowrap small">{{ r.type }}</td>
                <td class="small">{{ r.def ?? '—' }}</td>
                <td class="small">{{ r.desc }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </ng-template>
  `,
  imports: [NgTemplateOutlet],
})
export class ApiReferenceComponent {
  appVersion = input('');
  tab = signal<Tab>('sidebar');

  tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'sidebar', label: 'ngb-sidebar', icon: 'bi bi-layout-sidebar' },
    { id: 'parts', label: 'Building blocks', icon: 'bi bi-boxes' },
    { id: 'nav', label: 'ngb-sidebar-nav', icon: 'bi bi-diagram-3' },
    { id: 'model', label: 'Menu item model', icon: 'bi bi-braces' },
    { id: 'css', label: 'Theming', icon: 'bi bi-palette' },
    { id: 'drawer', label: 'ngb-drawer', icon: 'bi bi-window-sidebar' },
    { id: 'a11y', label: 'Accessibility', icon: 'bi bi-universal-access' },
  ];

  sidebarInputs: Row[] = [
    {
      name: 'id',
      type: 'string',
      def: 'auto',
      desc: 'Id used by ngbSidebarTrigger[target] and aria-controls.',
    },
    {
      name: 'open',
      type: 'model<boolean>',
      def: 'true',
      desc: 'Two-way expanded state: [(open)].',
    },
    {
      name: 'variant',
      type: "'sidebar' | 'floating' | 'inset'",
      def: "'sidebar'",
      desc: 'Visual style. Floating = detached card, inset = main content becomes the card.',
    },
    {
      name: 'collapsible',
      type: "'icon' | 'offcanvas' | 'none'",
      def: "'offcanvas'",
      desc: 'Collapse to an icon rail, slide off screen, or never collapse.',
    },
    { name: 'side', type: "'left' | 'right'", def: "'left'", desc: 'Side of the layout.' },
    {
      name: 'overlay',
      type: 'boolean',
      def: 'false',
      desc: 'Float above the main content instead of pushing it.',
    },
    {
      name: 'openOnHover',
      type: 'boolean',
      def: 'false',
      desc: 'Temporarily expand a collapsed sidebar while hovered or focused.',
    },
    {
      name: 'hoverCloseDelay',
      type: 'number (ms)',
      def: '150',
      desc: 'Delay before a hover-opened sidebar collapses.',
    },
    {
      name: 'backdrop',
      type: 'boolean',
      def: 'false',
      desc: 'Show a backdrop while open as an overlay.',
    },
    {
      name: 'dismissable',
      type: 'boolean',
      def: 'true',
      desc: 'Escape and backdrop clicks close an overlay sidebar.',
    },
    {
      name: 'width',
      type: 'string',
      def: "'16rem'",
      desc: 'Expanded width (--ngb-sidebar-width).',
    },
    {
      name: 'iconWidth',
      type: 'string',
      def: "'3rem'",
      desc: 'Width when collapsed to icons (--ngb-sidebar-width-icon).',
    },
    {
      name: 'breakpoint',
      type: 'number | null',
      def: 'null',
      desc: 'Below this viewport width (px) become an off-canvas overlay with backdrop, closed by default.',
    },
    {
      name: 'keyboardShortcut',
      type: 'string | null',
      def: "'b'",
      desc: 'Ctrl/⌘ + key toggles. null disables.',
    },
    {
      name: 'stateKey',
      type: 'string | null',
      def: 'null',
      desc: 'Persist the open state in localStorage under this key.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      def: "'Sidebar'",
      desc: 'Accessible name of the <aside> landmark.',
    },
  ];

  parts: Row[] = [
    {
      name: 'ngb-sidebar-layout',
      type: 'component',
      desc: 'Root flex container. [fill] (default true) = min-height 100vh. Renders the shared backdrop.',
    },
    {
      name: 'ngb-sidebar-main',
      type: 'component',
      desc: 'Main content area (role=main). Becomes a card for the inset variant.',
    },
    {
      name: 'ngb-sidebar-backdrop',
      type: 'component',
      desc: 'Explicit backdrop shown while any overlay sidebar of the layout is open.',
    },
    { name: 'ngb-sidebar-header / -footer', type: 'component', desc: 'Pinned top / bottom areas.' },
    { name: 'ngb-sidebar-content', type: 'component', desc: 'Scrollable middle area.' },
    {
      name: 'ngb-sidebar-group',
      type: 'component',
      desc: 'Section. [collapsible] + [(open)] folds it via its label.',
    },
    {
      name: 'ngb-sidebar-group-label',
      type: 'component',
      desc: 'Section title; hidden in icon mode.',
    },
    {
      name: '[ngbSidebarGroupAction]',
      type: 'directive',
      desc: 'Button aligned to the right of the group label.',
    },
    { name: 'ngb-sidebar-group-content', type: 'component', desc: 'Section body.' },
    {
      name: 'ngb-sidebar-menu / -menu-sub',
      type: 'component',
      desc: 'Lists (role=list) of items / nested sub items.',
    },
    {
      name: 'ngb-sidebar-menu-item / -menu-sub-item',
      type: 'component',
      desc: '[collapsible], [defaultOpen], [(open)] — nest sub menus to any depth.',
    },
    {
      name: '[ngbSidebarMenuButton]',
      type: 'directive',
      desc: '[isActive], [tooltip] (title in icon mode), size sm|md|lg. Toggles a collapsible parent item.',
    },
    {
      name: '[ngbSidebarMenuSubButton]',
      type: 'directive',
      desc: 'Same as menu button, for sub items.',
    },
    { name: 'ngb-sidebar-menu-badge', type: 'component', desc: 'Counter on the right of an item.' },
    {
      name: '[ngbSidebarMenuAction]',
      type: 'directive',
      desc: 'Secondary button on an item. [showOnHover].',
    },
    { name: 'ngb-sidebar-separator', type: 'component', desc: 'Divider line.' },
    {
      name: '[ngbSidebarTrigger]',
      type: 'directive',
      desc: '[target]="id" toggles a sidebar (default: first of the layout). Sets aria-controls / aria-expanded.',
    },
    {
      name: '[ngbSidebarRail]',
      type: 'directive',
      desc: 'Thin clickable edge inside the sidebar that toggles it.',
    },
    {
      name: 'NGB_SIDEBAR / NgbSidebarModule',
      type: 'array / NgModule',
      desc: 'All parts at once: imports: [...NGB_SIDEBAR].',
    },
  ];

  navApi: Row[] = [
    { name: 'model', type: 'NgbSidebarMenuItem[]', def: '[]', desc: 'Menu definition.' },
    {
      name: 'activeItem',
      type: 'model<NgbSidebarMenuItem | null>',
      def: 'null',
      desc: 'Two-way active item. Initialised from item.active.',
    },
    {
      name: 'accordion',
      type: 'boolean',
      def: 'false',
      desc: 'Only one expanded sibling per level.',
    },
    {
      name: 'autoExpandActive',
      type: 'boolean',
      def: 'true',
      desc: 'Expand the ancestors of the active item.',
    },
    {
      name: 'selectOnClick',
      type: 'boolean',
      def: 'true',
      desc: 'Clicking a leaf makes it active.',
    },
    {
      name: 'collapsibleGroups',
      type: 'boolean',
      def: 'false',
      desc: 'Group labels fold their group.',
    },
    { name: 'ariaLabel', type: 'string', def: "'Main'", desc: 'Navigation landmark label.' },
    {
      name: '(itemClick)',
      type: 'SidebarItemClickEvent',
      desc: 'Item clicked ({ originalEvent, item }).',
    },
    {
      name: '(actionClick)',
      type: 'SidebarItemClickEvent',
      desc: 'Action button of an item clicked.',
    },
    {
      name: '(expandedChange)',
      type: '{ item, expanded }',
      desc: 'An item was expanded / collapsed.',
    },
    {
      name: 'ng-template ngbSidebarNavItem',
      type: 'template',
      desc: 'Custom item content. Context: $implicit item, depth, active, expanded, hasChildren.',
    },
  ];

  menuItem: Row[] = [
    { name: 'label / icon', type: 'string', desc: 'Text and icon class (e.g. bi bi-house).' },
    {
      name: 'items',
      type: 'NgbSidebarMenuItem[]',
      desc: 'Children → collapsible sub menu (any depth).',
    },
    { name: 'group', type: 'boolean', desc: 'Top-level labelled group; its items form the menu.' },
    { name: 'separator', type: 'boolean', desc: 'Divider line.' },
    {
      name: 'badge / badgeClass',
      type: 'string | number / string',
      desc: 'Counter and its classes (e.g. text-bg-danger).',
    },
    { name: 'url / target', type: 'string', desc: 'Render as a link.' },
    { name: 'command', type: '(e) => void', desc: 'Called on click.' },
    { name: 'expanded / active', type: 'boolean', desc: 'Initial state.' },
    { name: 'disabled / visible', type: 'boolean', desc: 'Disable or hide (visible: false).' },
    { name: 'tooltip', type: 'string', desc: 'Title in icon mode (defaults to label).' },
    {
      name: 'actionIcon / actionLabel / actionOnHover',
      type: 'string / string / boolean',
      desc: 'Secondary action button.',
    },
    {
      name: 'id / styleClass / data',
      type: 'string / string / unknown',
      desc: 'Tracking key, classes, custom payload.',
    },
  ];

  cssVars: Row[] = [
    { name: '--ngb-sidebar-bg', type: 'color', def: '--bs-tertiary-bg', desc: 'Panel background.' },
    { name: '--ngb-sidebar-color', type: 'color', def: '--bs-body-color', desc: 'Text color.' },
    {
      name: '--ngb-sidebar-muted',
      type: 'color',
      def: '--bs-secondary-color',
      desc: 'Group labels, sub items.',
    },
    {
      name: '--ngb-sidebar-border-color',
      type: 'color',
      def: '--bs-border-color',
      desc: 'Borders and separators.',
    },
    {
      name: '--ngb-sidebar-hover-bg',
      type: 'color',
      def: '--bs-secondary-bg',
      desc: 'Hovered button.',
    },
    {
      name: '--ngb-sidebar-active-bg',
      type: 'color',
      def: '--bs-primary-bg-subtle',
      desc: 'Active button.',
    },
    {
      name: '--ngb-sidebar-active-color',
      type: 'color',
      def: '--bs-primary-text-emphasis',
      desc: 'Active text.',
    },
    {
      name: '--ngb-sidebar-radius',
      type: 'length',
      def: '--bs-border-radius',
      desc: 'Button radius.',
    },
    {
      name: '--ngb-sidebar-transition',
      type: 'transition',
      def: '200ms ease',
      desc: 'Collapse animation.',
    },
    { name: '--ngb-sidebar-z', type: 'number', def: '1020', desc: 'Base z-index.' },
    {
      name: '--ngb-sidebar-backdrop',
      type: 'color',
      def: 'rgba(0,0,0,.45)',
      desc: 'Backdrop color.',
    },
  ];

  drawerApi: Row[] = [
    { name: 'visible', type: 'model<boolean>', def: 'false', desc: 'Two-way visibility.' },
    {
      name: 'position',
      type: "'left' | 'right' | 'top' | 'bottom' | 'full'",
      def: "'left'",
      desc: 'Edge to slide from.',
    },
    { name: 'fullScreen', type: 'boolean', def: 'false', desc: 'Cover the viewport.' },
    { name: 'header / size', type: 'string', desc: 'Title / width or height.' },
    {
      name: 'style / styleClass / maskStyleClass',
      type: 'object / string',
      desc: 'Custom styling.',
    },
    {
      name: 'appendTo',
      type: "'body' | 'self' | HTMLElement",
      def: "'body'",
      desc: 'Where the DOM is attached.',
    },
    {
      name: 'modal / dismissible / closable',
      type: 'boolean',
      def: 'true',
      desc: 'Mask, close on mask click, allow closing.',
    },
    {
      name: 'showCloseIcon / closeIcon',
      type: 'boolean / string',
      def: "true / ''",
      desc: 'Close button and its icon class.',
    },
    {
      name: 'closeOnEscape / blockScroll',
      type: 'boolean',
      def: 'true / false',
      desc: 'Keyboard close / lock body scroll.',
    },
    {
      name: 'autoZIndex / baseZIndex',
      type: 'boolean / number',
      def: 'true / 0',
      desc: 'Layering.',
    },
    { name: 'focusTrap / restoreFocus', type: 'boolean', def: 'true', desc: 'Focus management.' },
    { name: 'transitionDuration', type: 'number (ms)', def: '300', desc: 'Animation length.' },
    {
      name: 'ariaLabel / ariaLabelledBy / ariaCloseLabel',
      type: 'string',
      desc: 'Accessibility labels.',
    },
    {
      name: '(onShow) / (onHide)',
      type: 'void / { reason }',
      desc: "reason: 'close-button' | 'escape' | 'mask' | 'programmatic'.",
    },
  ];

  keys: Row[] = [
    { name: 'Tab / Shift+Tab', type: 'keyboard', desc: 'Move focus through the sidebar items.' },
    {
      name: 'Enter / Space',
      type: 'keyboard',
      desc: 'Activate a trigger, menu button, collapsible group label or rail.',
    },
    {
      name: 'Escape',
      type: 'keyboard',
      desc: 'Close an overlay sidebar when dismissable (and the drawer when closeOnEscape).',
    },
    { name: 'Ctrl/⌘ + B', type: 'keyboard', desc: 'Toggle the sidebar (keyboardShortcut).' },
  ];
}
