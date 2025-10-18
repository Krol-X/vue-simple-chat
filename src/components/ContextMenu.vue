<script setup lang="ts">
interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'context-action', action: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div class="context-menu" :class="{ 'is-open': isOpen }">
    <button 
      class="context-menu-item" 
      @click="$emit('context-action', 'profile')"
      data-context-action="profile"
    >
      <i class="fas fa-user"></i>
      <span>Профиль</span>
    </button>
    <button 
      class="context-menu-item" 
      @click="$emit('context-action', 'block')"
      data-context-action="block"
    >
      <i class="fas fa-ban"></i>
      <span>Заблокировать</span>
    </button>
    <button 
      class="context-menu-item" 
      @click="$emit('context-action', 'report')"
      data-context-action="report"
    >
      <i class="fas fa-flag"></i>
      <span>Пожаловаться</span>
    </button>
  </div>
</template>

<style scoped>
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
</style>
