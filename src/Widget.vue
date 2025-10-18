<script setup lang="ts">
import { onMounted } from 'vue'
import { useMessenger } from './composables/useMessenger'
import SideMenu from './components/SideMenu.vue'
import DialogsScreen from './components/DialogsScreen.vue'
import ChatScreen from './components/ChatScreen.vue'
import EmojiMenu from './components/EmojiMenu.vue'
import ContextMenu from './components/ContextMenu.vue'

// Используем composable для управления состоянием
const {
  // Состояние
  isOpen,
  isMenuOpen,
  isContextMenuOpen,
  isEmojiMenuOpen,
  currentTab,
  activeDialogId,
  currentTheme,
  inputText,
  
  // Вычисляемые свойства
  filteredDialogs,
  currentMessages,
  currentDialog,
  
  // Методы
  togglePanel,
  closePanel,
  toggleMenu,
  closeMenu,
  toggleContextMenu,
  closeContextMenu,
  toggleEmojiMenu,
  closeEmojiMenu,
  setTab,
  openDialog,
  addDialog,
  addMessage,
  sendMessage,
  insertEmoji,
  handleKeydown,
  handleContextAction
} = useMessenger()

// Получаем методы для тем
const { applyTheme, toggleTheme: toggleThemeFromComposable } = useMessenger()

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
  toggleTheme: toggleThemeFromComposable,
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
      <SideMenu
        :is-open="isMenuOpen"
        :current-tab="currentTab"
        :current-theme="currentTheme"
        @close-panel="closePanel"
        @set-tab="setTab"
        @toggle-theme="toggleTheme"
      />

      <!-- Экран диалогов -->
      <DialogsScreen
        :is-active="!activeDialogId"
        :current-tab="currentTab"
        :dialogs="filteredDialogs"
        @open-menu="toggleMenu"
        @open-dialog="openDialog"
      />

      <!-- Экран чата -->
      <ChatScreen
        :is-active="!!activeDialogId"
        :messages="currentMessages"
        :input-text="inputText"
        :dialog-title="currentDialog?.title"
        @back="activeDialogId = null"
        @open-context-menu="toggleContextMenu"
        @update:input-text="inputText = $event"
        @send-message="sendMessage"
        @open-emoji="toggleEmojiMenu"
        @keydown="handleKeydown"
      />
    </div>

    <!-- Контекстное меню -->
    <ContextMenu
      :is-open="isContextMenuOpen"
      @context-action="handleContextAction"
    />

    <!-- Меню эмодзи -->
    <EmojiMenu
      :is-open="isEmojiMenuOpen"
      @insert-emoji="insertEmoji"
    />

    <!-- Backdrop для контекстного меню и эмодзи -->
    <div 
      class="context-menu-backdrop" 
      :class="{ 'is-visible': isContextMenuOpen || isEmojiMenuOpen }"
      @click="closeContextMenu(); closeEmojiMenu()"
    ></div>
  </div>
</template>

<style scoped>
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

/* ===== RESPONSIVE ADJUSTMENTS ===== */
@media (max-width: 480px) {
  .chat-panel {
    max-width: 100%;
  }
}

/* ===== INTERACTIVE STATES ===== */
@media (hover: hover) {
  .chat-toggle:hover {
    background-color: var(--bg-accent);
  }
}
</style>
