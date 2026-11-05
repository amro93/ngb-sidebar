import { NGB_SIDEBAR_VERSION } from '../version';
export const NGB_DRAWER_VERSION = NGB_SIDEBAR_VERSION;

/** Edge of the viewport the sidebar slides in from. */
export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom' | 'full';

/** Where the sidebar DOM is attached: 'body', 'self' (in place) or a specific element. */
export type DrawerAppendTo = 'body' | 'self' | HTMLElement | null | undefined;

export interface DrawerHideEvent {
  /** What caused the sidebar to close. */
  reason: 'close-button' | 'escape' | 'mask' | 'programmatic';
}
