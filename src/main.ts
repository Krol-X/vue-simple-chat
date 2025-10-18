import { createApp } from 'vue'
import Widget from './Widget.vue'

// Создаем приложение Vue
const app = createApp(Widget)

// Монтируем приложение в элемент с id="widget"
const widgetElement = document.getElementById('widget')
if (widgetElement) {
  const widgetApp = app.mount('#widget') as any
  
  // Инициализируем виджет с начальными данными
  widgetApp.addDialog({ id: 1, title: 'Андрей' })
  widgetApp.addDialog({ id: 10, title: 'Новости', type: 'channel' })
  
  // Делаем виджет доступным глобально для тестирования
  ;(window as any).widget = widgetApp
}
