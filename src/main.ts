import { createApp } from 'vue';
import './style.css'; // 保持样式引入
import App from './App.vue';
import router from './router'; // 引入路由配置

const app = createApp(App);

app.use(router); // 挂载路由
app.mount('#app');