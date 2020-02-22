// per https://github.com/vuejs/vuex/blob/dev/examples/todomvc/store/plugins.js
import { STORAGE_KEY } from "./mutations";
import createLogger from "./logger";

const localStoragePlugin = store => {
  store.subscribe((mutation, { selections }) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
  });
};

export default process.env.NODE_ENV !== "production" && !window.testit
  ? [createLogger(), localStoragePlugin]
  : [localStoragePlugin];