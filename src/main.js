import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import moment from "moment"
import VueMoment from "vue-moment"

Vue.use(VueMoment, {moment})
Vue.prototype.$eventHub = new Vue()
Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
