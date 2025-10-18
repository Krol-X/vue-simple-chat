<script setup lang="ts">
import MessageList from './MessageList.vue'
import MessageInput from './MessageInput.vue'
import type { Message } from '../composables/useMessenger'

interface Props {
  isActive: boolean
  messages: Message[]
  inputText: string
  dialogTitle?: string
}

interface Emits {
  (e: 'back'): void
  (e: 'open-context-menu'): void
  (e: 'update:inputText', value: string): void
  (e: 'send-message'): void
  (e: 'open-emoji'): void
  (e: 'keydown', event: KeyboardEvent): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div 
    class="screen screen-chat" 
    :class="{ 'is-active': isActive }"
    data-screen="chat"
  >
    <div class="header">
      <div class="header-container">
        <button class="header-button" @click="$emit('back')" data-back>
          <i class="fas fa-arrow-left"></i>
        </button>
        <div class="header-text">{{ dialogTitle || 'Чат' }}</div>
        <button 
          class="header-button" 
          @click="$emit('open-context-menu')"
          data-open-content-menu
        >
          <i class="fas fa-ellipsis-v"></i>
        </button>
      </div>
    </div>
    <div class="content">
      <MessageList :messages="messages" />
    </div>
    <MessageInput
      :input-text="inputText"
      @update:input-text="$emit('update:inputText', $event)"
      @send-message="$emit('send-message')"
      @open-emoji="$emit('open-emoji')"
      @keydown="$emit('keydown', $event)"
    />
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
</style>
