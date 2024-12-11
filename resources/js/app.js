import { createApp } from "vue";

import App from "./App.vue";
import router from './router'
import { VueTelegramPlugin } from 'vue-tg'


createApp(App)
    .use(router)
    .use(VueTelegramPlugin)
    .mount("#app");

require("./bootstrap");