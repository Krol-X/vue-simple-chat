import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Dialog, Message, MessengerActions } from '../types'

export const useMessengerStore = defineStore('messenger', () => {
  // State
  const dialogs = ref<Dialog[]>([])
  const messagesByDialogId = ref<Record<number, Message[]>>({})

  // Getters
  const getDialogById = computed(() => (id: number) => 
    dialogs.value.find(d => d.id === id)
  )

  const getMessagesByDialogId = computed(() => (dialogId: number) => 
    messagesByDialogId.value[dialogId] || []
  )

  const getDialogCount = computed(() => dialogs.value.length)

  const getMessageCount = computed(() => 
    Object.values(messagesByDialogId.value).reduce((total, messages) => total + messages.length, 0)
  )

  // Actions
  const addDialog: MessengerActions['addDialog'] = (dialog) => {
    const id = Date.now()
    const newDialog: Dialog = {
      id,
      title: dialog.title || 'Без имени',
      type: dialog.type || 'chat',
      preview: dialog.preview || '',
      lastTime: dialog.lastTime || ''
    }
    
    dialogs.value.push(newDialog)
    if (!messagesByDialogId.value[id]) {
      messagesByDialogId.value[id] = []
    }
    
    return id
  }

  const addMessage: MessengerActions['addMessage'] = (dialogId, message) => {
    if (!messagesByDialogId.value[dialogId]) {
      messagesByDialogId.value[dialogId] = []
    }

    const newMessage: Message = {
      id: Date.now(),
      dialogId,
      from: message.from || 'other',
      author: message.author || '',
      text: message.text || '',
      createdAt: message.createdAt || new Date()
    }

    messagesByDialogId.value[dialogId].push(newMessage)
    updateDialogPreview(dialogId, newMessage.text, newMessage.createdAt)
  }

  const openDialog: MessengerActions['openDialog'] = () => {
    //
  }

  const sendMessage: MessengerActions['sendMessage'] = (text) => {
    if (!text.trim()) return

    // Здесь можно добавить логику определения активного диалога
    // Пока что используем первый доступный диалог
    const firstDialog = dialogs.value[0]
    if (!firstDialog) return

    const dialogId = firstDialog.id
    if (!messagesByDialogId.value[dialogId]) {
      messagesByDialogId.value[dialogId] = []
    }

    const message: Message = {
      id: Date.now(),
      dialogId,
      from: 'me',
      author: '',
      text,
      createdAt: new Date()
    }

    messagesByDialogId.value[dialogId].push(message)
    updateDialogPreview(dialogId, text, message.createdAt)
  }

  const updateDialogPreview: MessengerActions['updateDialogPreview'] = (dialogId, previewText, createdAt) => {
    const dialog = dialogs.value.find(d => d.id === dialogId)
    if (!dialog) return

    dialog.preview = previewText
    dialog.lastTime = formatTime(createdAt)
  }

  const removeDialog = (dialogId: number) => {
    const index = dialogs.value.findIndex(d => d.id === dialogId)
    if (index !== -1) {
      dialogs.value.splice(index, 1)
      delete messagesByDialogId.value[dialogId]
    }
  }

  const clearMessages = (dialogId: number) => {
    if (messagesByDialogId.value[dialogId]) {
      messagesByDialogId.value[dialogId] = []
    }
  }

  const clearAllData = () => {
    dialogs.value = []
    messagesByDialogId.value = {}
  }

  // Utility functions
  const formatTime = (date: Date) => {
    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  }

  return {
    // State
    dialogs,
    messagesByDialogId,
    
    // Getters
    getDialogById,
    getMessagesByDialogId,
    getDialogCount,
    getMessageCount,
    
    // Actions
    addDialog,
    addMessage,
    openDialog,
    sendMessage,
    updateDialogPreview,
    removeDialog,
    clearMessages,
    clearAllData,
    
    // Utils
    formatTime
  }
})
