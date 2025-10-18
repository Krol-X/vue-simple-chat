<script setup lang="ts">
import type { Message } from '../composables/useMessenger'

interface Props {
  messages: Message[]
}

defineProps<Props>()

const formatTime = (date: Date) => {
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}
</script>

<template>
  <div class="messages" data-messages>
    <div 
      v-for="message in messages" 
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
</template>

<style scoped>
.messages {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
}

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
</style>
