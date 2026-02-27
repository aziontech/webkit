import { createApp } from "vue";
import Vue3ColorPicker from "vue3-colorpicker";

import "./main.css";
import "@aziontech/icons";
import "vue3-colorpicker/style.css";

import App from "./App.vue";
import { initializeTheme } from "./theme";

initializeTheme();
createApp(App).use(Vue3ColorPicker).mount("#app");
