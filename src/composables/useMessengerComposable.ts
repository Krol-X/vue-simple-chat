import { computed } from 'vue'
import { useMessengerStore } from '../stores/messenger'
import { useUIStore } from '../stores/ui'
import { useThemeStore } from '../stores/theme'
import type { Message } from '../types'

export function useMessengerComposable() {
  const messengerStore = useMessengerStore()
  const uiStore = useUIStore()
  const themeStore = useThemeStore()

  const filteredDialogs = computed(() => {
    const showType = uiStore.currentTab === 'channels' ? 'channel' : 'chat'
    return messengerStore.dialogs.filter(d => (d.type || 'chat') === showType)
  })

  const currentMessages = computed(() => {
    if (!uiStore.activeDialogId) return []
    return messengerStore.getMessagesByDialogId(uiStore.activeDialogId)
  })

  const currentDialog = computed(() => {
    if (!uiStore.activeDialogId) return null
    return messengerStore.getDialogById(uiStore.activeDialogId)
  })
  const openDialog = (dialogId: number) => {
    uiStore.setActiveDialog(dialogId)
    messengerStore.openDialog(dialogId)
  }

  const sendMessage = () => {
    const text = uiStore.inputText.trim()
    if (!text) return

    if (!uiStore.activeDialogId) {
      if (messengerStore.dialogs.length === 0) return
      const firstDialog = messengerStore.dialogs[0]
      if (!firstDialog) return
      uiStore.setActiveDialog(firstDialog.id)
    }

    messengerStore.sendMessage(text)
    uiStore.clearInput()
    
    // Очищаем contenteditable элемент
    const inputElement = document.querySelector('[data-input]') as HTMLElement
    if (inputElement) {
      inputElement.textContent = ''
    }
  }

  const addMessage = (dialogId: number, message: Omit<Message, 'id' | 'dialogId'>) => {
    messengerStore.addMessage(dialogId, message)
  }

  const insertEmoji = (emoji: string) => {
    const inputElement = document.querySelector('[data-input]') as HTMLElement
    if (inputElement) {
      inputElement.textContent += emoji
      uiStore.setInputText(inputElement.textContent || '')
    }
    uiStore.closeEmojiMenu()
  }

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
    uiStore.closeContextMenu()
  }

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('messenger_theme')
    if (!savedTheme) {
      themeStore.applyTheme('light')
    } else {
      themeStore.restoreTheme()
    }
  }

  return {
    messengerStore,
    uiStore,
    themeStore,
    filteredDialogs,
    currentMessages,
    currentDialog,
    openDialog,
    sendMessage,
    addMessage,
    insertEmoji,
    handleKeydown,
    handleContextAction,
    initializeTheme
  }
}
