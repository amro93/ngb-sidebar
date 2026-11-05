import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

/**
 * Switches the whole showcase between LTR and RTL: sets `dir`/`lang` on <html> and swaps
 * Bootstrap's stylesheet for its official RTL build (bootstrap.rtl.css), which flips
 * directional utilities such as `ms-*`, `border-start` and `offcanvas-start`.
 */
@Injectable({ providedIn: 'root' })
export class DirectionService {
  private readonly document = inject(DOCUMENT);
  readonly dir = signal<'ltr' | 'rtl'>('ltr');

  toggle(): void {
    this.set(this.dir() === 'ltr' ? 'rtl' : 'ltr');
  }

  set(dir: 'ltr' | 'rtl'): void {
    this.dir.set(dir);
    const html = this.document.documentElement;
    html.setAttribute('dir', dir);
    html.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    const link = this.document.querySelector<HTMLLinkElement>(
      'link[href*="bootstrap-ltr"], link[href*="bootstrap-rtl"]',
    );
    if (link) {
      link.href = link.href.replace(/bootstrap-(ltr|rtl)/, `bootstrap-${dir}`);
    }
  }
}
