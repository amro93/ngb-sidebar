import { Directive, TemplateRef, inject } from '@angular/core';

/** Context passed to every sidebar template. `close()` hides the sidebar. */
export interface SidebarTemplateContext {
  $implicit: () => void;
  close: () => void;
}

/** Custom header: `<ng-template ngbSidebarHeader>...</ng-template>` */
@Directive({ selector: 'ng-template[ngbSidebarHeader]', standalone: true })
export class NgbSidebarHeaderDirective {
  readonly templateRef = inject<TemplateRef<SidebarTemplateContext>>(TemplateRef);
}

/** Content template (alternative to projected content). */
@Directive({ selector: 'ng-template[ngbSidebarContent]', standalone: true })
export class NgbSidebarContentDirective {
  readonly templateRef = inject<TemplateRef<SidebarTemplateContext>>(TemplateRef);
}

/** Footer template. */
@Directive({ selector: 'ng-template[ngbSidebarFooter]', standalone: true })
export class NgbSidebarFooterDirective {
  readonly templateRef = inject<TemplateRef<SidebarTemplateContext>>(TemplateRef);
}

/** Headless template: replaces the whole panel body (header, content and footer). */
@Directive({ selector: 'ng-template[ngbSidebarHeadless]', standalone: true })
export class NgbSidebarHeadlessDirective {
  readonly templateRef = inject<TemplateRef<SidebarTemplateContext>>(TemplateRef);
}

/** Custom close icon. */
@Directive({ selector: 'ng-template[ngbSidebarCloseIcon]', standalone: true })
export class NgbSidebarCloseIconDirective {
  readonly templateRef = inject<TemplateRef<SidebarTemplateContext>>(TemplateRef);
}

/** Convenience array to import the component templates at once. */
export const NGB_SIDEBAR_TEMPLATES = [
  NgbSidebarHeaderDirective,
  NgbSidebarContentDirective,
  NgbSidebarFooterDirective,
  NgbSidebarHeadlessDirective,
  NgbSidebarCloseIconDirective,
] as const;
