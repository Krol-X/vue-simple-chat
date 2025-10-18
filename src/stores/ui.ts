import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UIActions } from '../types'

export const useUIStore = defineStore('ui', () => {
  // State
  const isOpen = ref(false)
  const isMenuOpen = ref(false)
  const isContextMenuOpen = ref(false)
  const isEmojiMenuOpen = ref(false)
  const currentTab = ref<'chats' | 'channels'>('chats')
  const activeDialogId = ref<number | null>(null)
  const inputText = ref('')

  // Getters
  const isAnyMenuOpen = computed(() => 
    isMenuOpen.value || isContextMenuOpen.value || isEmojiMenuOpen.value
  )

  const currentDialog = computed(() => {
    if (!activeDialogId.value) return null
    // Здесь можно получить диалог из messenger store
    return null
  })

  const filteredDialogs = computed(() => {
    // Здесь можно получить отфильтрованные диалоги из messenger store
    return []
  })

  const currentMessages = computed(() => {
    if (!activeDialogId.value) return []
    // Здесь можно получить сообщения из messenger store
    return []
  })

  // Actions
  const togglePanel: UIActions['togglePanel'] = () => {
    isOpen.value = !isOpen.value
  }

  const closePanel: UIActions['closePanel'] = () => {
    isOpen.value = false
    isMenuOpen.value = false
    isContextMenuOpen.value = false
    isEmojiMenuOpen.value = false
  }

  const toggleMenu: UIActions['toggleMenu'] = () => {
    isMenuOpen.value = !isMenuOpen.value
  }

  const closeMenu: UIActions['closeMenu'] = () => {
    isMenuOpen.value = false
  }

  const toggleContextMenu: UIActions['toggleContextMenu'] = () => {
    isContextMenuOpen.value = !isContextMenuOpen.value
  }

  const closeContextMenu: UIActions['closeContextMenu'] = () => {
    isContextMenuOpen.value = false
  }

  const toggleEmojiMenu: UIActions['toggleEmojiMenu'] = () => {
    isEmojiMenuOpen.value = !isEmojiMenuOpen.value
  }

  const closeEmojiMenu: UIActions['closeEmojiMenu'] = () => {
    isEmojiMenuOpen.value = false
  }

  const setTab: UIActions['setTab'] = (tab) => {
    currentTab.value = tab
    closeMenu()
  }

  const setActiveDialog: UIActions['setActiveDialog'] = (dialogId) => {
    activeDialogId.value = dialogId
  }

  const setInputText = (text: string) => {
    inputText.value = text
  }

  const clearInput = () => {
    inputText.value = ''
  }

  const closeAllMenus = () => {
    isMenuOpen.value = false
    isContextMenuOpen.value = false
    isEmojiMenuOpen.value = false
  }

  const reset = () => {
    isOpen.value = false
    isMenuOpen.value = false
    isContextMenuOpen.value = false
    isEmojiMenuOpen.value = false
    currentTab.value = 'chats'
    activeDialogId.value = null
    inputText.value = ''
  }

  return {
    // State
    isOpen,
    isMenuOpen,
    isContextMenuOpen,
    isEmojiMenuOpen,
    currentTab,
    activeDialogId,
    inputText,
    
    // Getters
    isAnyMenuOpen,
    currentDialog,
    filteredDialogs,
    currentMessages,
    
    // Actions
    togglePanel,
    closePanel,
    toggleMenu,
    closeMenu,
    toggleContextMenu,
    closeContextMenu,
    toggleEmojiMenu,
    closeEmojiMenu,
    setTab,
    setActiveDialog,
    setInputText,
    clearInput,
    closeAllMenus,
    reset
  }
})
