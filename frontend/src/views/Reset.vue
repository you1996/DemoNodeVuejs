<template>
  <div class="col-md-12">
    <div v-if="$route.params.token == null" class="card card-container">
      <h6>enter you email</h6>

      <form name="form" @submit.prevent="handlereset">
        <div class="form-group">
          <label for="email">email</label>
          <input
            v-model="user.email"
            v-validate="'required'"
            type="text"
            class="form-control"
            name="email"
          />
          <div
            v-if="errors.has('email')"
            class="alert alert-danger"
            role="alert"
          >
            email is required!
          </div>
        </div>

        <div class="form-group">
          <button class="btn btn-primary btn-block" :disabled="loading">
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>Login</span>
          </button>
        </div>
        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
        </div>
      </form>
    </div>
    <div v-else>
      <h6>Reset Your password</h6>

      <form name="form" @submit.prevent="confirmReset">
        <div class="form-group">
          <label for="password">password</label>
          <input
            v-model="user.password"
            v-validate="'required'"
            type="text"
            class="form-control"
            name="password"
          />
          <label for="confirm-password">confirm password</label>
          <input
            v-model="user.password"
            v-validate="'required'"
            type="text"
            class="form-control"
            name="confirm-password"
          />
          <div
            v-if="errors.has('password')"
            class="alert alert-danger"
            role="alert"
          >
            password is required!
          </div>
          <div
            v-if="errors.has('confirm-password')"
            class="alert alert-danger"
            role="alert"
          >
            confirm password is required!
          </div>
        </div>

        <div class="form-group">
          <button class="btn btn-primary btn-block" :disabled="loading">
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>Reset</span>
          </button>
        </div>
        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import User from '../models/user';
import jwt_decode from 'jwt-decode';

export default {
  name: 'Reset',
  data() {
    return {
      user: new User('', ''),
      loading: false,
      message: '',
      confirmed: false
    };
  },

  methods: {
    handlereset() {
      this.loading = true;
      this.$validator.validateAll().then(isValid => {
        if (!isValid) {
          this.loading = false;
          return;
        }

        if (this.user.email) {
          this.$store.dispatch('auth/reset', this.user).then(
            response => {
              this.loading = false;
              // eslint-disable-next-line
              console.log(response);

              this.$bvToast.toast(response.email, {
                title: 'A link has been sent to',
                variant: 'danger',
                toaster: 'b-toaster-top-center',
                solid: true
              });
            },
            error => {
              // eslint-disable-next-line
              console.log(this.user);
              this.loading = false;
              this.message =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
            }
          );
        }
      });
    },
    confirmReset() {
      this.loading = true;
      this.$validator.validateAll().then(
        isValid => {
          if (!isValid) {
            this.loading = false;
            return;
          }
          this.$store
            .dispatch('auth/confirmtoken', this.$route.params.token)
            .then(response => {
              this.loading = false;
              this.confirmed = true;
              //   // eslint-disable-next-line
              //   console.log(this.user);
              // eslint-disable-next-line
              console.log(this.user.password);
              var decodedToken = jwt_decode(this.$route.params.token);

              // eslint-disable-next-line
              console.log(response);

              if (this.user.password && this.confirmed) {
                this.user.email = decodedToken.email;
                // eslint-disable-next-line
                console.log(this.user.email);
                this.$store.dispatch('auth/confirmreset', this.user).then(
                  response => {
                    this.loading = false;
                    // eslint-disable-next-line
                    console.log(response);
                    // eslint-disable-next-line
                    //console.log(this.user);

                    this.$bvToast.toast('password has been changed', {
                      title: 'Confirmation',
                      variant: 'info',
                      toaster: 'b-toaster-top-center',
                      solid: true
                    });
                  },
                  error => {
                    // eslint-disable-next-line
                    console.log(this.user);
                    this.$bvToast.toast(error.response.data.message, {
                      title: error.response,
                      variant: 'danger',
                      toaster: 'b-toaster-top-center',
                      solid: true
                    });
                    this.loading = false;
                    this.message =
                      (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                      error.message ||
                      error.toString();
                  }
                );
                this.$router.push('/');
              }
            });
        },
        error => {
          // eslint-disable-next-line
          console.log(error);
        }
      );
    }
  }
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 380px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 75px;
  height: 75px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>
