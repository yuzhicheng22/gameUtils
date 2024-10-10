import {createApp} from 'vue'
import App from './App.vue'
import install from './install'
import './styles/index.scss'
import * as dayjs from 'dayjs'
import _ from 'dayjs/locale/zh-cn'

dayjs.locale("zh-cn")
const app = createApp(App)
app.use(install)
app.mount('#app')
