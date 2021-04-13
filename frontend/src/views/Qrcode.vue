<template>
  <b-row class="col-md-12">
    <b-col cols="8">
      <div class="card card-container">
        <h6>Authenticate with QRcode as a guest</h6>
        <img
          id="profile-img"
          src="https://www.clipartkey.com/mpngs/m/192-1920395_barcode-svg-fake-circle-qr-code-icon-png.png"
          class="profile-img-card"
        />
        <form name="form" @submit.prevent="generateQrcode()">
          <label for="userinput">Username</label>
          <input
            v-model="userinput"
            v-validate="'required'"
            type="text"
            name="userinput"
          />

          <button v-b-toggle.collapse-4 class="btn btn-primary btn-block">
            generate
          </button>
          <div
            v-if="errors.has('userinput')"
            class="alert alert-danger"
            role="alert"
          >
            Username is required!
          </div>
        </form>
        <form name="form2" @submit.prevent="decodeQrcode()">
          <h4>Enter your code</h4>
          <input
            v-model="code"
            v-validate="'required'"
            type="text"
            name="code"
          />

          <button class="btn btn-primary btn-block">
            Verify
          </button>
          <div
            v-if="errors.has('code')"
            class="alert alert-danger"
            role="alert"
          >
            Username is required!
          </div>
        </form>
      </div>
      <div v-if="errorverif" class="alert alert-danger" role="alert">
        This field may not be greater than 5 characters
      </div>
      <div v-if="error" class="alert alert-danger" role="alert">
        This field may not be greater than 5 characters
      </div>
    </b-col>
    <b-col cols="4">
      <vue-qrcode
        v-if="(userinput != '') & (generated == true)"
        v-bind:value="qrValue"
        errorCorrectionLevel="H"
      />
    </b-col>
    
  </b-row>
</template>
<script>
import VueQrcode from 'vue-qrcode';
import User from '../models/user';
export default {
  name: 'Qrcode',

  data() {
    return {
      user: new User('', ''),
      qrValue: 'admin',
      userinput: '',
      generated: false,
      error: false,
      errorverif: false,
      code: null,
      userInfo: this.$store.state.auth.user
    };
  },

  methods: {
    
    generateQrcode() {
      this.loading = true;
      this.$validator.validate('userinput').then(isValid => {
        if (!isValid) {
          this.loading = false;
          return;
        }
        if (this.userinput.length > 5) {
          this.error = true;
          this.generated = false;
          // eslint-disable-next-line
          console.log(this.userInfo);
        } else {
          // eslint-disable-next-line
          this.user.username = this.userinput;
          // eslint-disable-next-line
          console.log(this.user.username);
          this.$store.dispatch('auth/loginguest', this.user).then(
            response => {
              // eslint-disable-next-line
              console.log(this.user.username);
              this.qrValue = response.accessToken.substr(
                response.accessToken.length - 5
              );
              // eslint-disable-next-line
              console.log(this.qrValue);

              this.error = false;
              this.generated = true;
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
    decodeQrcode() {
      this.loading = true;
      this.$validator.validate('code').then(isValid => {
        if (!isValid) {
          this.loading = false;
          return;
        }
        var codeToverify = this.$store.state.auth.user.accessToken.substr(
          this.$store.state.auth.user.accessToken.length - 5
        );
        if (codeToverify == this.code) {
          // eslint-disable-next-line
          console.log('gooooooooooood');
          this.$router.push('/home');
        } else {
          this.errorverif = true;
        }
      });
    }
  },
  components: {
    VueQrcode
  }
};
</script>
<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
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
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>
