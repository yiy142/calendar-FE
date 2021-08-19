import Vue from 'vue'
import App from './App.vue'
import router from './router'

import Antd from 'ant-design-vue/es';
import 'ant-design-vue/dist/antd.css';
import Form from 'ant-design-vue/lib/form';
Vue.use(Antd);


Vue.config.productionTip = false;
Vue.prototype.$form = Form;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
