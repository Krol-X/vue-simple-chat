import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Widget from './Widget.vue'
import './styles/global.css'

class MessengerWidgetAPI {
  private app: any = null
  private widgetInstance: any = null
  private rootElement: HTMLElement | null = null

  async init(selector: string | HTMLElement, options: any = {}) {
    const root = typeof selector === "string" ? document.querySelector(selector) : selector
    if (!root) {
      console.error('MessengerWidget: Element not found')
      return { destroy: () => {} }
    }

    this.rootElement = root as HTMLElement

    const app = createApp(Widget)
    const pinia = createPinia()
    app.use(pinia)

    this.app = app
    this.widgetInstance = app.mount(root)

    await new Promise(resolve => setTimeout(resolve, 0))

    if (options.seedDialogs && Array.isArray(options.seedDialogs)) {
      options.seedDialogs.forEach((dialog: any) => {
        this.widgetInstance.addDialog(dialog)
      })
    }

    if (options.seedMessages && Array.isArray(options.seedMessages)) {
      options.seedMessages.forEach((message: any) => {
        this.widgetInstance.addMessage(message.dialogId, message)
      })
    }

    return {
      root: this.rootElement,
      open: () => this.widgetInstance.open(),
      close: () => this.widgetInstance.close(),
      toggle: () => this.widgetInstance.toggle(),
      showDialogs: () => this.widgetInstance.showDialogs(),
      showChat: () => this.widgetInstance.showChat(),
      addDialog: (dialog: any) => this.widgetInstance.addDialog(dialog),
      addMessage: (dialogId: number, message: any) => this.widgetInstance.addMessage(dialogId, message),
      openDialog: (dialogId: number) => this.widgetInstance.openDialog(dialogId),
      setTab: (tab: 'chats' | 'channels') => this.widgetInstance.setTab(tab),
      setTheme: (theme: string) => this.widgetInstance.setTheme(theme),
      toggleTheme: () => this.widgetInstance.toggleTheme(),
      getCurrentTheme: () => this.widgetInstance.getCurrentTheme(),
      destroy: () => this.destroy(),
      remove: () => this.remove()
    }
  }

  mount(target: string | HTMLElement, options: any = {}) {
    const container = typeof target === "string" ? document.querySelector(target) : target || document.body
    if (!container) {
      console.error('MessengerWidget: Container not found')
      return { destroy: () => {} }
    }
    const root = document.createElement("div")
    root.id = options?.id || "messenger-widget"
    container.appendChild(root)
    return this.init(root, options)
  }

  destroy() {
    if (this.app && this.rootElement) {
      this.app.unmount()
      this.rootElement.innerHTML = ''
      this.app = null
      this.widgetInstance = null
    }
  }

  remove() {
    if (this.app && this.rootElement) {
      this.app.unmount()
      this.rootElement.remove()
      this.app = null
      this.widgetInstance = null
      this.rootElement = null
    }
  }

  autoInit() {
    document.querySelectorAll("[data-messenger-widget]").forEach((root) => {
      this.init(root as HTMLElement, {})
    })
  }
}

const api = new MessengerWidgetAPI()

if (typeof window !== 'undefined') {
  (window as any).MessengerWidget = api
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => api.autoInit())
} else {
  api.autoInit()
}

export default api
