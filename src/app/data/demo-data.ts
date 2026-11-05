import { NgbSidebarMenuItem } from '@amro93/ngb-sidebar';

export interface NavSubItem {
  label: string;
  isActive?: boolean;
}

export interface NavItem {
  icon: string;
  label: string;
  isActive?: boolean;
  badge?: string;
  subItems?: NavSubItem[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Grouped navigation used by most of the hand-composed examples. */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Navigation',
    items: [
      { icon: 'bi bi-house', label: 'Home', isActive: true },
      { icon: 'bi bi-inbox', label: 'Inbox', badge: '12' },
      { icon: 'bi bi-search', label: 'Search' },
      { icon: 'bi bi-bell', label: 'Notifications', badge: '3' },
    ],
  },
  {
    label: 'Projects',
    items: [
      {
        icon: 'bi bi-bar-chart',
        label: 'Analytics',
        subItems: [{ label: 'Overview' }, { label: 'Reports' }, { label: 'Real-time' }],
      },
      { icon: 'bi bi-people', label: 'Team' },
      { icon: 'bi bi-calendar3', label: 'Calendar' },
      {
        icon: 'bi bi-folder',
        label: 'Documents',
        subItems: [{ label: 'Shared' }, { label: 'Private' }, { label: 'Archived' }],
      },
    ],
  },
  {
    label: 'Billing',
    items: [
      { icon: 'bi bi-credit-card', label: 'Payments' },
      { icon: 'bi bi-cart', label: 'Orders' },
      { icon: 'bi bi-star', label: 'Subscriptions' },
    ],
  },
];

export interface Workspace {
  name: string;
  plan: string;
  logo: string;
  color: string;
}

export const WORKSPACES: Workspace[] = [
  {
    name: 'Acme Inc',
    plan: 'Enterprise',
    logo: 'A',
    color: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
  },
  { name: 'Globex', plan: 'Startup', logo: 'G', color: 'linear-gradient(135deg,#059669,#10b981)' },
  { name: 'Initech', plan: 'Free', logo: 'I', color: 'linear-gradient(135deg,#ea580c,#f59e0b)' },
];

/** File-manager tree for the nested-menu example (unlimited depth). */
export const FILE_TREE: NgbSidebarMenuItem[] = [
  {
    group: true,
    label: 'Files',
    items: [
      {
        label: 'Documents',
        icon: 'bi bi-folder',
        items: [
          {
            label: 'Work',
            icon: 'bi bi-folder',
            items: [
              {
                label: 'Projects',
                icon: 'bi bi-folder',
                items: [
                  { label: 'Q1 Report', icon: 'bi bi-file-earmark-text', active: true },
                  { label: 'Q2 Report', icon: 'bi bi-file-earmark-text' },
                  { label: 'Roadmap', icon: 'bi bi-file-earmark-richtext' },
                ],
              },
              { label: 'Invoices', icon: 'bi bi-receipt' },
              { label: 'Contracts', icon: 'bi bi-file-earmark-lock' },
            ],
          },
          {
            label: 'Personal',
            icon: 'bi bi-folder',
            items: [{ label: 'Taxes 2026', icon: 'bi bi-file-earmark' }],
          },
        ],
      },
      {
        label: 'Media',
        icon: 'bi bi-image',
        items: [
          { label: 'Photos', icon: 'bi bi-camera' },
          { label: 'Videos', icon: 'bi bi-camera-video' },
        ],
      },
      { label: 'Websites', icon: 'bi bi-globe' },
    ],
  },
];

export interface ChatEntry {
  title: string;
  active?: boolean;
}

export interface ChatGroup {
  label: string;
  chats: ChatEntry[];
}

export const CHAT_HISTORY: ChatGroup[] = [
  {
    label: 'Today',
    chats: [
      { title: 'Sidebar component design', active: true },
      { title: 'Using Angular signals' },
      { title: 'Fix TypeScript generics issue' },
    ],
  },
  {
    label: 'Yesterday',
    chats: [{ title: 'Design system architecture' }, { title: 'CSS light-dark() usage' }],
  },
  {
    label: 'Previous 7 days',
    chats: [
      { title: 'Build a dashboard layout' },
      { title: 'Bootstrap 5.3 color modes' },
      { title: 'Node.js API authentication' },
      { title: 'Monorepo setup with npm workspaces' },
    ],
  },
  {
    label: 'Previous 30 days',
    chats: [
      { title: 'GraphQL schema design' },
      { title: 'WebSocket real-time updates' },
      { title: 'PostgreSQL query optimization' },
    ],
  },
];
