import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

/** Demo card with Demo / HTML / TS tabs and copy-to-clipboard, like the ngb-select showcase. */
@Component({
  selector: 'app-example-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block mb-4', '[id]': 'anchor()' },
  template: `
    <div class="card example-card">
      <div
        class="card-header d-flex flex-wrap gap-2 align-items-center justify-content-between p-3"
      >
        <div>
          <div>
            <i [class]="icon() + ' text-primary me-2'"></i><span>{{ title() }}</span>
          </div>
          @if (description()) {
            <div class="small text-body-secondary fw-normal mt-1">{{ description() }}</div>
          }
        </div>
        <ul class="nav nav-pills nav-sm">
          <li class="nav-item">
            <button
              class="nav-link py-1 px-3"
              [class.active]="tab() === 'demo'"
              (click)="tab.set('demo')"
            >
              Demo
            </button>
          </li>
          @if (html()) {
            <li class="nav-item">
              <button
                class="nav-link py-1 px-3"
                [class.active]="tab() === 'html'"
                (click)="tab.set('html')"
              >
                HTML
              </button>
            </li>
          }
          @if (ts()) {
            <li class="nav-item">
              <button
                class="nav-link py-1 px-3"
                [class.active]="tab() === 'ts'"
                (click)="tab.set('ts')"
              >
                TS
              </button>
            </li>
          }
        </ul>
      </div>
      <div class="card-body p-3">
        <div [hidden]="tab() !== 'demo'"><ng-content></ng-content></div>
        @if (tab() !== 'demo') {
          @let code = tab() === 'html' ? html() : ts();
          <div class="position-relative">
            <button
              class="btn btn-sm btn-outline-light position-absolute top-0 end-0 m-2"
              [attr.aria-label]="'Copy ' + tab()"
              (click)="copy(code ?? '')"
            >
              <i class="bi" [class.bi-clipboard]="!copied()" [class.bi-check-lg]="copied()"></i>
            </button>
            <pre class="code-box m-0"><code>{{ code }}</code></pre>
          </div>
        }
      </div>
    </div>
  `,
})
export class ExampleCardComponent {
  title = input.required<string>();
  icon = input<string>('bi bi-layout-sidebar');
  description = input<string>('');
  anchor = input<string | null>(null);
  html = input<string>('');
  ts = input<string>('');

  tab = signal<'demo' | 'html' | 'ts'>('demo');
  copied = signal(false);

  copy(code: string): void {
    navigator.clipboard?.writeText(code.trim());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
