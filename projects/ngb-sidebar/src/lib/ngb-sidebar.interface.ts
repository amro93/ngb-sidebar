export const NGB_SIDEBAR_VERSION = '0.1.0';

/** Edge of the viewport the sidebar slides in from. */
export type SidebarPosition = 'left' | 'right' | 'top' | 'bottom' | 'full';

/** Where the sidebar DOM is attached: 'body', 'self' (in place) or a specific element. */
export type SidebarAppendTo = 'body' | 'self' | HTMLElement | null | undefined;

export interface SidebarHideEvent {
  /** What caused the sidebar to close. */
  reason: 'close-button' | 'escape' | 'mask' | 'programmatic';
}
