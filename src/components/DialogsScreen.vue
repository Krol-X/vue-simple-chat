<script setup lang="ts">
import type { Dialog } from '../composables/useMessenger'

interface Props {
  isActive: boolean
  currentTab: 'chats' | 'channels'
  dialogs: Dialog[]
}

interface Emits {
  (e: 'open-menu'): void
  (e: 'open-dialog', dialogId: number): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div 
    class="screen screen-dialogs" 
    :class="{ 'is-active': isActive }"
    data-screen="dialogs"
  >
    <div class="header">
      <div class="header-container">
        <button class="header-button" @click="$emit('open-menu')" data-open-menu>
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
          v-for="dialog in dialogs" 
          :key="dialog.id"
          class="dialog-item" 
          @click="$emit('open-dialog', dialog.id)"
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
</template>

<style scoped>
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

.content {
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
  color: var(--tx-first);
  background: var(--bg-second);
}

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

@media (hover: hover) {
  .dialog-item:hover {
    background-color: var(--bg-accent);
  }
}
</style>
