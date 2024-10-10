import * as ElementPlusIcons from '@element-plus/icons-vue'
import type { App } from 'vue'
//https://github.com/element-plus/element-plus/issues/7293
import 'element-plus/theme-chalk/index.css'

export default (app: App<Element>) => {
    // 全局注册ElementPlus图标
    for (const [key, component] of Object.entries(ElementPlusIcons)) {
        app.component(key, component)
    }
}
