import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import Store from "./store.js";
import axios from "axios";

const store = new Store();

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.mixin({
  methods: {
    $notify(text) {
      this.$root.notify.text = text;
      this.$root.notify.is = true;
      setTimeout(() => {
        this.$root.notify.text = "";
        this.$root.notify.is = false;
      }, 3000);
    },
  },
});

new Vue({
  vuetify,
  render: (h) => h(App),
  data() {
    return {
      notify: {
        text: "",
        is: false,
      },
      user: false,
      data: false,
    };
  },
  created() {
    this.$root.types = store.get("objects");
  },
}).$mount("#app");
