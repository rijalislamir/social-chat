import './style.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { i18n } from './locales';
import App from './App.vue';
import router from './utils/router';
import vue3Spinner from 'vue3-spinner';

const pinia = createPinia();
const app = createApp(App);

app.use(i18n);
app.use(pinia);
app.use(router);
app.use(vue3Spinner);

app.mount('#app');
