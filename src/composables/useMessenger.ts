import { ref, reactive, computed } from 'vue'

// Интерфейсы для типизации
export interface Dialog {
  id: number
  title: string
  type?: 'chat' | 'channel'
  preview?: string
  lastTime?: string
}

export interface Message {
  id: number
  dialogId: number
  from: 'me' | 'other'
  author?: string
  text: string
  createdAt: Date
}

export interface Theme {
  '--tx-first': string
  '--tx-second': string
  '--bg-first': string
  '--bg-second': string
  '--bg-accent': string
}

// Composable для управления состоянием мессенджера
export function useMessenger() {
  // Состояние приложения
  const isOpen = ref(false)
  const isMenuOpen = ref(false)
  const isContextMenuOpen = ref(false)
  const isEmojiMenuOpen = ref(false)
  const currentTab = ref<'chats' | 'channels'>('chats')
  const activeDialogId = ref<number | null>(null)
  const currentTheme = ref<'light' | 'dark'>('light')

  // Данные
  const dialogs = ref<Dialog[]>([])
  const messagesByDialogId = reactive<Record<number, Message[]>>({})
  const inputText = ref('')

  // Темы
  const themes: Record<string, Theme> = {
    light: {
      '--tx-first': '#000',
      '--tx-second': '#4d4d4d',
      '--bg-first': '#f8f8f8',
      '--bg-second': '#f2f2fa',
      '--bg-accent': 'rgba(179, 219, 255, 0.3)'
    },
    dark: {
      '--tx-first': '#fff',
      '--tx-second': '#b3b3b3',
      '--bg-first': '#282e33',
      '--bg-second': '#191c21',
      '--bg-accent': 'rgba(96, 104, 110, 0.3)'
    }
  }

  // Вычисляемые свойства
  const filteredDialogs = computed(() => {
    const showType = currentTab.value === 'channels' ? 'channel' : 'chat'
    return dialogs.value.filter(d => (d.type || 'chat') === showType)
  })

  const currentMessages = computed(() => {
    if (!activeDialogId.value) return []
    return messagesByDialogId[activeDialogId.value] || []
  })

  const currentDialog = computed(() => {
    if (!activeDialogId.value) return null
    return dialogs.value.find(d => d.id === activeDialogId.value)
  })

  // Утилиты
  const formatTime = (date: Date) => {
    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  }

  // Методы управления панелью
  const togglePanel = () => {
    isOpen.value = !isOpen.value
  }

  const closePanel = () => {
    isOpen.value = false
    isMenuOpen.value = false
    isContextMenuOpen.value = false
    isEmojiMenuOpen.value = false
  }

  // Методы управления меню
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
  }

  const closeMenu = () => {
    isMenuOpen.value = false
  }

  const toggleContextMenu = () => {
    isContextMenuOpen.value = !isContextMenuOpen.value
  }

  const closeContextMenu = () => {
    isContextMenuOpen.value = false
  }

  const toggleEmojiMenu = () => {
    isEmojiMenuOpen.value = !isEmojiMenuOpen.value
  }

  const closeEmojiMenu = () => {
    isEmojiMenuOpen.value = false
  }

  // Методы управления вкладками
  const setTab = (tab: 'chats' | 'channels') => {
    currentTab.value = tab
    closeMenu()
  }

  // Методы управления диалогами
  const openDialog = (dialogId: number) => {
    activeDialogId.value = dialogId
  }

  const addDialog = (dialog: Omit<Dialog, 'id'>) => {
    const id = Date.now()
    const newDialog: Dialog = {
      id,
      title: dialog.title || 'Без имени',
      type: dialog.type || 'chat',
      preview: dialog.preview || '',
      lastTime: dialog.lastTime || ''
    }
    dialogs.value.push(newDialog)
    if (!messagesByDialogId[id]) {
      messagesByDialogId[id] = []
    }
    return id
  }

  // Методы управления сообщениями
  const sendMessage = () => {
    const text = inputText.value.trim()
    if (!text) return

    if (!activeDialogId.value) {
      if (dialogs.value.length === 0) return
      const firstDialog = dialogs.value[0]
      if (!firstDialog) return
      activeDialogId.value = firstDialog.id
    }

    const dialogId = activeDialogId.value
    if (!dialogId) return
    
    if (!messagesByDialogId[dialogId]) {
      messagesByDialogId[dialogId] = []
    }

    const message: Message = {
      id: Date.now(),
      dialogId,
      from: 'me',
      author: '',
      text,
      createdAt: new Date()
    }

    messagesByDialogId[dialogId].push(message)
    inputText.value = ''
    // Очищаем contenteditable элемент
    const inputElement = document.querySelector('[data-input]') as HTMLElement
    if (inputElement) {
      inputElement.textContent = ''
    }
    updateDialogPreview(dialogId, text, message.createdAt)
  }

  const addMessage = (dialogId: number, message: Omit<Message, 'id' | 'dialogId'>) => {
    if (!messagesByDialogId[dialogId]) {
      messagesByDialogId[dialogId] = []
    }

    const newMessage: Message = {
      id: Date.now(),
      dialogId,
      from: message.from || 'other',
      author: message.author || '',
      text: message.text || '',
      createdAt: message.createdAt || new Date()
    }

    messagesByDialogId[dialogId].push(newMessage)
    updateDialogPreview(dialogId, newMessage.text, newMessage.createdAt)
  }

  const updateDialogPreview = (dialogId: number, previewText: string, createdAt: Date) => {
    const dialog = dialogs.value.find(d => d.id === dialogId)
    if (!dialog) return

    dialog.preview = previewText
    dialog.lastTime = formatTime(createdAt)
  }

  // Методы управления темами
  const applyTheme = (themeName: string) => {
    const theme = themes[themeName]
    if (!theme) return

    currentTheme.value = themeName as 'light' | 'dark'
    
    Object.entries(theme).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value)
    })

    if (themeName === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }

    localStorage.setItem('messenger_theme', themeName)
  }

  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
    applyTheme(newTheme)
  }

  // Методы для эмодзи
  const insertEmoji = (emoji: string) => {
    const inputElement = document.querySelector('[data-input]') as HTMLElement
    if (inputElement) {
      inputElement.textContent += emoji
      inputText.value = inputElement.textContent || ''
    }
    closeEmojiMenu()
  }

  // Обработчики событий
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
    closeContextMenu()
  }

  return {
    // Состояние
    isOpen,
    isMenuOpen,
    isContextMenuOpen,
    isEmojiMenuOpen,
    currentTab,
    activeDialogId,
    currentTheme,
    dialogs,
    messagesByDialogId,
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
    sendMessage,
    addMessage,
    applyTheme,
    toggleTheme,
    insertEmoji,
    handleKeydown,
    handleContextAction,
    formatTime
  }
}
