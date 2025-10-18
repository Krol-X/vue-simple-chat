// Базовые типы для мессенджера
export interface Dialog {
  id: number
  title: string
  type?: 'chat' | 'channel'
  preview?: string
  lastTime?: string
}

export interface Message {
  id: number
  dialogId: number
  from: 'me' | 'other'
  author?: string
  text: string
  createdAt: Date
}

export interface Theme {
  '--tx-first': string
  '--tx-second': string
  '--bg-first': string
  '--bg-second': string
  '--bg-accent': string
}

export interface ThemeConfig {
  light: Theme
  dark: Theme
}

// UI состояния
export interface UIState {
  isOpen: boolean
  isMenuOpen: boolean
  isContextMenuOpen: boolean
  isEmojiMenuOpen: boolean
  currentTab: 'chats' | 'channels'
  activeDialogId: number | null
}

// Действия для stores
export interface MessengerActions {
  addDialog: (dialog: Omit<Dialog, 'id'>) => number
  addMessage: (dialogId: number, message: Omit<Message, 'id' | 'dialogId'>) => void
  openDialog: (dialogId: number) => void
  sendMessage: (text: string) => void
  updateDialogPreview: (dialogId: number, previewText: string, createdAt: Date) => void
}

export interface UIActions {
  togglePanel: () => void
  closePanel: () => void
  toggleMenu: () => void
  closeMenu: () => void
  toggleContextMenu: () => void
  closeContextMenu: () => void
  toggleEmojiMenu: () => void
  closeEmojiMenu: () => void
  setTab: (tab: 'chats' | 'channels') => void
  setActiveDialog: (dialogId: number | null) => void
}

export interface ThemeActions {
  applyTheme: (themeName: string) => void
  toggleTheme: () => void
  addCustomTheme: (name: string, theme: Theme) => void
}
