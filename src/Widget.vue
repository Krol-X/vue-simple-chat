<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'

// Интерфейсы для типизации
interface Dialog {
  id: number
  title: string
  type?: 'chat' | 'channel'
  preview?: string
  lastTime?: string
}

interface Message {
  id: number
  dialogId: number
  from: 'me' | 'other'
  author?: string
  text: string
  createdAt: Date
}

interface Theme {
  '--tx-first': string
  '--tx-second': string
  '--bg-first': string
  '--bg-second': string
  '--bg-accent': string
}

// Состояние приложения
const isOpen = ref(false)
const isMenuOpen = ref(false)
const isContextMenuOpen = ref(false)
const isEmojiMenuOpen = ref(false)
const currentTab = ref<'chats' | 'channels'>('chats')
const activeDialogId = ref<number | null>(null)
const currentTheme = ref<'light' | 'dark'>('light')

// Данные
const dialogs = ref<Dialog[]>([])
const messagesByDialogId = reactive<Record<number, Message[]>>({})
const inputText = ref('')

// Темы
const themes: Record<string, Theme> = {
  light: {
    '--tx-first': '#000',
    '--tx-second': '#4d4d4d',
    '--bg-first': '#f8f8f8',
    '--bg-second': '#f2f2fa',
    '--bg-accent': 'rgba(179, 219, 255, 0.3)'
  },
  dark: {
    '--tx-first': '#fff',
    '--tx-second': '#b3b3b3',
    '--bg-first': '#282e33',
    '--bg-second': '#191c21',
    '--bg-accent': 'rgba(96, 104, 110, 0.3)'
  }
}

// Популярные эмодзи
const popularEmojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
  '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
  '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
  '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈',
  '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾'
]

// Вычисляемые свойства
const filteredDialogs = computed(() => {
  const showType = currentTab.value === 'channels' ? 'channel' : 'chat'
  return dialogs.value.filter(d => (d.type || 'chat') === showType)
})

const currentMessages = computed(() => {
  if (!activeDialogId.value) return []
  return messagesByDialogId[activeDialogId.value] || []
})

const currentDialog = computed(() => {
  if (!activeDialogId.value) return null
  return dialogs.value.find(d => d.id === activeDialogId.value)
})

// Утилиты
const formatTime = (date: Date) => {
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

// Методы управления панелью
const togglePanel = () => {
  isOpen.value = !isOpen.value
}

const closePanel = () => {
  isOpen.value = false
  isMenuOpen.value = false
  isContextMenuOpen.value = false
  isEmojiMenuOpen.value = false
}

// Методы управления меню
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const toggleContextMenu = () => {
  isContextMenuOpen.value = !isContextMenuOpen.value
}

const closeContextMenu = () => {
  isContextMenuOpen.value = false
}

const toggleEmojiMenu = () => {
  isEmojiMenuOpen.value = !isEmojiMenuOpen.value
}

const closeEmojiMenu = () => {
  isEmojiMenuOpen.value = false
}

// Методы управления вкладками
const setTab = (tab: 'chats' | 'channels') => {
  currentTab.value = tab
  closeMenu()
}

// Методы управления диалогами
const openDialog = (dialogId: number) => {
  activeDialogId.value = dialogId
}

const addDialog = (dialog: Omit<Dialog, 'id'>) => {
  const id = Date.now()
  const newDialog: Dialog = {
    id,
    title: dialog.title || 'Без имени',
    type: dialog.type || 'chat',
    preview: dialog.preview || '',
    lastTime: dialog.lastTime || ''
  }
  dialogs.value.push(newDialog)
  if (!messagesByDialogId[id]) {
    messagesByDialogId[id] = []
  }
  return id
}

// Методы управления сообщениями
const sendMessage = () => {
  const text = inputText.value.trim()
  if (!text) return

  if (!activeDialogId.value) {
    if (dialogs.value.length === 0) return
    const firstDialog = dialogs.value[0]
    if (!firstDialog) return
    activeDialogId.value = firstDialog.id
  }

  const dialogId = activeDialogId.value
  if (!dialogId) return
  
  if (!messagesByDialogId[dialogId]) {
    messagesByDialogId[dialogId] = []
  }

  const message: Message = {
    id: Date.now(),
    dialogId,
    from: 'me',
    author: '',
    text,
    createdAt: new Date()
  }

  messagesByDialogId[dialogId].push(message)
  inputText.value = ''
  // Очищаем contenteditable элемент
  const inputElement = document.querySelector('[data-input]') as HTMLElement
  if (inputElement) {
    inputElement.textContent = ''
  }
  updateDialogPreview(dialogId, text, message.createdAt)
}

const addMessage = (dialogId: number, message: Omit<Message, 'id' | 'dialogId'>) => {
  if (!messagesByDialogId[dialogId]) {
    messagesByDialogId[dialogId] = []
  }

  const newMessage: Message = {
    id: Date.now(),
    dialogId,
    from: message.from || 'other',
    author: message.author || '',
    text: message.text || '',
    createdAt: message.createdAt || new Date()
  }

  messagesByDialogId[dialogId].push(newMessage)
  updateDialogPreview(dialogId, newMessage.text, newMessage.createdAt)
}

const updateDialogPreview = (dialogId: number, previewText: string, createdAt: Date) => {
  const dialog = dialogs.value.find(d => d.id === dialogId)
  if (!dialog) return

  dialog.preview = previewText
  dialog.lastTime = formatTime(createdAt)
}

// Методы управления темами
const applyTheme = (themeName: string) => {
  const theme = themes[themeName]
  if (!theme) return

  currentTheme.value = themeName as 'light' | 'dark'
  
  Object.entries(theme).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value)
  })

  if (themeName === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }

  localStorage.setItem('messenger_theme', themeName)
}

const toggleTheme = () => {
  const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
  applyTheme(newTheme)
}

// Методы для эмодзи
const insertEmoji = (emoji: string) => {
  const inputElement = document.querySelector('[data-input]') as HTMLElement
  if (inputElement) {
    inputElement.textContent += emoji
    inputText.value = inputElement.textContent || ''
  }
  closeEmojiMenu()
}

// Обработчики событий
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const handleContextAction = (action: string) => {
  const dialog = currentDialog.value
  if (!dialog) return

  const userName = dialog.title
  const isChannel = dialog.type === 'channel'

  switch (action) {
    case 'profile':
      alert(`Открыть профиль: ${userName}${isChannel ? ' (канал)' : ''}`)
      break
    case 'block':
      if (isChannel) {
        alert('Невозможно заблокировать канал')
        return
      }
      if (confirm(`Заблокировать пользователя ${userName}?`)) {
        alert(`Пользователь ${userName} заблокирован`)
      }
      break
    case 'report':
      const reportType = isChannel ? 'канал' : 'пользователя'
      if (confirm(`Пожаловаться на ${reportType} ${userName}?`)) {
        alert(`Жалоба на ${reportType} ${userName} отправлена`)
      }
      break
  }
  closeContextMenu()
}

// Инициализация
onMounted(() => {
  // Восстанавливаем тему
  const savedTheme = localStorage.getItem('messenger_theme') || 'light'
  applyTheme(savedTheme)

  // Добавляем обработчик ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePanel()
    }
  })

  // Добавляем обработчик клика вне меню
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.context-menu') && 
        !target.closest('[data-open-content-menu]') &&
        !target.closest('.emoji-menu') && 
        !target.closest('[data-open-emoji]')) {
      closeContextMenu()
      closeEmojiMenu()
    }
  })
})

// Публичный API
defineExpose({
  open: () => { isOpen.value = true },
  close: closePanel,
  toggle: togglePanel,
  addDialog,
  addMessage,
  openDialog,
  setTab,
  setTheme: applyTheme,
  toggleTheme,
  getCurrentTheme: () => currentTheme.value
})
</script>

<template>
  <div class="chat-panel" :class="{ 'is-open': isOpen, 'panel-inited': true }">
    <!-- Кнопка переключения -->
    <button 
      class="chat-toggle" 
      @click="togglePanel"
      :aria-expanded="isOpen"
      title="Открыть чат"
    >
      <i class="far fa-comments"></i>
    </button>

    <!-- Основной контент -->
    <div class="layout">
      <!-- Backdrop для бокового меню -->
      <div 
        class="backdrop" 
        :class="{ 'is-visible': isMenuOpen }"
        @click="closeMenu"
      ></div>

      <!-- Боковое меню -->
      <nav class="side-menu" :class="{ 'is-open': isMenuOpen }">
        <div class="menu-section">
          <button class="menu-item" @click="closePanel" data-menu-close-panel>
            <i class="fas fa-multiply"></i>
            <span>Закрыть панель</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'is-active': currentTab === 'chats' }"
            @click="setTab('chats')"
            data-menu-chats
          >
            <i class="fas fa-comments"></i>
            <span>Чаты</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'is-active': currentTab === 'channels' }"
            @click="setTab('channels')"
            data-menu-channels
          >
            <i class="fas fa-broadcast-tower"></i>
            <span>Каналы</span>
          </button>
        </div>
        <div class="menu-footer">
          <label class="theme-toggle">
            <input 
              type="checkbox" 
              :checked="currentTheme === 'dark'"
              @change="toggleTheme"
              data-theme-toggle
            >
            <span>Тёмная тема</span>
          </label>
        </div>
      </nav>

      <!-- Экран диалогов -->
      <div 
        class="screen screen-dialogs" 
        :class="{ 'is-active': !activeDialogId }"
        data-screen="dialogs"
      >
        <div class="header">
          <div class="header-container">
            <button class="header-button" @click="toggleMenu" data-open-menu>
              <i class="fas fa-bars"></i>
            </button>
            <div class="header-text">{{ currentTab === 'channels' ? 'Каналы' : 'Диалоги' }}</div>
            <button class="header-button">
              <i class="fas fa-edit"></i>
            </button>
          </div>
        </div>
        <div class="content">
          <div class="dialogs-container" data-dialogs>
            <button 
              v-for="dialog in filteredDialogs" 
              :key="dialog.id"
              class="dialog-item" 
              @click="openDialog(dialog.id)"
              data-open-chat 
              :data-dialog-id="dialog.id"
            >
              <span class="header">
                <span class="message-from">{{ dialog.title }}</span>
                <span class="message-created-at">{{ dialog.lastTime || '' }}</span>
              </span>
              <span class="preview">{{ dialog.preview || '' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Экран чата -->
      <div 
        class="screen screen-chat" 
        :class="{ 'is-active': activeDialogId }"
        data-screen="chat"
      >
        <div class="header">
          <div class="header-container">
            <button class="header-button" @click="activeDialogId = null" data-back>
              <i class="fas fa-arrow-left"></i>
            </button>
            <div class="header-text">{{ currentDialog?.title || 'Чат' }}</div>
            <button 
              class="header-button" 
              @click="toggleContextMenu"
              data-open-content-menu
            >
              <i class="fas fa-ellipsis-v"></i>
            </button>
          </div>
        </div>
        <div class="content">
          <div class="messages" data-messages>
            <div 
              v-for="message in currentMessages" 
              :key="message.id"
              class="message" 
              :class="{ 'from-author': message.from === 'me' }"
            >
              <div v-if="message.author && message.from !== 'me'" class="from">
                {{ message.author }}
              </div>
              <div class="text">{{ message.text }}</div>
              <div class="created-at">
                {{ formatTime(message.createdAt) }}
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="footer-container">
            <button 
              class="footer-button" 
              @click="toggleEmojiMenu"
              data-open-emoji
            >
              <i class="far fa-smile"></i>
            </button>
            <div 
              class="text-input" 
              contenteditable="true" 
              @input="inputText = ($event.target as HTMLElement)?.textContent || ''"
              @keydown="handleKeydown"
              data-input
            ></div>
            <button 
              class="footer-button" 
              @click="sendMessage"
              data-send
            >
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Контекстное меню -->
    <div class="context-menu" :class="{ 'is-open': isContextMenuOpen }">
      <button 
        class="context-menu-item" 
        @click="handleContextAction('profile')"
        data-context-action="profile"
      >
        <i class="fas fa-user"></i>
        <span>Профиль</span>
      </button>
      <button 
        class="context-menu-item" 
        @click="handleContextAction('block')"
        data-context-action="block"
      >
        <i class="fas fa-ban"></i>
        <span>Заблокировать</span>
      </button>
      <button 
        class="context-menu-item" 
        @click="handleContextAction('report')"
        data-context-action="report"
      >
        <i class="fas fa-flag"></i>
        <span>Пожаловаться</span>
      </button>
    </div>

    <!-- Меню эмодзи -->
    <div class="emoji-menu" :class="{ 'is-open': isEmojiMenuOpen }">
      <div class="emoji-grid" data-emoji-grid>
        <button 
          v-for="emoji in popularEmojis" 
          :key="emoji"
          class="emoji-item" 
          @click="insertEmoji(emoji)"
          :data-emoji="emoji"
        >
          {{ emoji }}
        </button>
      </div>
    </div>

    <!-- Backdrop для контекстного меню и эмодзи -->
    <div 
      class="context-menu-backdrop" 
      :class="{ 'is-visible': isContextMenuOpen || isEmojiMenuOpen }"
      @click="closeContextMenu(); closeEmojiMenu()"
    ></div>
  </div>
</template>

<style>
/* ===== VARIABLES AND IMPORTS ===== */
:root {
  --header-height: 2.5rem;
  --button-size: 2.5rem;
  --border-radius: 6px;
  --transition-fast: 0.2s ease;
  --transition-normal: 0.25s ease;
  --transition-slow: 0.3s ease;
  --shadow-light: 0 3px 8px rgba(0, 0, 0, 0.2);
  --shadow-medium: 2px 0 8px rgba(0, 0, 0, 0.15);
  --shadow-button: -2px 3px 4px rgba(0, 0, 0, 0.15);
  --backdrop-opacity: 0.2;
}

/* ===== BASE STYLES ===== */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

body {
  font-family: Roboto,
  Inter,
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  Oxygen,
  Ubuntu,
  Cantarell,
  'Fira Sans',
  'Droid Sans',
  'Helvetica Neue',
  sans-serif;

  font-size: 13px;
  font-weight: 400;
  line-height: 1;
  background: #ebebeb;

  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

svg {
  width: auto;
  height: 100%;
}

button {
  border: 1px solid transparent;
  padding: 0.6em;
  font-family: inherit;
  color: inherit;
  background: transparent;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

/* ===== LAYOUT COMPONENTS ===== */
.layout {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.layout > div {
  width: 100%;
}

.content {
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
  color: var(--tx-first);
  background: var(--bg-second);
}

/* ===== CHAT PANEL AND TOGGLE ===== */
.chat-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  max-height: 100vh;
  width: 100%;
  max-width: 400px;
  transform: translateX(100%);
  box-shadow: var(--shadow-light);
  z-index: 1000;
  user-select: none;
}

.chat-panel.is-open {
  transform: translateX(0);
}

.chat-panel.panel-inited {
  transition: transform var(--transition-slow);
}

.chat-toggle {
  position: absolute;
  top: 50%;
  left: calc(-1 * var(--button-size));
  transform: translateY(-50%);
  z-index: 1001;
  width: var(--button-size);
  height: var(--button-size);
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  color: var(--tx-first);
  background: var(--bg-second);
  border: none;
  box-shadow: var(--shadow-button);
}

/* ===== SIDE MENU COMPONENTS ===== */
.side-menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 240px;
  height: 100%;
  background: var(--bg-first);
  transform: translateX(-105%);
  transition: transform var(--transition-normal),
  box-shadow var(--transition-normal);
  z-index: 1002;
  display: flex;
  flex-direction: column;
  pointer-events: none;
}

.side-menu.is-open {
  transform: translateX(0);
  box-shadow: var(--shadow-medium);
  pointer-events: auto;
}

.side-menu .menu-section {
  padding: 0.5rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.side-menu .menu-item {
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.75rem;
  color: var(--tx-first);
  background: transparent;
}

/* Активный пункт меню */
.side-menu .menu-item.is-active {
  background: var(--bg-accent);
}

.side-menu .menu-footer {
  margin-top: auto;
  padding: 0.5rem 0.75rem;
}

[data-menu-close-panel] {
  display: none;
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--tx-first);
}

.backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, var(--backdrop-opacity));
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition-fast);
  z-index: 1001;
}

.backdrop.is-visible {
  opacity: 1;
  pointer-events: auto;
}

/* ===== SCREENS AND HEADER ===== */
.screen {
  display: none;
  width: 100%;
  height: 100%;
  flex-direction: column;
}

.screen.is-active {
  display: flex;
}

.header-container {
  height: var(--header-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--tx-first);
  background: var(--bg-first);
}

.header-button {
  padding: 0.5rem;
  min-width: var(--button-size);
  height: 100%;
  color: var(--tx-first);
}

.header-text {
  font-size: 1rem;
  font-weight: 300;
}

/* ===== DIALOGS LIST ===== */
.dialogs-container {
  display: flex;
  flex-direction: column;
}

.dialog-item {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  gap: 0.5rem;
  transition: background-color var(--transition-fast);
}

.dialog-item .header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.message-from {
  font-weight: 500;
}

.message-created-at {
  color: var(--tx-second);
  min-height: 1rem;
}

.preview {
  color: var(--tx-second);
  min-height: 1rem;
  text-align: left;
}

/* ===== CHAT COMPONENTS ===== */
.messages {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
}

.footer-container {
  display: flex;
  align-items: end;
  background: var(--bg-first);
}

.footer-button {
  padding: 0.5rem;
  width: var(--button-size);
  height: var(--button-size);
  color: var(--tx-first);
}

.text-input {
  width: 100%;
  font-size: 1rem;
  border: none;
  outline: none;
  padding: 0.75rem 0;
  min-height: 1rem;
  max-height: 7rem;
  overflow-y: auto;
  color: var(--tx-first);
  background: transparent;
}

/* ===== MESSAGE COMPONENTS ===== */
.message {
  min-width: 50%;
  max-width: 90%;
  padding: 0.5rem;
  border: none;
  border-radius: var(--border-radius);
  background: var(--bg-accent);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.message.from-author {
  margin-left: auto;
}

.message .from {
  font-weight: 500;
}

.message .created-at {
  display: flex;
  justify-content: end;
  gap: 0.25rem;
  align-items: center;
}

.readed {
  height: 1rem;
}

/* ===== INTERACTIVE STATES ===== */
@media (hover: hover) {
  .side-menu .menu-item:hover,
  .dialog-item:hover,
  .chat-toggle:hover {
    background-color: var(--bg-accent);
  }

  button:hover {
    background: var(--bg-accent);
  }
}

/* ===== ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
  .chat-panel,
  .side-menu,
  .backdrop {
    transition: none;
  }
}

/* ===== RESPONSIVE ADJUSTMENTS ===== */
@media (max-width: 480px) {
  .chat-panel {
    max-width: 100%;
  }

  .side-menu {
    width: 280px;
  }

  [data-menu-close-panel] {
    display: block;
  }
}

/* ===== CONTEXT MENU STYLES ===== */

.context-menu {
  position: absolute;
  top: 2.5rem;
  right: 0.25rem;
  background: var(--bg-first);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
  z-index: 1003;
  min-width: 180px;
  display: none;
  flex-direction: column;
  overflow: hidden;
}

.context-menu.is-open {
  display: flex;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-align: left;
  color: var(--tx-first);
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: background-color var(--transition-fast);
}

.context-menu-item:last-child {
  border-bottom: none;
}

.context-menu-item:hover {
  background-color: var(--bg-accent);
}

.context-menu-item i {
  width: 16px;
  text-align: center;
}

.context-menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
  z-index: 1002;
  display: none;
}

.context-menu-backdrop.is-visible {
  display: block;
}

/* ===== EMOJI MENU STYLES ===== */
.emoji-menu {
  position: absolute;
  bottom: 2.5rem;
  left: 0;
  right: 0;
  background: var(--bg-first);
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1004;
  display: none;
  flex-direction: column;
  max-height: 300px;
  overflow: hidden;
}

.emoji-menu.is-open {
  display: flex;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.25rem;
  padding: 0.75rem;
  overflow-y: auto;
  flex-grow: 1;
}

.emoji-item {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--border-radius);
  transition: background-color var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
}

.emoji-item:hover {
  background-color: var(--bg-accent);
}

/* ===== RESPONSIVE ADJUSTMENTS FOR EMOJI MENU ===== */
@media (max-width: 480px) {
  .emoji-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 0.2rem;
    padding: 0.5rem;
  }

  .emoji-item {
    font-size: 1.25rem;
    min-height: 2rem;
  }

  .emoji-menu {
    max-height: 250px;
  }
}

/* ===== SCROLLBAR STYLES FOR EMOJI GRID ===== */
.emoji-grid::-webkit-scrollbar {
  width: 6px;
}

.emoji-grid::-webkit-scrollbar-track {
  background: var(--bg-second);
}

.emoji-grid::-webkit-scrollbar-thumb {
  background: var(--tx-second);
  border-radius: 3px;
}

.emoji-grid::-webkit-scrollbar-thumb:hover {
  background: var(--tx-first);
}
</style>
