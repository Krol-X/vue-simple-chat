# Vue Messenger Widget

Vue-версия мессенджера, собранная как виджет для встраивания в веб-приложения.

## Быстрый старт

### Сборка
```bash
bun run build
```

Создает файлы в `dist/`:
- `widget.umd.cjs` - JavaScript (UMD)
- `widget.js` - JavaScript (ES модули)  
- `widget.css` - Стили

### Использование

1. **Подключите файлы:**
```html
<script src="https://unpkg.com/vue@3.5/dist/vue.runtime.global.prod.js"></script>
<link rel="stylesheet" href="dist/widget.css"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"/>
<script src="dist/widget.umd.cjs"></script>
```

2. **Инициализируйте виджет:**
```javascript
const widget = await MessengerWidget.init('#widget', {
  seedDialogs: [
    {id: 1, title: 'Андрей', type: 'chat'},
    {id: 2, title: 'Новости', type: 'channel'}
  ],
  seedMessages: [
    {
      dialogId: 1,
      from: 'other',
      author: 'Андрей',
      text: 'Привет!',
      createdAt: new Date()
    }
  ]
});
```

## API

### Управление панелью
- `open()` - открыть
- `close()` - закрыть  
- `toggle()` - переключить

### Диалоги и сообщения
- `addDialog(dialog)` - добавить диалог
- `openDialog(dialogId)` - открыть диалог
- `addMessage(dialogId, message)` - добавить сообщение

### Интерфейс
- `showDialogs()` - показать диалоги
- `showChat()` - показать чат
- `setTab('chats' | 'channels')` - переключить вкладку

### Темы
- `setTheme('light' | 'dark')` - установить тему
- `toggleTheme()` - переключить тему
- `getCurrentTheme()` - получить текущую тему

### Уничтожение
- `destroy()` - отключить (оставить DOM)
- `remove()` - полностью удалить

## Примеры

- `example.html` - простой пример
- `test.html` - тест api

## Разработка

```bash
bun run dev
```