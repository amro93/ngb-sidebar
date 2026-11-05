import { Injectable, InjectionToken, signal } from '@angular/core';
import type { NgbSidebarComponent } from './sidebar.component';

/** Global registry used by `ngbSidebarTrigger[target]` to find sidebars by id. */
@Injectable({ providedIn: 'root' })
export class NgbSidebarRegistry {
  private readonly map = signal<ReadonlyMap<string, NgbSidebarComponent>>(new Map());

  register(id: string, sidebar: NgbSidebarComponent): void {
    this.map.update((m) => new Map(m).set(id, sidebar));
  }

  unregister(id: string, sidebar: NgbSidebarComponent): void {
    if (this.map().get(id) !== sidebar) return;
    this.map.update((m) => {
      const n = new Map(m);
      n.delete(id);
      return n;
    });
  }

  get(id: string): NgbSidebarComponent | undefined {
    return this.map().get(id);
  }

  /** Toggle a sidebar by id. Returns false when no sidebar is registered under that id. */
  toggle(id: string): boolean {
    const s = this.get(id);
    s?.toggle();
    return !!s;
  }
}

/** Shared state of a `<ngb-sidebar-layout>`, injected by its sidebars, triggers and backdrop. */
export interface NgbSidebarLayoutContext {
  readonly sidebars: () => readonly NgbSidebarComponent[];
  add(s: NgbSidebarComponent): void;
  remove(s: NgbSidebarComponent): void;
}

export const NGB_SIDEBAR_LAYOUT = new InjectionToken<NgbSidebarLayoutContext>('NGB_SIDEBAR_LAYOUT');
