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

/** Built-in swipe gesture defaults. */
export const NGB_SIDEBAR_SWIPE_DEFAULTS = { swipe: true, swipeEdge: 24, swipeThreshold: 0.3 };

export const NGB_SIDEBAR_CONFIG = new InjectionToken<NgbSidebarConfig>('NGB_SIDEBAR_CONFIG', {
  providedIn: 'root',
  factory: () => ({ breakpoint: null, mobile: {}, ...NGB_SIDEBAR_SWIPE_DEFAULTS }),
});

/**
 * App-wide sidebar defaults (breakpoint and mobile behavior).
 *
 * ```ts
 * bootstrapApplication(App, {
 *   providers: [
 *     provideNgbSidebarConfig({ breakpoint: 992, mobile: { width: '85vw' }, swipeEdge: 32 }),
 *   ],
 * });
 * ```
 */
export function provideNgbSidebarConfig(config: Partial<NgbSidebarConfig>): Provider {
  return {
    provide: NGB_SIDEBAR_CONFIG,
    useValue: {
      ...NGB_SIDEBAR_SWIPE_DEFAULTS,
      ...config,
      breakpoint: config.breakpoint ?? null,
      mobile: config.mobile ?? {},
    },
  };
}
