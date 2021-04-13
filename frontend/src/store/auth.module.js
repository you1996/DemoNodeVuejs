import AuthService from '../services/auth.service';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { expi: true, status: { loggedIn: true }, user }
  : { expi: false, status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(
        user => {
          commit('loginSuccess', user);
          // eslint-disable-next-line
          console.log(user);
          // eslint-disable-next-line
          console.log('hello');
          return Promise.resolve(user);
        },
        error => {
          commit('loginFailure');
          // eslint-disable-next-line
          console.log(error);
          return Promise.reject(error);
        }
      );
    },
    loginguest({ commit }, user) {
      return AuthService.loginGuest(user).then(
        user => {
          commit('loginSuccess', user);
         
          return Promise.resolve(user);
        },
        error => {
          commit('loginFailure');
          // eslint-disable-next-line
          console.log(error);
          return Promise.reject(error);
        }
      );
    },
    emailcode({ commit }, user) {
      return AuthService.emailCode(user).then(
        user => {
          //commit('loginSuccess', user);
         
          return Promise.resolve(user);
        },
        error => {
          commit('loginFailure');
          // eslint-disable-next-line
          console.log(error);
          return Promise.reject(error);
        }
      );
    },
    confirmcode({ commit }, code) {
      return AuthService.confirmcode(code).then(
        code => {
         // commit('loginSuccess', user);
         // eslint-disable-next-line
          console.log(code);
          return Promise.resolve(code);
        },
        error => {
          commit('loginFailure');
          // eslint-disable-next-line
          console.log(error);
          return Promise.reject(error);
        }
      );
    },
    reset({ commit }, user) {
      return AuthService.resetPass(user).then(
        user => {
          commit('loginSuccess', user);
          // eslint-disable-next-line
          console.log('hello');
          return Promise.resolve(user);
        },
        error => {
          commit('loginFailure');
          // eslint-disable-next-line
          console.log(error);
          return Promise.reject(error);
        }
      );
    },
    confirmreset({ commit }, user) {
      return AuthService.confirmPass(user).then(
        user => {
          commit('loginSuccess', user);
          // eslint-disable-next-line
          console.log('hello');
          return Promise.resolve(user);
        },
        error => {
          commit('loginFailure');
          // eslint-disable-next-line
          console.log(error);
          return Promise.reject(error);
        }
      );
    },
    confirmtoken({ commit }, token) {
      return AuthService.confirmtoken(token).then(
        token => {
          return Promise.resolve(token);
        },
        error => {
          commit('loginFailure');
          // eslint-disable-next-line
          console.log(error);
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
        response => {
          commit('registerSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('registerFailure');
          return Promise.reject(error);
        }
      );
    }
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
      state.expi = true;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
      state.expi = false;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
      state.expi = false;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
      state.expi = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
      state.expi = false;
    }
  }
};
