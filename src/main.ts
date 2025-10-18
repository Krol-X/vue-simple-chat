import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Widget from './Widget.vue'
import './styles/global.css'

// Создаем приложение Vue
const app = createApp(Widget)
const pinia = createPinia()

app.use(pinia)

// Инициализируем тему сразу после создания Pinia
import { useThemeStore } from './stores/theme'
const themeStore = useThemeStore()
themeStore.restoreTheme()

// Монтируем приложение в элемент с id="widget"
const widgetElement = document.getElementById('widget')
if (widgetElement) {
  const widgetApp = app.mount('#widget') as any
  
  // Инициализируем виджет с начальными данными
  widgetApp.addDialog({ title: 'Андрей' })
  widgetApp.addDialog({ title: 'Новости', type: 'channel' })
  
  // Делаем виджет доступным глобально для тестирования
  ;(window as any).widget = widgetApp
}
