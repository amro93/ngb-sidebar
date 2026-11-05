import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbDrawerComponent } from './ngb-drawer.component';
import {
  NgbDrawerFooterDirective,
  NgbDrawerHeadlessDirective,
  NgbDrawerHeaderDirective,
} from './ngb-drawer.templates';
import { DrawerHideEvent, DrawerPosition } from './ngb-drawer.interface';

const wait = (ms = 0) => new Promise((r) => setTimeout(r, ms));

@Component({
  standalone: true,
  imports: [NgbDrawerComponent],
  template: `
    <button id="opener">open</button>
    <ngb-drawer
      [(visible)]="visible"
      [position]="position()"
      [fullScreen]="fullScreen()"
      [modal]="modal()"
      [dismissible]="dismissible()"
      [closable]="closable()"
      [closeOnEscape]="closeOnEscape()"
      [blockScroll]="blockScroll()"
      [appendTo]="appendTo()"
      [size]="size()"
      [styleClass]="'my-panel'"
      [transitionDuration]="0"
      header="Title"
      (onShow)="shown = shown + 1"
      (onHide)="hidden.push($event)"
    >
      <input id="first" />
      <button id="last">x</button>
    </ngb-drawer>
  `,
})
class HostComponent {
  visible = signal(false);
  position = signal<DrawerPosition>('left');
  fullScreen = signal(false);
  modal = signal(true);
  dismissible = signal(true);
  closable = signal(true);
  closeOnEscape = signal(true);
  blockScroll = signal(false);
  appendTo = signal<'body' | 'self'>('body');
  size = signal<string | undefined>(undefined);
  shown = 0;
  hidden: DrawerHideEvent[] = [];
}

@Component({
  standalone: true,
  imports: [
    NgbDrawerComponent,
    NgbDrawerHeaderDirective,
    NgbDrawerFooterDirective,
    NgbDrawerHeadlessDirective,
  ],
  template: `
    <ngb-drawer [(visible)]="a" [transitionDuration]="0">
      <ng-template ngbDrawerHeader><span class="custom-header">H</span></ng-template>
      <ng-template ngbDrawerFooter let-close
        ><button class="custom-footer" (click)="close()">F</button></ng-template
      >
    </ngb-drawer>
    <ngb-drawer [(visible)]="b" [transitionDuration]="0" appendTo="self">
      <ng-template ngbDrawerHeadless let-close
        ><div class="headless">
          <button class="hl-close" (click)="close()">c</button>
        </div></ng-template
      >
    </ngb-drawer>
  `,
})
class TemplatesHost {
  a = signal(false);
  b = signal(false);
}

const panel = () => document.querySelector<HTMLElement>('.ngb-drawer');
const mask = () => document.querySelector<HTMLElement>('.ngb-drawer-mask');

describe('NgbDrawerComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  async function open() {
    host.visible.set(true);
    fixture.detectChanges();
    await wait();
    fixture.detectChanges();
  }
  async function settle() {
    fixture.detectChanges();
    await wait(5);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('renders nothing while hidden', () => {
    expect(panel()).toBeNull();
  });

  it('opens, applies position class, header, aria and emits onShow', async () => {
    await open();
    const p = panel()!;
    expect(p.classList).toContain('ngb-drawer-left');
    expect(p.classList).toContain('ngb-drawer-active');
    expect(p.classList).toContain('my-panel');
    expect(p.getAttribute('role')).toBe('dialog');
    expect(p.getAttribute('aria-modal')).toBe('true');
    expect(p.querySelector('h5')!.textContent).toContain('Title');
    expect(p.getAttribute('aria-labelledby')).toBe(p.querySelector('.ngb-drawer-title')!.id);
    expect(host.shown).toBe(1);
  });

  it('is appended to body by default and in place with appendTo=self', async () => {
    await open();
    expect(panel()!.parentElement!.parentElement).toBe(document.body);
    host.visible.set(false);
    await settle();
    host.appendTo.set('self');
    await open();
    expect(fixture.nativeElement.contains(panel())).toBe(true);
  });

  it.each<DrawerPosition>(['left', 'right', 'top', 'bottom', 'full'])(
    'supports position %s',
    async (pos) => {
      host.position.set(pos);
      await open();
      expect(panel()!.classList).toContain(`ngb-drawer-${pos}`);
    },
  );

  it('fullScreen overrides position and blocks scroll', async () => {
    host.position.set('right');
    host.fullScreen.set(true);
    await open();
    expect(panel()!.classList).toContain('ngb-drawer-full');
    expect(document.body.style.overflow).toBe('hidden');
    host.visible.set(false);
    await settle();
    expect(document.body.style.overflow).toBe('');
  });

  it('applies size as width for left/right and height for top/bottom', async () => {
    host.size.set('30rem');
    await open();
    expect(panel()!.style.width).toBe('30rem');
    host.visible.set(false);
    await settle();
    host.position.set('top');
    await open();
    expect(panel()!.style.height).toBe('30rem');
  });

  it('blockScroll locks body overflow', async () => {
    host.blockScroll.set(true);
    await open();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('closes via close button and updates two-way binding', async () => {
    await open();
    panel()!.querySelector<HTMLButtonElement>('.ngb-drawer-close')!.click();
    await settle();
    expect(host.visible()).toBe(false);
    expect(panel()).toBeNull();
    expect(host.hidden).toEqual([{ reason: 'close-button' }]);
  });

  it('closes on mask click when dismissible', async () => {
    await open();
    mask()!.click();
    await settle();
    expect(host.visible()).toBe(false);
    expect(host.hidden[0].reason).toBe('mask');
  });

  it('does not close on mask click when dismissible=false', async () => {
    host.dismissible.set(false);
    await open();
    mask()!.click();
    await settle();
    expect(host.visible()).toBe(true);
  });

  it('modal=false renders no mask', async () => {
    host.modal.set(false);
    await open();
    expect(mask()).toBeNull();
    expect(panel()!.getAttribute('aria-modal')).toBe('false');
  });

  it('closes on Escape', async () => {
    await open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await settle();
    expect(host.visible()).toBe(false);
    expect(host.hidden[0].reason).toBe('escape');
  });

  it('ignores Escape when closeOnEscape=false', async () => {
    host.closeOnEscape.set(false);
    await open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await settle();
    expect(host.visible()).toBe(true);
  });

  it('closable=false hides the close button and ignores Escape', async () => {
    host.closable.set(false);
    await open();
    expect(panel()!.querySelector('.ngb-drawer-close')).toBeNull();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await settle();
    expect(host.visible()).toBe(true);
  });

  it('focuses the first focusable element, traps Tab and restores focus', async () => {
    const opener = fixture.nativeElement.querySelector('#opener') as HTMLButtonElement;
    opener.focus();
    await open();
    expect(document.activeElement!.id).toBe('first');
    (document.querySelector('#last') as HTMLElement).focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', cancelable: true }));
    expect(document.activeElement!.classList).toContain('ngb-drawer-close');
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true }),
    );
    expect(document.activeElement!.id).toBe('last');
    host.visible.set(false);
    await settle();
    expect(document.activeElement).toBe(opener);
  });

  it('assigns increasing z-index for stacked sidebars', async () => {
    await open();
    const z = Number(panel()!.style.zIndex);
    expect(z).toBeGreaterThan(1100);
    expect(Number(mask()!.style.zIndex)).toBe(z - 1);
  });
});

describe('NgbDrawerComponent templates', () => {
  it('renders header/footer templates and headless template with close()', async () => {
    await TestBed.configureTestingModule({ imports: [TemplatesHost] }).compileComponents();
    const f = TestBed.createComponent(TemplatesHost);
    f.detectChanges();
    f.componentInstance.a.set(true);
    f.detectChanges();
    await wait();
    f.detectChanges();
    expect(document.querySelector('.custom-header')).not.toBeNull();
    (document.querySelector('.custom-footer') as HTMLElement).click();
    f.detectChanges();
    expect(f.componentInstance.a()).toBe(false);

    f.componentInstance.b.set(true);
    f.detectChanges();
    await wait();
    f.detectChanges();
    const hl = f.nativeElement.querySelector('.headless');
    expect(hl).not.toBeNull();
    expect(f.nativeElement.querySelectorAll('.ngb-drawer-header').length).toBe(0);
    (f.nativeElement.querySelector('.hl-close') as HTMLElement).click();
    f.detectChanges();
    expect(f.componentInstance.b()).toBe(false);
    f.destroy();
  });

  it('exposes VERSION', () => {
    expect(NgbDrawerComponent.VERSION).toMatch(/\d+\.\d+\.\d+/);
  });
});
