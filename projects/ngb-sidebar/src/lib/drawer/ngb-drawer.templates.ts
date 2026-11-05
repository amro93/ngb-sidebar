import { Directive, TemplateRef, inject } from '@angular/core';

/** Context passed to every sidebar template. `close()` hides the sidebar. */
export interface DrawerTemplateContext {
  $implicit: () => void;
  close: () => void;
}

/** Custom header: `<ng-template ngbDrawerHeader>...</ng-template>` */
@Directive({ selector: 'ng-template[ngbDrawerHeader]', standalone: true })
export class NgbDrawerHeaderDirective {
  readonly templateRef = inject<TemplateRef<DrawerTemplateContext>>(TemplateRef);
}

/** Content template (alternative to projected content). */
@Directive({ selector: 'ng-template[ngbDrawerContent]', standalone: true })
export class NgbDrawerContentDirective {
  readonly templateRef = inject<TemplateRef<DrawerTemplateContext>>(TemplateRef);
}

/** Footer template. */
@Directive({ selector: 'ng-template[ngbDrawerFooter]', standalone: true })
export class NgbDrawerFooterDirective {
  readonly templateRef = inject<TemplateRef<DrawerTemplateContext>>(TemplateRef);
}

/** Headless template: replaces the whole panel body (header, content and footer). */
@Directive({ selector: 'ng-template[ngbDrawerHeadless]', standalone: true })
export class NgbDrawerHeadlessDirective {
  readonly templateRef = inject<TemplateRef<DrawerTemplateContext>>(TemplateRef);
}

/** Custom close icon. */
@Directive({ selector: 'ng-template[ngbDrawerCloseIcon]', standalone: true })
export class NgbDrawerCloseIconDirective {
  readonly templateRef = inject<TemplateRef<DrawerTemplateContext>>(TemplateRef);
}

/** Convenience array to import the component templates at once. */
export const NGB_DRAWER_TEMPLATES = [
  NgbDrawerHeaderDirective,
  NgbDrawerContentDirective,
  NgbDrawerFooterDirective,
  NgbDrawerHeadlessDirective,
  NgbDrawerCloseIconDirective,
] as const;
