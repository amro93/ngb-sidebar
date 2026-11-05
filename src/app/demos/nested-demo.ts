import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import { NGB_SIDEBAR, NgbSidebarMenuItem, NgbSidebarNavComponent } from '@amro93/ngb-sidebar';
import { FILE_TREE } from '../data/demo-data';

const HTML = `
<div class="demo-frame">
  <ngb-sidebar-layout [fill]="false">
    <ngb-sidebar id="nested-demo" collapsible="icon" [keyboardShortcut]="null">
      <ngb-sidebar-header>
        <ngb-sidebar-menu>
          <ngb-sidebar-menu-item>
            <button ngbSidebarMenuButton size="lg" tooltip="File Manager">
              <span class="demo-logo" style="background: linear-gradient(135deg,#0ea5e9,#2563eb)">F</span>
              <span class="fw-semibold">File Manager</span>
            </button>
          </ngb-sidebar-menu-item>
        </ngb-sidebar-menu>
      </ngb-sidebar-header>
      <ngb-sidebar-content>
        <!-- Data-driven, unlimited depth -->
        <ngb-sidebar-nav #nav [model]="tree" [(activeItem)]="active" [accordion]="accordion()"
                         ariaLabel="Files" />
      </ngb-sidebar-content>
      <ngb-sidebar-footer>
        <div class="d-flex gap-1 ngb-sidebar-hide-collapsed">
          <button class="btn btn-sm btn-outline-secondary flex-fill" (click)="nav.expandAll()">Expand all</button>
          <button class="btn btn-sm btn-outline-secondary flex-fill" (click)="nav.collapseAll()">Collapse all</button>
        </div>
        <div class="form-check form-switch small ngb-sidebar-hide-collapsed">
          <input class="form-check-input" type="checkbox" id="n-acc" [checked]="accordion()"
                 (change)="accordion.set(!accordion())" />
          <label class="form-check-label" for="n-acc">Accordion (one open per level)</label>
        </div>
      </ngb-sidebar-footer>
      <button ngbSidebarRail></button>
    </ngb-sidebar>

    <ngb-sidebar-main>
      <header class="demo-topbar">
        <button class="btn btn-sm btn-light" ngbSidebarTrigger><i class="bi bi-layout-sidebar"></i></button>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb small mb-0">
            @for (p of path(); track $index; let last = $last) {
              <li class="breadcrumb-item" [class.active]="last">{{ p.label }}</li>
            }
          </ol>
        </nav>
      </header>
      <div class="demo-body">
        <h5 class="mb-0"><i [class]="active()?.icon ?? 'bi bi-file-earmark'"></i> {{ active()?.label }}</h5>
        <div class="demo-block flex-fill"></div>
      </div>
    </ngb-sidebar-main>
  </ngb-sidebar-layout>
</div>
`;

const TS = `
import { Component, computed, signal } from '@angular/core';
import { NGB_SIDEBAR, NgbSidebarMenuItem } from '@amro93/ngb-sidebar';

@Component({
  selector: 'app-nested-demo',
  imports: [...NGB_SIDEBAR],
  templateUrl: './nested-demo.html',
})
export class NestedDemo {
  accordion = signal(false);
  active = signal<NgbSidebarMenuItem | null>(null); // initialised from \`active: true\`

  tree: NgbSidebarMenuItem[] = [
    { group: true, label: 'Files', items: [
      { label: 'Documents', icon: 'bi bi-folder', items: [
        { label: 'Work', icon: 'bi bi-folder', items: [
          { label: 'Projects', icon: 'bi bi-folder', items: [
            { label: 'Q1 Report', icon: 'bi bi-file-earmark-text', active: true },
            { label: 'Q2 Report', icon: 'bi bi-file-earmark-text' },
            { label: 'Roadmap', icon: 'bi bi-file-earmark-richtext' },
          ] },
          { label: 'Invoices', icon: 'bi bi-receipt' },
          { label: 'Contracts', icon: 'bi bi-file-earmark-lock' },
        ] },
        { label: 'Personal', icon: 'bi bi-folder', items: [{ label: 'Taxes 2026', icon: 'bi bi-file-earmark' }] },
      ] },
      { label: 'Media', icon: 'bi bi-image', items: [
        { label: 'Photos', icon: 'bi bi-camera' },
        { label: 'Videos', icon: 'bi bi-camera-video' },
      ] },
      { label: 'Websites', icon: 'bi bi-globe' },
    ] },
  ];

  /** Breadcrumb: path from the root to the active item. */
  path = computed(() => {
    const find = (items: NgbSidebarMenuItem[], t: NgbSidebarMenuItem): NgbSidebarMenuItem[] | null => {
      for (const i of items) {
        if (i === t) return [i];
        const sub = i.items && find(i.items, t);
        if (sub) return i.group ? sub : [i, ...sub];
      }
      return null;
    };
    const a = this.active();
    return a ? (find(this.tree, a) ?? []) : [];
  });
}
`;

@Component({
  selector: 'app-nested-demo',
  standalone: true,
  imports: [...NGB_SIDEBAR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: HTML,
})
export class NestedDemo {
  static readonly html = HTML;
  static readonly ts = TS;

  readonly nav = viewChild(NgbSidebarNavComponent);
  accordion = signal(false);
  active = signal<NgbSidebarMenuItem | null>(null);
  tree = FILE_TREE;

  path = computed(() => {
    const find = (
      items: NgbSidebarMenuItem[],
      t: NgbSidebarMenuItem,
    ): NgbSidebarMenuItem[] | null => {
      for (const i of items) {
        if (i === t) return [i];
        const sub = i.items && find(i.items, t);
        if (sub) return i.group ? sub : [i, ...sub];
      }
      return null;
    };
    const a = this.active();
    return a ? (find(this.tree, a) ?? []) : [];
  });
}
