import Vue from 'vue';
import App from './App.vue';
import { router } from './router';
import store from './store';
import axios from 'axios'

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import jwt_decode from "jwt-decode"
import VueCountryCode from "vue-country-code";


import VeeValidate from 'vee-validate';
import Vuex from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);

Vue.config.productionTip = false;

Vue.use(VueCountryCode);
Vue.use(VeeValidate);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(Vuex);

new Vue({
  router,
  store,
 beforeMount() {

    // eslint-disable-next-line
    axios.interceptors.request.use(req => {
      if (store.state.auth.user != null ) {
        var decodedToken = jwt_decode(store.state.auth.user.accessToken);
        var expiration = decodedToken.exp;
        var time = expiration - Math.floor(Date.now() / 1000);
        if (time < 0) {
          store.state.auth.expi = false
          store.dispatch('auth/logout');
          this.$bvToast.toast("Your token is no more valid login again", {
            title: 'Token Invalid',
            variant: 'danger',
            toaster: 'b-toaster-top-center',
            solid: true
          });
          router.push('/')
          
        }
        
      }
      return req;
    });
  },
  render: h => h(App)
}).$mount('#app');
