import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Theme, ThemeConfig, ThemeActions } from '../types'

export const useThemeStore = defineStore('theme', () => {
  // State
  const currentTheme = ref<'light' | 'dark'>('light')
  const customThemes = ref<Record<string, Theme>>({})

  // Default themes
  const defaultThemes: ThemeConfig = {
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

  // Getters
  const allThemes = computed(() => ({
    ...defaultThemes,
    ...customThemes.value
  } as Record<string, Theme>))

  const currentThemeConfig = computed(() => 
    allThemes.value[currentTheme.value]
  )

  const isDark = computed(() => currentTheme.value === 'dark')

  const availableThemes = computed(() => 
    Object.keys(allThemes.value)
  )

  // Actions
  const applyTheme: ThemeActions['applyTheme'] = (themeName) => {
    const theme = allThemes.value[themeName]
    if (!theme) {
      console.warn(`Тема '${themeName}' не найдена`)
      return
    }

    currentTheme.value = themeName as 'light' | 'dark'
    
    // Применяем CSS переменные
    Object.entries(theme).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value)
    })

    // Устанавливаем data-атрибут для темной темы
    if (themeName === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }

    // Сохраняем в localStorage
    localStorage.setItem('messenger_theme', themeName)
  }

  const toggleTheme: ThemeActions['toggleTheme'] = () => {
    const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
    applyTheme(newTheme)
  }

  const addCustomTheme: ThemeActions['addCustomTheme'] = (name, theme) => {
    customThemes.value[name] = theme
  }

  const removeCustomTheme = (name: string) => {
    if (customThemes.value[name]) {
      delete customThemes.value[name]
    }
  }

  const restoreTheme = () => {
    const savedTheme = localStorage.getItem('messenger_theme')
    if (savedTheme && allThemes.value[savedTheme]) {
      applyTheme(savedTheme)
      return savedTheme
    }
    // Если в localStorage нет темы, применяем светлую по умолчанию
    applyTheme('light')
    return 'light'
  }

  const resetToDefault = () => {
    applyTheme('light')
  }

  const exportTheme = (themeName: string) => {
    const theme = allThemes.value[themeName]
    if (!theme) return null
    
    return {
      name: themeName,
      config: theme
    }
  }

  const importTheme = (themeData: { name: string; config: Theme }) => {
    addCustomTheme(themeData.name, themeData.config)
  }

  return {
    // State
    currentTheme,
    customThemes,
    
    // Getters
    allThemes,
    currentThemeConfig,
    isDark,
    availableThemes,
    
    // Actions
    applyTheme,
    toggleTheme,
    addCustomTheme,
    removeCustomTheme,
    restoreTheme,
    resetToDefault,
    exportTheme,
    importTheme
  }
})
