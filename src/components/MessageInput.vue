<script setup lang="ts">
interface Props {
  inputText: string
}

interface Emits {
  (e: 'update:inputText', value: string): void
  (e: 'send-message'): void
  (e: 'open-emoji'): void
  (e: 'keydown', event: KeyboardEvent): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLElement
  emit('update:inputText', target?.textContent || '')
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}
</script>

<template>
  <div class="footer">
    <div class="footer-container">
      <button 
        class="footer-button" 
        @click="$emit('open-emoji')"
        data-open-emoji
      >
        <i class="far fa-smile"></i>
      </button>
      <div 
        class="text-input" 
        contenteditable="true" 
        @input="handleInput"
        @keydown="handleKeydown"
        data-input
      ></div>
      <button 
        class="footer-button" 
        @click="$emit('send-message')"
        data-send
      >
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.footer {
  display: flex;
  align-items: end;
  background: var(--bg-first);
}

.footer-container {
  width: 100%;
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
</style>
