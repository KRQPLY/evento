import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import VueAwesomePaginate from 'vue-awesome-paginate'

import 'vue-awesome-paginate/dist/style.css'

import '@/styles/style.scss'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(VueAwesomePaginate)

app.mount('#app')
