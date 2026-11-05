import { NgModule } from '@angular/core';
import { NgbSidebarComponent } from './sidebar.component';
import {
  NgbSidebarBackdropComponent,
  NgbSidebarLayoutComponent,
  NgbSidebarMainComponent,
} from './sidebar-layout';
import {
  NgbSidebarContentComponent,
  NgbSidebarFooterComponent,
  NgbSidebarGroupActionDirective,
  NgbSidebarGroupComponent,
  NgbSidebarGroupContentComponent,
  NgbSidebarGroupLabelComponent,
  NgbSidebarHeaderComponent,
  NgbSidebarMenuActionDirective,
  NgbSidebarMenuBadgeComponent,
  NgbSidebarMenuButtonDirective,
  NgbSidebarMenuComponent,
  NgbSidebarMenuItemComponent,
  NgbSidebarMenuSubButtonDirective,
  NgbSidebarMenuSubComponent,
  NgbSidebarRailDirective,
  NgbSidebarSeparatorComponent,
  NgbSidebarTriggerDirective,
} from './sidebar-parts';
import { NgbSidebarNavComponent, NgbSidebarNavItemDirective } from './sidebar-nav.component';

/** Every standalone building block of the sidebar — spread into a component's `imports`. */
export const NGB_SIDEBAR = [
  NgbSidebarLayoutComponent,
  NgbSidebarMainComponent,
  NgbSidebarBackdropComponent,
  NgbSidebarComponent,
  NgbSidebarHeaderComponent,
  NgbSidebarContentComponent,
  NgbSidebarFooterComponent,
  NgbSidebarSeparatorComponent,
  NgbSidebarGroupComponent,
  NgbSidebarGroupLabelComponent,
  NgbSidebarGroupActionDirective,
  NgbSidebarGroupContentComponent,
  NgbSidebarMenuComponent,
  NgbSidebarMenuItemComponent,
  NgbSidebarMenuSubComponent,
  NgbSidebarMenuButtonDirective,
  NgbSidebarMenuSubButtonDirective,
  NgbSidebarMenuBadgeComponent,
  NgbSidebarMenuActionDirective,
  NgbSidebarTriggerDirective,
  NgbSidebarRailDirective,
  NgbSidebarNavComponent,
  NgbSidebarNavItemDirective,
] as const;

/** NgModule bundling all sidebar parts, for apps that still use modules. */
@NgModule({ imports: [...NGB_SIDEBAR], exports: [...NGB_SIDEBAR] })
export class NgbSidebarModule {}
