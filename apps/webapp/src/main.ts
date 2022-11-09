import { App, createApp } from "vue";

import { createVuestic } from "vuestic-ui";
import "vuestic-ui/css";
import "material-design-icons-iconfont/dist/material-design-icons.min.css";

import "./styles/styles.scss";

import VueApp from "./App.vue";
import router from "./router";
import store from "./store";
import { LocalStorageService } from "./services/storage/local-storage.service";

LocalStorageService.configure();

const app: App = createApp(VueApp);
app.use(createVuestic());
app.use(store);
app.use(router);

router.isReady().then(() => {
  app.mount("#app");
});
