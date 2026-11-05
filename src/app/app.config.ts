import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideNgbSidebarConfig } from '@amro93/ngb-sidebar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Every sidebar in the showcase adapts below 768px: off-canvas overlay with backdrop,
    // closed by default and closing after navigation. Individual sidebars can override this.
    provideNgbSidebarConfig({ breakpoint: 768, mobile: { width: '80%' } }),
  ],
};
