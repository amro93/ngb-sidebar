import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NGB_SIDEBAR } from '@amro93/ngb-sidebar';
import { CHAT_HISTORY, ChatEntry, ChatGroup } from '../data/demo-data';

const HTML = `
<div class="demo-frame">
  <ngb-sidebar-layout [fill]="false">
    <ngb-sidebar id="chat-demo" collapsible="offcanvas" [breakpoint]="768" [keyboardShortcut]="null"
                 ariaLabel="Chat history">
      <ngb-sidebar-header>
        <div class="d-flex align-items-center gap-2 px-2">
          <i class="bi bi-chat-square-dots fs-5 text-primary"></i>
          <strong>Chat</strong>
          <button class="btn btn-sm btn-light ms-auto" ngbSidebarTrigger aria-label="Close sidebar">
            <i class="bi bi-layout-sidebar"></i>
          </button>
        </div>
        <ngb-sidebar-menu>
          <ngb-sidebar-menu-item>
            <button ngbSidebarMenuButton (click)="newChat()"><i class="bi bi-pencil-square"></i><span>New chat</span></button>
          </ngb-sidebar-menu-item>
        </ngb-sidebar-menu>
        <div class="px-1">
          <input class="form-control form-control-sm" placeholder="Search chats…" aria-label="Search chats"
                 [value]="query()" (input)="query.set($any($event.target).value)" />
        </div>
      </ngb-sidebar-header>

      <ngb-sidebar-content>
        @for (group of filtered(); track group.label) {
          <ngb-sidebar-group>
            <ngb-sidebar-group-label>{{ group.label }}</ngb-sidebar-group-label>
            <ngb-sidebar-group-content>
              <ngb-sidebar-menu>
                @for (chat of group.chats; track chat.title) {
                  <ngb-sidebar-menu-item>
                    <button ngbSidebarMenuButton [isActive]="chat === active()" (click)="active.set(chat)">
                      <span>{{ chat.title }}</span>
                    </button>
                    <button ngbSidebarMenuAction showOnHover aria-label="Delete chat"
                            (click)="remove(group, chat)">
                      <i class="bi bi-trash3"></i>
                    </button>
                  </ngb-sidebar-menu-item>
                }
              </ngb-sidebar-menu>
            </ngb-sidebar-group-content>
          </ngb-sidebar-group>
        } @empty {
          <p class="small text-body-secondary px-3">No chats found.</p>
        }
      </ngb-sidebar-content>

      <ngb-sidebar-footer>
        <ngb-sidebar-menu>
          <ngb-sidebar-menu-item>
            <button ngbSidebarMenuButton><span class="demo-avatar">JD</span><span>John Doe</span></button>
          </ngb-sidebar-menu-item>
        </ngb-sidebar-menu>
      </ngb-sidebar-footer>
    </ngb-sidebar>

    <ngb-sidebar-main>
      <header class="demo-topbar">
        <button class="btn btn-sm btn-light" ngbSidebarTrigger aria-label="Open sidebar">
          <i class="bi bi-layout-sidebar"></i>
        </button>
        <strong class="small text-truncate">{{ active()?.title ?? 'New chat' }}</strong>
      </header>
      <div class="demo-body justify-content-end">
        <div class="align-self-end bg-primary text-white rounded-3 px-3 py-2 small">How do I build a sidebar?</div>
        <div class="bg-body-tertiary rounded-3 px-3 py-2 small">Use &lt;ngb-sidebar&gt; inside &lt;ngb-sidebar-layout&gt;…</div>
        <div class="input-group">
          <input class="form-control" placeholder="Message…" aria-label="Message" />
          <button class="btn btn-primary" aria-label="Send"><i class="bi bi-arrow-up"></i></button>
        </div>
      </div>
    </ngb-sidebar-main>
  </ngb-sidebar-layout>
</div>
`;

const TS = `
import { Component, computed, signal } from '@angular/core';
import { NGB_SIDEBAR } from '@amro93/ngb-sidebar';

interface ChatEntry { title: string }
interface ChatGroup { label: string; chats: ChatEntry[] }

@Component({
  selector: 'app-chat-demo',
  imports: [...NGB_SIDEBAR],
  templateUrl: './chat-demo.html',
})
export class ChatDemo {
  history = signal<ChatGroup[]>([
    { label: 'Today', chats: [{ title: 'Sidebar component design' }, { title: 'Using Angular signals' }] },
    { label: 'Yesterday', chats: [{ title: 'Design system architecture' }] },
    // …
  ]);
  active = signal<ChatEntry | null>(this.history()[0].chats[0]);
  query = signal('');

  filtered = computed(() => {
    const q = this.query().toLowerCase();
    return this.history()
      .map((g) => ({ ...g, chats: g.chats.filter((c) => c.title.toLowerCase().includes(q)) }))
      .filter((g) => g.chats.length);
  });

  newChat() {
    const chat = { title: 'New chat' };
    this.history.update(([today, ...rest]) => [{ ...today, chats: [chat, ...today.chats] }, ...rest]);
    this.active.set(chat);
  }

  remove(group: ChatGroup, chat: ChatEntry) {
    this.history.update((h) =>
      h.map((g) => (g.label === group.label ? { ...g, chats: g.chats.filter((c) => c !== chat) } : g)),
    );
  }
}
`;

@Component({
  selector: 'app-chat-demo',
  standalone: true,
  imports: [...NGB_SIDEBAR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: HTML,
})
export class ChatDemo {
  static readonly html = HTML;
  static readonly ts = TS;

  history = signal<ChatGroup[]>(CHAT_HISTORY.map((g) => ({ ...g, chats: [...g.chats] })));
  active = signal<ChatEntry | null>(this.history()[0].chats[0]);
  query = signal('');

  filtered = computed(() => {
    const q = this.query().toLowerCase();
    return this.history()
      .map((g) => ({ ...g, chats: g.chats.filter((c) => c.title.toLowerCase().includes(q)) }))
      .filter((g) => g.chats.length);
  });

  newChat(): void {
    const chat = { title: 'New chat' };
    this.history.update(([today, ...rest]) => [
      { ...today, chats: [chat, ...today.chats] },
      ...rest,
    ]);
    this.active.set(chat);
  }

  remove(group: ChatGroup, chat: ChatEntry): void {
    this.history.update((h) =>
      h.map((g) =>
        g.label === group.label ? { ...g, chats: g.chats.filter((c) => c !== chat) } : g,
      ),
    );
  }
}
