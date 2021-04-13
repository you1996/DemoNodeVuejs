<template>
  <b-row align-v="center">
    <b-col v-if="this.sent == false" class="card card-container">
      <h6>Enter you email</h6>

      <form name="form" @submit.prevent="codeHandler">
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
            <span>Send Code</span>
          </button>
        </div>
        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
        </div>
      </form>
    </b-col>
    <b-col v-if="this.sent == true" class="card card-container">
      <h6>Code</h6>

      <form name="form" @submit.prevent="codeVerif">
        <div class="form-group">
          <label for="code">code</label>
          <input
            v-model="code"
            v-validate="'required'"
            type="text"
            class="form-control"
            name="code"
          />
          <div
            v-if="errors.has('code')"
            class="alert alert-danger"
            role="alert"
          >
            code is required!
          </div>
        </div>

        <div class="form-group">
          <button class="btn btn-primary btn-block" :disabled="loading">
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>Verifie</span>
          </button>
        </div>
        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
        </div>
      </form>
    </b-col>
  </b-row>
</template>

<script>
import User from '../models/user';

export default {
  name: 'EmailCode',
  data() {
    return {
      user: new User('', ''),
      loading: false,
      code: '',
      message: '',
      confirmed: false,
      sent: false
    };
  },

  methods: {
    codeHandler() {
      this.loading = true;
      this.$validator.validateAll().then(isValid => {
        if (!isValid) {
          this.loading = false;
          return;
        }

        if (this.user.email) {
          this.$store.dispatch('auth/emailcode', this.user).then(
            response => {
              this.loading = false;
              // eslint-disable-next-line
              console.log(response);
              this.sent = true;
              this.$bvToast.toast(response.confirmation, {
                title: 'Notification',
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
    codeVerif() {
      this.loading = true;
      this.$validator.validateAll().then(
        isValid => {
          if (!isValid) {
            this.loading = false;
            return;
          }

          if (this.code) {
            // this.user.email = decodedToken.email;
            // eslint-disable-next-line
            console.log(this.user.email);
            // eslint-disable-next-line
            console.log(this.code);
            this.$store.dispatch('auth/confirmcode', this.code).then(
              response => {
                this.loading = false;
                // eslint-disable-next-line
                console.log(response);
                // eslint-disable-next-line
                //console.log(this.user);

                this.$bvToast.toast(
                  'code verified, you will be redirected to the home page',
                  {
                    title: 'Confirmation',
                    variant: 'info',
                    toaster: 'b-toaster-top-center',
                    solid: true
                  }
                );
                setTimeout(() => {
                  this.$router.push('/home');
                }, 1800);
              },
              error => {
                // eslint-disable-next-line
                console.log(this.user);
                this.$bvToast.toast((error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString(), {
                  title: 'Error',
                  variant: 'danger',
                  toaster: 'b-toaster-top-center',
                  solid: true
                });
                this.loading = false;
                this.message ="error"
                  
              }
            );
          }
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
