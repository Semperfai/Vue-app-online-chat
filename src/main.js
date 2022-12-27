//style reset
import '@/assets/style/null.scss'
// wrapper
import '@/assets/style/wrapper.scss'
//common style(BEM)
import '@/assets/style/common.scss'

//app
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import components from '@/components/UI'

const app = createApp(App)
//components
components.forEach(component => { app.component(component.name, component) });

app
	.use(store)
	.use(router)
	.mount('#app')
