import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { APP_VERSION } from '../version';
import { ApiReferenceComponent } from './components/api-reference.component';
import { ExampleCardComponent } from './components/example-card.component';
import {
  DemoLink,
  FooterComponent,
  HeroSectionComponent,
  NavbarComponent,
  QuickNavComponent,
} from './components/shell.components';
import { ChatDemo } from './demos/chat-demo';
import { ConfigDemo } from './demos/config-demo';
import { DrawerDemo } from './demos/drawer-demo';
import { DualDemo } from './demos/dual-demo';
import { MenuDemo } from './demos/menu-demo';
import { ModelDemo } from './demos/model-demo';
import { MultiDemo } from './demos/multi-demo';
import { NestedDemo } from './demos/nested-demo';
import { ResponsiveDemo } from './demos/responsive-demo';
import { RtlDemo } from './demos/rtl-demo';
import { VariantsDemo } from './demos/variants-demo';

const INSTALL = `npm install @amro93/ngb-sidebar bootstrap bootstrap-icons`;

const QUICK_START = `<ngb-sidebar-layout>
  <ngb-sidebar id="main" collapsible="icon">
    <ngb-sidebar-header>…logo…</ngb-sidebar-header>
    <ngb-sidebar-content>
      <ngb-sidebar-group>
        <ngb-sidebar-group-label>Navigation</ngb-sidebar-group-label>
        <ngb-sidebar-group-content>
          <ngb-sidebar-menu>
            <ngb-sidebar-menu-item>
              <a ngbSidebarMenuButton href="/home" isActive tooltip="Home">
                <i class="bi bi-house"></i><span>Home</span>
              </a>
            </ngb-sidebar-menu-item>
          </ngb-sidebar-menu>
        </ngb-sidebar-group-content>
      </ngb-sidebar-group>
    </ngb-sidebar-content>
    <ngb-sidebar-footer>…user…</ngb-sidebar-footer>
    <button ngbSidebarRail></button>
  </ngb-sidebar>

  <ngb-sidebar-main>
    <button class="btn btn-light" ngbSidebarTrigger target="main">
      <i class="bi bi-layout-sidebar"></i>
    </button>
    <!-- page content -->
  </ngb-sidebar-main>
</ngb-sidebar-layout>`;

const QUICK_START_TS = `import { Component } from '@angular/core';
import { NGB_SIDEBAR } from '@amro93/ngb-sidebar';

@Component({
  selector: 'app-shell',
  imports: [...NGB_SIDEBAR], // or NgbSidebarModule
  templateUrl: './shell.html',
})
export class Shell {}`;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroSectionComponent,
    QuickNavComponent,
    FooterComponent,
    ExampleCardComponent,
    ApiReferenceComponent,
    VariantsDemo,
    MenuDemo,
    ResponsiveDemo,
    DualDemo,
    MultiDemo,
    NestedDemo,
    ModelDemo,
    ChatDemo,
    ConfigDemo,
    DrawerDemo,
    RtlDemo,
  ],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly appVersion = APP_VERSION;
  readonly isDarkMode = signal(false);

  readonly install = INSTALL;
  readonly quickStart = QUICK_START;
  readonly quickStartTs = QUICK_START_TS;

  readonly demos = {
    variants: VariantsDemo,
    menu: MenuDemo,
    responsive: ResponsiveDemo,
    dual: DualDemo,
    multi: MultiDemo,
    nested: NestedDemo,
    model: ModelDemo,
    chat: ChatDemo,
    config: ConfigDemo,
    drawer: DrawerDemo,
    rtl: RtlDemo,
  };

  readonly links: DemoLink[] = [
    { id: 'getting-started', label: 'Getting Started', icon: 'bi bi-rocket-takeoff' },
    { id: 'variants', label: 'Variants Playground', icon: 'bi bi-sliders' },
    { id: 'with-menu', label: 'With Menu', icon: 'bi bi-menu-button-wide' },
    { id: 'responsive', label: 'Responsive & Mobile', icon: 'bi bi-phone' },
    { id: 'dual', label: 'Dual Sidebar', icon: 'bi bi-layout-three-columns' },
    { id: 'multi', label: 'Multi Sidebar', icon: 'bi bi-layout-sidebar-inset' },
    { id: 'nested', label: 'Nested Menu', icon: 'bi bi-diagram-3' },
    { id: 'model', label: 'Data-driven Menu', icon: 'bi bi-braces' },
    { id: 'chat', label: 'Chat Application', icon: 'bi bi-chat-dots' },
    { id: 'config', label: 'Configuration & Theming', icon: 'bi bi-palette' },
    { id: 'drawer', label: 'Drawer (overlay)', icon: 'bi bi-window-sidebar' },
    { id: 'rtl', label: 'RTL & Arabic', icon: 'bi bi-translate' },
  ];

  toggleTheme(): void {
    const dark = !this.isDarkMode();
    this.isDarkMode.set(dark);
    document.documentElement.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
  }
}
