<script setup lang="ts">
interface Props {
  isOpen: boolean
  currentTab: 'chats' | 'channels'
  currentTheme: 'light' | 'dark'
}

interface Emits {
  (e: 'close-panel'): void
  (e: 'set-tab', tab: 'chats' | 'channels'): void
  (e: 'toggle-theme'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <nav class="side-menu" :class="{ 'is-open': isOpen }">
    <div class="menu-section">
      <button class="menu-item" @click="$emit('close-panel')" data-menu-close-panel>
        <i class="fas fa-multiply"></i>
        <span>Закрыть панель</span>
      </button>
      <button 
        class="menu-item" 
        :class="{ 'is-active': currentTab === 'chats' }"
        @click="$emit('set-tab', 'chats')"
        data-menu-chats
      >
        <i class="fas fa-comments"></i>
        <span>Чаты</span>
      </button>
      <button 
        class="menu-item" 
        :class="{ 'is-active': currentTab === 'channels' }"
        @click="$emit('set-tab', 'channels')"
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
          @change="$emit('toggle-theme')"
          data-theme-toggle
        >
        <span>Тёмная тема</span>
      </label>
    </div>
  </nav>
</template>

<style scoped>
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

.side-menu .menu-item.is-active {
  background: var(--bg-accent);
}

.side-menu .menu-footer {
  margin-top: auto;
  padding: 0.5rem 0.75rem;
}

:deep([data-menu-close-panel]) {
  display: none;
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--tx-first);
}

@media (hover: hover) {
  .side-menu .menu-item:hover {
    background-color: var(--bg-accent);
  }
}

@media (max-width: 480px) {
  .side-menu {
    width: 280px;
  }

  :deep([data-menu-close-panel]) {
    display: block;
  }
}

i {
  margin-right: 0.5rem;
}
</style>
