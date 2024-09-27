import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app=createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
router.beforeEach((to,from,next)=>{
  const token=localStorage.getItem('pz_token')
  if(!token&&to.path!=='/login')
  {
    localStorage.removeItem('pz_token')
    localStorage.removeItem('pz_userInfo')
    next('/login')
  }
  else if(token&&to.path==='/login')
  {
    next('/')
  }
  else{
    next()
  }
})
app.use(ElementPlus)
app.use(store)
app.use(router)
app.mount('#app')
