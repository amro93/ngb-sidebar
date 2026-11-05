import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NGB_SIDEBAR } from './sidebar.module';
import { NgbSidebarComponent } from './sidebar.component';
import { NgbSidebarRegistry } from './sidebar.registry';
import { provideNgbSidebarConfig } from './sidebar.config';
import {
  NgbSidebarMenuItem,
  NgbSidebarMobileOptions,
  SidebarCollapsible,
  SidebarVariant,
} from './sidebar.types';

@Component({
  standalone: true,
  imports: [...NGB_SIDEBAR],
  template: `
    <ngb-sidebar-layout [fill]="false">
      <ngb-sidebar
        id="sb"
        [(open)]="open"
        [collapsible]="collapsible()"
        [variant]="variant()"
        [overlay]="overlay()"
        [openOnHover]="openOnHover()"
        [backdrop]="backdrop()"
        [dismissable]="dismissable()"
        [keyboardShortcut]="shortcut()"
        [stateKey]="stateKey()"
      >
        <ngb-sidebar-content>
          <ngb-sidebar-group collapsible [(open)]="groupOpen">
            <ngb-sidebar-group-label>Group</ngb-sidebar-group-label>
            <ngb-sidebar-group-content>
              <ngb-sidebar-menu>
                <ngb-sidebar-menu-item>
                  <button id="home" ngbSidebarMenuButton isActive tooltip="Home">
                    <i class="bi bi-house"></i><span>Home</span>
                  </button>
                  <ngb-sidebar-menu-badge>5</ngb-sidebar-menu-badge>
                </ngb-sidebar-menu-item>
                <ngb-sidebar-menu-item collapsible [defaultOpen]="false" [(open)]="itemOpen">
                  <button id="parent" ngbSidebarMenuButton><i></i><span>Parent</span></button>
                  <ngb-sidebar-menu-sub>
                    <ngb-sidebar-menu-sub-item>
                      <button id="child" ngbSidebarMenuSubButton>Child</button>
                    </ngb-sidebar-menu-sub-item>
                  </ngb-sidebar-menu-sub>
                </ngb-sidebar-menu-item>
              </ngb-sidebar-menu>
            </ngb-sidebar-group-content>
          </ngb-sidebar-group>
        </ngb-sidebar-content>
        <button id="rail" ngbSidebarRail></button>
      </ngb-sidebar>
      <ngb-sidebar-main>
        <button id="trigger" ngbSidebarTrigger></button>
        <button id="trigger-target" ngbSidebarTrigger target="sb"></button>
      </ngb-sidebar-main>
    </ngb-sidebar-layout>
  `,
})
class Host {
  open = signal(true);
  collapsible = signal<SidebarCollapsible>('icon');
  variant = signal<SidebarVariant>('sidebar');
  overlay = signal(false);
  openOnHover = signal(false);
  backdrop = signal(false);
  dismissable = signal(true);
  shortcut = signal<string | null>('b');
  stateKey = signal<string | null>(null);
  groupOpen = signal(true);
  itemOpen = signal(false);
}

describe('NgbSidebar (navigation)', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement;
  const sidebar = () => el('ngb-sidebar');
  const render = () => {
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
  };
  const key = (k: string, init: KeyboardEventInit = {}) =>
    document.dispatchEvent(new KeyboardEvent('keydown', { key: k, cancelable: true, ...init }));

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    render();
  });

  afterEach(() => fixture.destroy());

  it('renders expanded with data attributes', () => {
    const sb = sidebar();
    expect(sb.id).toBe('sb');
    expect(sb.dataset['state']).toBe('expanded');
    expect(sb.dataset['collapsible']).toBe('icon');
    expect(sb.dataset['variant']).toBe('sidebar');
    expect(sb.dataset['side']).toBe('left');
    expect(sb.classList).toContain('ngb-sidebar-pushing');
    expect(el('aside').getAttribute('aria-label')).toBe('Sidebar');
  });

  it('trigger without target toggles the first sidebar of the layout and syncs [(open)]', () => {
    const t = el('#trigger');
    expect(t.getAttribute('aria-controls')).toBe('sb');
    expect(t.getAttribute('aria-expanded')).toBe('true');
    t.click();
    render();
    expect(host.open()).toBe(false);
    expect(sidebar().dataset['state']).toBe('collapsed');
    expect(t.getAttribute('aria-expanded')).toBe('false');
  });

  it('trigger with target and rail toggle the sidebar', () => {
    el('#trigger-target').click();
    render();
    expect(host.open()).toBe(false);
    el('#rail').click();
    render();
    expect(host.open()).toBe(true);
  });

  it('registry toggles by id', () => {
    const registry = TestBed.inject(NgbSidebarRegistry);
    expect(registry.get('sb')).toBeInstanceOf(NgbSidebarComponent);
    expect(registry.toggle('sb')).toBe(true);
    render();
    expect(host.open()).toBe(false);
    expect(registry.toggle('missing')).toBe(false);
  });

  it('icon mode shows tooltips as title only while collapsed', () => {
    expect(el('#home').getAttribute('title')).toBeNull();
    host.open.set(false);
    render();
    expect(el('#home').getAttribute('title')).toBe('Home');
  });

  it('offcanvas collapsed is inert and pushes nothing', () => {
    host.collapsible.set('offcanvas');
    host.open.set(false);
    render();
    expect(el('aside').hasAttribute('inert')).toBe(true);
    expect(sidebar().classList).not.toContain('ngb-sidebar-pushing');
  });

  it("collapsible='none' cannot be collapsed", () => {
    host.collapsible.set('none');
    render();
    el('#trigger').click();
    render();
    expect(host.open()).toBe(true);
    expect(sidebar().dataset['state']).toBe('expanded');
  });

  it('keyboard shortcut toggles; null disables it', () => {
    key('b', { ctrlKey: true });
    render();
    expect(host.open()).toBe(false);
    key('B', { metaKey: true });
    render();
    expect(host.open()).toBe(true);
    host.shortcut.set(null);
    render();
    key('b', { ctrlKey: true });
    render();
    expect(host.open()).toBe(true);
  });

  it('Escape closes only a dismissable overlay', () => {
    key('Escape');
    render();
    expect(host.open()).toBe(true); // not an overlay
    host.overlay.set(true);
    render();
    key('Escape');
    render();
    expect(host.open()).toBe(false);
    host.open.set(true);
    host.dismissable.set(false);
    render();
    key('Escape');
    render();
    expect(host.open()).toBe(true);
  });

  it('overlay + backdrop renders a layout backdrop that dismisses', () => {
    host.overlay.set(true);
    host.backdrop.set(true);
    render();
    expect(sidebar().classList).not.toContain('ngb-sidebar-pushing');
    expect(sidebar().classList).toContain('ngb-sidebar-floating-panel');
    const backdrop = el('ngb-sidebar-layout > .ngb-sidebar-backdrop');
    expect(backdrop).not.toBeNull();
    backdrop.click();
    render();
    expect(host.open()).toBe(false);
    expect(el('ngb-sidebar-layout > .ngb-sidebar-backdrop')).toBeNull();
  });

  it('openOnHover expands a collapsed sidebar while hovered', async () => {
    host.openOnHover.set(true);
    host.open.set(false);
    render();
    el('aside').dispatchEvent(new MouseEvent('mouseenter'));
    render();
    expect(sidebar().dataset['state']).toBe('expanded');
    expect(host.open()).toBe(false);
    el('aside').dispatchEvent(new MouseEvent('mouseleave'));
    await new Promise((r) => setTimeout(r, 200));
    render();
    expect(sidebar().dataset['state']).toBe('collapsed');
  });

  it('inset variant marks the layout', () => {
    host.variant.set('inset');
    render();
    expect(el('ngb-sidebar-layout').classList).toContain('ngb-sidebar-layout-inset');
  });

  it('persists open state with stateKey', () => {
    host.stateKey.set('test-sb');
    render();
    host.open.set(false);
    render();
    expect(localStorage.getItem('test-sb')).toBe('false');
  });

  it('collapsible menu items toggle their sub menu via the button', () => {
    const parent = el('#parent');
    const item = parent.parentElement!;
    expect(item.dataset['open']).toBe('false');
    expect(parent.getAttribute('aria-expanded')).toBe('false');
    parent.click();
    render();
    expect(host.itemOpen()).toBe(true);
    expect(item.dataset['open']).toBe('true');
    expect(parent.getAttribute('aria-expanded')).toBe('true');
  });

  it('active button has aria-current and data-active; badges and roles render', () => {
    const home = el('#home');
    expect(home.getAttribute('aria-current')).toBe('page');
    expect(home.hasAttribute('data-active')).toBe(true);
    expect(el('ngb-sidebar-menu').getAttribute('role')).toBe('list');
    expect(el('ngb-sidebar-menu-item').getAttribute('role')).toBe('listitem');
    expect(el('ngb-sidebar-menu-badge').textContent).toContain('5');
  });

  it('collapsible group folds via its label (click and keyboard)', () => {
    const label = el('ngb-sidebar-group-label');
    expect(label.getAttribute('role')).toBe('button');
    label.click();
    render();
    expect(host.groupOpen()).toBe(false);
    label.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    render();
    expect(host.groupOpen()).toBe(true);
  });

  it('collapsible group labels render a chevron automatically', () => {
    const label = el('ngb-sidebar-group-label');
    expect(label.querySelector('.ngb-sidebar-group-chevron-auto')).not.toBeNull();
  });

  it('exposes VERSION', () => {
    expect(NgbSidebarComponent.VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});

@Component({
  standalone: true,
  imports: [...NGB_SIDEBAR],
  template: `
    <ngb-sidebar-layout [fill]="false">
      <ngb-sidebar>
        <ngb-sidebar-nav
          [model]="model"
          [(activeItem)]="active"
          [accordion]="accordion()"
          (itemClick)="clicks.push($event.item.label!)"
          (actionClick)="actions.push($event.item.label!)"
        />
      </ngb-sidebar>
    </ngb-sidebar-layout>
  `,
})
class NavHost {
  accordion = signal(false);
  active = signal<NgbSidebarMenuItem | null>(null);
  clicks: string[] = [];
  actions: string[] = [];
  commandCalls = 0;
  model: NgbSidebarMenuItem[] = [
    {
      group: true,
      label: 'Main',
      items: [
        { id: 'home', label: 'Home', icon: 'bi bi-house', badge: 3 },
        {
          id: 'a',
          label: 'A',
          items: [
            { id: 'a1', label: 'A1', items: [{ id: 'a1x', label: 'A1x', active: true }] },
            { id: 'a2', label: 'A2', disabled: true },
          ],
        },
        { id: 'b', label: 'B', items: [{ id: 'b1', label: 'B1' }] },
        { id: 'hidden', label: 'Hidden', visible: false },
        { id: 'cmd', label: 'Cmd', command: () => this.commandCalls++, actionIcon: 'bi bi-x' },
        { id: 'link', label: 'Link', url: 'https://example.com', target: '_blank' },
      ],
    },
    { separator: true },
  ];
}

describe('NgbSidebarNavComponent', () => {
  let fixture: ComponentFixture<NavHost>;
  let host: NavHost;
  const render = () => {
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
  };
  const buttonOf = (label: string) =>
    Array.from(
      fixture.nativeElement.querySelectorAll(
        '.ngb-sidebar-menu-button, .ngb-sidebar-menu-sub-button',
      ) as NodeListOf<HTMLElement>,
    ).find((b) => b.textContent!.trim() === label)!;
  const isOpen = (label: string) => buttonOf(label).parentElement!.dataset['open'] === 'true';

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [NavHost] }).compileComponents();
    fixture = TestBed.createComponent(NavHost);
    host = fixture.componentInstance;
    render();
  });

  afterEach(() => fixture.destroy());

  it('renders groups, separators, badges, links and hides invisible items', () => {
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('ngb-sidebar-group-label')!.textContent).toContain('Main');
    expect(root.querySelector('ngb-sidebar-separator')).not.toBeNull();
    expect(root.querySelector('ngb-sidebar-menu-badge')!.textContent).toContain('3');
    expect(buttonOf('Hidden')).toBeUndefined();
    const link = buttonOf('Link') as HTMLAnchorElement;
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('https://example.com');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('initialises active item from flags and expands its ancestors', () => {
    expect(host.active()?.id).toBe('a1x');
    expect(isOpen('A')).toBe(true);
    expect(isOpen('A1')).toBe(true);
    expect(buttonOf('A1x').getAttribute('aria-current')).toBe('page');
    expect(buttonOf('A').parentElement!.hasAttribute('data-active-child')).toBe(true);
  });

  it('clicking a parent toggles it; clicking a leaf activates it and emits', () => {
    buttonOf('B').click();
    render();
    expect(isOpen('B')).toBe(true);
    buttonOf('B1').click();
    render();
    expect(host.active()?.id).toBe('b1');
    expect(host.clicks).toEqual(['B', 'B1']);
  });

  it('accordion keeps one sibling open', () => {
    host.accordion.set(true);
    render();
    buttonOf('B').click();
    render();
    expect(isOpen('B')).toBe(true);
    expect(isOpen('A')).toBe(false);
  });

  it('runs commands, emits actionClick and ignores disabled items', () => {
    buttonOf('Cmd').click();
    render();
    expect(host.commandCalls).toBe(1);
    (fixture.nativeElement.querySelector('.ngb-sidebar-menu-action') as HTMLElement).click();
    expect(host.actions).toEqual(['Cmd']);
    expect((buttonOf('A2') as HTMLButtonElement).disabled).toBe(true);
  });
});

@Component({
  standalone: true,
  imports: [...NGB_SIDEBAR],
  template: `
    <ngb-sidebar-layout [fill]="false">
      <ngb-sidebar
        id="m"
        collapsible="icon"
        variant="floating"
        [breakpoint]="768"
        [mobile]="mobile()"
        [(open)]="open"
      >
        <ngb-sidebar-menu>
          <ngb-sidebar-menu-item>
            <button id="leaf" ngbSidebarMenuButton>Leaf</button>
          </ngb-sidebar-menu-item>
          <ngb-sidebar-menu-item>
            <button id="keep" ngbSidebarMenuButton keepOpen>Keep</button>
          </ngb-sidebar-menu-item>
          <ngb-sidebar-menu-item>
            <button id="dd" ngbSidebarMenuButton data-bs-toggle="dropdown">Dropdown</button>
          </ngb-sidebar-menu-item>
        </ngb-sidebar-menu>
      </ngb-sidebar>
      <ngb-sidebar-main />
    </ngb-sidebar-layout>
  `,
})
class MobileHost {
  open = signal(true);
  mobile = signal<Partial<NgbSidebarMobileOptions>>({});
}

describe('NgbSidebar mobile behavior', () => {
  let matches = false;
  let listeners: ((e: { matches: boolean }) => void)[] = [];
  const original = globalThis.matchMedia;
  let fixture: ComponentFixture<MobileHost>;
  let host: MobileHost;
  const el = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement;
  const render = () => {
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
  };
  const setViewport = (mobile: boolean) => {
    matches = mobile;
    listeners.forEach((l) => l({ matches: mobile }));
    render();
  };

  function create(config?: Parameters<typeof provideNgbSidebarConfig>[0]) {
    TestBed.configureTestingModule({
      imports: [MobileHost],
      providers: config ? [provideNgbSidebarConfig(config)] : [],
    });
    fixture = TestBed.createComponent(MobileHost);
    host = fixture.componentInstance;
    render();
  }

  beforeEach(() => {
    matches = false;
    listeners = [];
    globalThis.matchMedia = ((query: string) => ({
      get matches() {
        return matches;
      },
      media: query,
      addEventListener: (_: string, l: (e: { matches: boolean }) => void) => listeners.push(l),
      removeEventListener: (_: string, l: (e: { matches: boolean }) => void) =>
        (listeners = listeners.filter((x) => x !== l)),
    })) as unknown as typeof matchMedia;
  });

  afterEach(() => {
    fixture?.destroy();
    globalThis.matchMedia = original;
  });

  it('uses the default mobile behavior below the breakpoint and restores desktop state', () => {
    create();
    const sb = el('ngb-sidebar');
    expect(sb.dataset['mobile']).toBeUndefined();
    setViewport(true);
    expect(sb.dataset['mobile']).toBe('true');
    expect(sb.dataset['collapsible']).toBe('offcanvas');
    expect(sb.dataset['variant']).toBe('sidebar');
    expect(sb.classList).toContain('ngb-sidebar-overlay');
    expect(sb.style.getPropertyValue('--ngb-sidebar-width')).toBe('18rem');
    expect(host.open()).toBe(false); // defaultOpen: false
    host.open.set(true);
    render();
    expect(el('ngb-sidebar-layout > .ngb-sidebar-backdrop')).not.toBeNull();
    setViewport(false);
    expect(host.open()).toBe(true); // desktop state restored
    expect(sb.dataset['collapsible']).toBe('icon');
    expect(sb.dataset['variant']).toBe('floating');
  });

  it('closes after navigating on mobile, but not for keepOpen or dropdown toggles', () => {
    create();
    setViewport(true);
    host.open.set(true);
    render();
    el('#keep').click();
    el('#dd').click();
    render();
    expect(host.open()).toBe(true);
    el('#leaf').click();
    render();
    expect(host.open()).toBe(false);
  });

  it('does not close after navigating on desktop', () => {
    create();
    el('#leaf').click();
    render();
    expect(host.open()).toBe(true);
  });

  it('applies the mobile input settings', () => {
    create();
    host.mobile.set({
      collapsible: 'icon',
      overlay: false,
      backdrop: false,
      defaultOpen: true,
      closeOnNavigate: false,
      side: 'right',
      width: '80%',
      variant: null,
    });
    render();
    setViewport(true);
    const sb = el('ngb-sidebar');
    expect(host.open()).toBe(true);
    expect(sb.dataset['collapsible']).toBe('icon');
    expect(sb.dataset['side']).toBe('right');
    expect(sb.dataset['variant']).toBe('floating');
    expect(sb.classList).not.toContain('ngb-sidebar-overlay');
    expect(sb.style.getPropertyValue('--ngb-sidebar-width')).toBe('80%');
    expect(el('ngb-sidebar-layout > .ngb-sidebar-backdrop')).toBeNull();
    el('#leaf').click();
    render();
    expect(host.open()).toBe(true);
  });

  it('takes app-wide defaults from provideNgbSidebarConfig', () => {
    create({ mobile: { defaultOpen: true, side: 'right' } });
    setViewport(true);
    expect(host.open()).toBe(true);
    expect(el('ngb-sidebar').dataset['side']).toBe('right');
  });
});

@Component({
  standalone: true,
  imports: [...NGB_SIDEBAR],
  template: `
    <ngb-sidebar-layout [fill]="false">
      <ngb-sidebar
        [collapsible]="collapsible()"
        [swipe]="swipe()"
        [(open)]="open"
        [keyboardShortcut]="null"
      >
        <ngb-sidebar-content><span id="inside">x</span></ngb-sidebar-content>
      </ngb-sidebar>
      <ngb-sidebar-main><span id="outside">y</span></ngb-sidebar-main>
    </ngb-sidebar-layout>
  `,
})
class SwipeHostCmp {
  open = signal(false);
  swipe = signal(true);
  collapsible = signal<SidebarCollapsible>('offcanvas');
}

describe('NgbSidebar swipe gestures', () => {
  let fixture: ComponentFixture<SwipeHostCmp>;
  let host: SwipeHostCmp;
  const render = () => {
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
  };
  const touch = (type: string, target: Element, x: number, y = 100) => {
    const e = new Event(type, { bubbles: true });
    const list = type === 'touchend' ? [] : [{ clientX: x, clientY: y }];
    Object.defineProperty(e, 'touches', { value: list });
    target.dispatchEvent(e);
  };
  const swipe = (target: Element, from: number, to: number, y0 = 100, y1 = 100) => {
    touch('touchstart', target, from, y0);
    touch('touchmove', target, from + (to - from) / 2, (y0 + y1) / 2);
    touch('touchmove', target, to, y1);
    touch('touchend', target, to, y1);
    render();
  };
  const el = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SwipeHostCmp] }).compileComponents();
    fixture = TestBed.createComponent(SwipeHostCmp);
    host = fixture.componentInstance;
    render();
  });

  afterEach(() => fixture.destroy());

  it('opens with an inward swipe that starts at the edge', () => {
    swipe(el('#outside'), 5, 200);
    expect(host.open()).toBe(true);
  });

  it('ignores swipes that start away from the edge', () => {
    swipe(el('#outside'), 120, 300);
    expect(host.open()).toBe(false);
  });

  it('ignores vertical gestures (scrolling)', () => {
    swipe(el('#outside'), 5, 20, 100, 400);
    expect(host.open()).toBe(false);
  });

  it('closes when the open panel is swiped back toward its edge', () => {
    host.open.set(true);
    render();
    swipe(el('#inside'), 200, 20);
    expect(host.open()).toBe(false);
  });

  it('does not close when swiping inward on the open panel', () => {
    host.open.set(true);
    render();
    swipe(el('#inside'), 20, 200);
    expect(host.open()).toBe(true);
  });

  it('opens a collapsed icon rail by swiping on it', () => {
    host.collapsible.set('icon');
    render();
    swipe(el('#inside'), 60, 250);
    expect(host.open()).toBe(true);
  });

  it('can be disabled with [swipe]="false"', () => {
    host.swipe.set(false);
    render();
    swipe(el('#outside'), 5, 200);
    expect(host.open()).toBe(false);
  });

  it("does nothing when collapsible='none'", () => {
    host.collapsible.set('none');
    render();
    swipe(el('#outside'), 5, 200);
    expect(host.open()).toBe(false);
  });

  it('clears the inline drag styles after the gesture', () => {
    swipe(el('#outside'), 5, 200);
    const aside = el('aside');
    expect(aside.style.transform).toBe('');
    expect(aside.style.transition).toBe('');
  });
});

@Component({
  standalone: true,
  imports: [...NGB_SIDEBAR],
  template: `
    <ngb-sidebar-layout [fill]="false">
      <ngb-sidebar [(open)]="a" [keyboardShortcut]="null" />
      <ngb-sidebar-main><span id="in-a">a</span></ngb-sidebar-main>
    </ngb-sidebar-layout>
    <ngb-sidebar-layout [fill]="false">
      <ngb-sidebar [(open)]="b" [keyboardShortcut]="null" />
      <ngb-sidebar-main><span id="in-b">b</span></ngb-sidebar-main>
    </ngb-sidebar-layout>
  `,
})
class TwoLayoutsCmp {
  a = signal(false);
  b = signal(false);
}

describe('NgbSidebar swipe with several layouts', () => {
  it('only opens the sidebar of the layout the swipe started in', async () => {
    await TestBed.configureTestingModule({ imports: [TwoLayoutsCmp] }).compileComponents();
    const fixture = TestBed.createComponent(TwoLayoutsCmp);
    fixture.detectChanges();
    const target = fixture.nativeElement.querySelector('#in-b') as HTMLElement;
    for (const [type, x] of [
      ['touchstart', 5],
      ['touchmove', 100],
      ['touchmove', 200],
      ['touchend', 200],
    ] as const) {
      const e = new Event(type, { bubbles: true });
      Object.defineProperty(e, 'touches', {
        value: type === 'touchend' ? [] : [{ clientX: x, clientY: 50 }],
      });
      target.dispatchEvent(e);
    }
    fixture.detectChanges();
    expect(fixture.componentInstance.b()).toBe(true);
    expect(fixture.componentInstance.a()).toBe(false);
    fixture.destroy();
  });
});
