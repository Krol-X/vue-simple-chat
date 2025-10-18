<script setup lang="ts">
interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'insert-emoji', emoji: string): void
}

defineProps<Props>()
defineEmits<Emits>()

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
</script>

<template>
  <div class="emoji-menu" :class="{ 'is-open': isOpen }">
    <div class="emoji-grid" data-emoji-grid>
      <button 
        v-for="emoji in popularEmojis" 
        :key="emoji"
        class="emoji-item" 
        @click="$emit('insert-emoji', emoji)"
        :data-emoji="emoji"
      >
        {{ emoji }}
      </button>
    </div>
  </div>
</template>

<style scoped>
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
