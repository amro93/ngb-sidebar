import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { NGB_SIDEBAR_LAYOUT, NgbSidebarLayoutContext } from './sidebar.registry';
import type { NgbSidebarComponent } from './sidebar.component';

/** Root flex container that hosts one or more `<ngb-sidebar>` and a `<ngb-sidebar-main>`. */
@Component({
  selector: 'ngb-sidebar-layout',
  standalone: true,
  exportAs: 'ngbSidebarLayout',
  template: `<ng-content></ng-content>
    @if (backdropFor().length) {
      <div class="ngb-sidebar-backdrop" aria-hidden="true" (click)="dismissAll()"></div>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NGB_SIDEBAR_LAYOUT, useExisting: NgbSidebarLayoutComponent }],
  host: {
    class: 'ngb-sidebar-layout',
    '[class.ngb-sidebar-layout-inset]': 'hasInset()',
    '[class.ngb-sidebar-layout-fill]': 'fill()',
  },
})
export class NgbSidebarLayoutComponent implements NgbSidebarLayoutContext {
  /** Make the layout at least as tall as the viewport. Default `true`. */
  fill = input(true, { transform: booleanAttribute });

  private readonly list = signal<readonly NgbSidebarComponent[]>([]);
  readonly sidebars = this.list.asReadonly();
  readonly hasInset = computed(() => this.list().some((s) => s.variant() === 'inset'));
  /** Sidebars that currently request a backdrop (`backdrop` input or mobile breakpoint). */
  readonly backdropFor = computed(() => this.list().filter((s) => s.showBackdrop()));

  dismissAll(): void {
    this.backdropFor().forEach((s) => s.dismiss());
  }

  add(s: NgbSidebarComponent): void {
    this.list.update((l) => [...l, s]);
  }

  remove(s: NgbSidebarComponent): void {
    this.list.update((l) => l.filter((x) => x !== s));
  }
}

/** Main content area next to the sidebar(s). */
@Component({
  selector: 'ngb-sidebar-main',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ngb-sidebar-main', role: 'main' },
})
export class NgbSidebarMainComponent {}

/**
 * Backdrop shown while any overlay sidebar of the surrounding layout is open.
 * Clicking it dismisses those sidebars (when `dismissable`).
 * Alternative to the `backdrop` input on `<ngb-sidebar>`.
 */
@Component({
  selector: 'ngb-sidebar-backdrop',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngb-sidebar-backdrop ngb-sidebar-backdrop-standalone',
    'aria-hidden': 'true',
    '[class.ngb-sidebar-backdrop-visible]': 'visible()',
    '(click)': 'dismiss()',
  },
})
export class NgbSidebarBackdropComponent {
  private readonly layout = inject(NGB_SIDEBAR_LAYOUT, { optional: true });

  private readonly openOverlays = computed(() =>
    (this.layout?.sidebars() ?? []).filter(
      (s) => s.effectiveOverlay() && s.open() && s.effectiveCollapsible() !== 'none',
    ),
  );
  readonly visible = computed(() => this.openOverlays().length > 0);

  dismiss(): void {
    this.openOverlays().forEach((s) => s.dismiss());
  }
}
