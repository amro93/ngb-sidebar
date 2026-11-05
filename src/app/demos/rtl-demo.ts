import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NGB_SIDEBAR, NgbSidebarMenuItem } from '@amro93/ngb-sidebar';
import { DirectionService } from '../direction.service';

const HTML = `
<div class="d-flex flex-wrap align-items-center gap-2 mb-3 small">
  <button class="btn btn-sm" [class]="direction.dir() === 'rtl' ? 'btn-primary' : 'btn-outline-primary'"
          (click)="direction.toggle()">
    <i class="bi bi-translate"></i>
    {{ direction.dir() === 'rtl' ? 'Back to LTR' : 'Switch the page to RTL (العربية)' }}
  </button>
  <span class="text-body-secondary">
    Sets <code>dir="rtl"</code> on &lt;html&gt; and loads <code>bootstrap.rtl.css</code> —
    the sidebar mirrors itself: <code>side="left"</code> means the <em>start</em> edge.
  </span>
</div>

<div class="demo-frame">
  <ngb-sidebar-layout [fill]="false">
    <ngb-sidebar id="rtl-demo" collapsible="icon" [keyboardShortcut]="null" ariaLabel="القائمة الرئيسية">
      <ngb-sidebar-header>
        <ngb-sidebar-menu>
          <ngb-sidebar-menu-item>
            <button ngbSidebarMenuButton size="lg" tooltip="شركة أكمي" keepOpen>
              <span class="demo-logo">أ</span>
              <span class="d-flex flex-column lh-sm">
                <span class="fw-semibold">شركة أكمي</span>
                <small class="text-body-secondary">المؤسسات</small>
              </span>
            </button>
          </ngb-sidebar-menu-item>
        </ngb-sidebar-menu>
      </ngb-sidebar-header>
      <ngb-sidebar-content>
        <ngb-sidebar-nav [model]="menu" [(activeItem)]="active" ariaLabel="التنقل" />
      </ngb-sidebar-content>
      <ngb-sidebar-footer>
        <ngb-sidebar-menu>
          <ngb-sidebar-menu-item>
            <button ngbSidebarMenuButton tooltip="أحمد علي" keepOpen>
              <span class="demo-avatar">أع</span><span>أحمد علي</span>
            </button>
          </ngb-sidebar-menu-item>
        </ngb-sidebar-menu>
      </ngb-sidebar-footer>
      <button ngbSidebarRail ariaLabel="إظهار/إخفاء القائمة"></button>
    </ngb-sidebar>

    <ngb-sidebar-main>
      <header class="demo-topbar">
        <button class="btn btn-sm btn-light" ngbSidebarTrigger ariaLabel="إظهار/إخفاء القائمة">
          <i class="bi bi-layout-sidebar"></i>
        </button>
        <strong class="small">{{ active()?.label }}</strong>
      </header>
      <div class="demo-body"><div class="demo-block flex-fill"></div></div>
    </ngb-sidebar-main>
  </ngb-sidebar-layout>
</div>
`;

const TS = `
import { Component, signal } from '@angular/core';
import { NGB_SIDEBAR, NgbSidebarMenuItem } from '@amro93/ngb-sidebar';

// RTL setup in your app:
//  1. <html dir="rtl" lang="ar">
//  2. load node_modules/bootstrap/dist/css/bootstrap.rtl.min.css instead of bootstrap.min.css
// The sidebar uses CSS logical properties, so side="left" = start edge (right in RTL).

@Component({
  selector: 'app-rtl-demo',
  imports: [...NGB_SIDEBAR],
  templateUrl: './rtl-demo.html',
})
export class RtlDemo {
  active = signal<NgbSidebarMenuItem | null>(null);

  menu: NgbSidebarMenuItem[] = [
    { group: true, label: 'التنقل', items: [
      { label: 'الرئيسية', icon: 'bi bi-house', active: true },
      { label: 'البريد الوارد', icon: 'bi bi-inbox', badge: 12 },
      { label: 'التقارير', icon: 'bi bi-bar-chart', items: [
        { label: 'نظرة عامة' }, { label: 'المبيعات' }, { label: 'الوقت الفعلي' },
      ] },
    ] },
    { group: true, label: 'الإعدادات', items: [
      { label: 'الفريق', icon: 'bi bi-people' },
      { label: 'الفوترة', icon: 'bi bi-credit-card', badge: 'جديد', badgeClass: 'text-bg-success' },
    ] },
  ];
}
`;

@Component({
  selector: 'app-rtl-demo',
  standalone: true,
  imports: [...NGB_SIDEBAR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: HTML,
})
export class RtlDemo {
  static readonly html = HTML;
  static readonly ts = TS;

  readonly direction = inject(DirectionService);
  active = signal<NgbSidebarMenuItem | null>(null);

  menu: NgbSidebarMenuItem[] = [
    {
      group: true,
      label: 'التنقل',
      items: [
        { label: 'الرئيسية', icon: 'bi bi-house', active: true },
        { label: 'البريد الوارد', icon: 'bi bi-inbox', badge: 12 },
        {
          label: 'التقارير',
          icon: 'bi bi-bar-chart',
          items: [{ label: 'نظرة عامة' }, { label: 'المبيعات' }, { label: 'الوقت الفعلي' }],
        },
      ],
    },
    {
      group: true,
      label: 'الإعدادات',
      items: [
        { label: 'الفريق', icon: 'bi bi-people' },
        {
          label: 'الفوترة',
          icon: 'bi bi-credit-card',
          badge: 'جديد',
          badgeClass: 'text-bg-success',
        },
      ],
    },
  ];
}
