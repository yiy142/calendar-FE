import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { Button, Collapse } from 'ant-design-vue';

Vue.config.productionTip = false;

Vue.component(Button.name, Button);
Vue.component(Collapse.name, Collapse);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
