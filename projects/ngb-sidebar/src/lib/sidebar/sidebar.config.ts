import { InjectionToken, Provider } from '@angular/core';
import { NgbSidebarConfig, NgbSidebarMobileOptions } from './sidebar.types';

/** Built-in mobile behavior. */
export const NGB_SIDEBAR_MOBILE_DEFAULTS: NgbSidebarMobileOptions = {
  collapsible: 'offcanvas',
  overlay: true,
  backdrop: true,
  defaultOpen: false,
  closeOnNavigate: true,
  openOnHover: false,
  side: null,
  variant: 'sidebar',
  width: '18rem',
};

export const NGB_SIDEBAR_CONFIG = new InjectionToken<NgbSidebarConfig>('NGB_SIDEBAR_CONFIG', {
  providedIn: 'root',
  factory: () => ({ breakpoint: null, mobile: {} }),
});

/**
 * App-wide sidebar defaults (breakpoint and mobile behavior).
 *
 * ```ts
 * bootstrapApplication(App, {
 *   providers: [provideNgbSidebarConfig({ breakpoint: 992, mobile: { side: 'right', width: '85vw' } })],
 * });
 * ```
 */
export function provideNgbSidebarConfig(config: Partial<NgbSidebarConfig>): Provider {
  return {
    provide: NGB_SIDEBAR_CONFIG,
    useValue: { breakpoint: config.breakpoint ?? null, mobile: config.mobile ?? {} },
  };
}
