<template>
  <b-container class="bv-example-row bv-example-row-flex-cols">
    <b-row align-v="stretch">
      <b-col align-self="center"
        ><b-button v-b-toggle.collapse-1 variant="dark">Login</b-button></b-col
      >
      <b-col align-self="center"
        ><b-button v-b-toggle.collapse-2 variant="dark"
          >register</b-button
        ></b-col
      >
      <b-col align-self="center"
        ><b-button v-b-toggle.collapse-5 variant="dark"
          >Social Login</b-button
        ></b-col
      >
      <b-col align-self="center"
        ><b-button v-b-toggle.collapse-3 variant="dark"
          >QRCODE(MFA)</b-button
        ></b-col
      >
      <b-col align-self="center"
        ><b-button v-b-toggle.collapse-4 variant="dark"
          >CodeEmail(MFA)</b-button
        ></b-col
      >
      
      <b-col align-self="center"
        ><b-button  variant="dark"
          >device detection(MFA)</b-button
        ></b-col
      >
      <vue-country-code
        @onSelect="onSelect"
        :disabledFetchingCountry="true"
      >
      </vue-country-code>
    </b-row>
    <!-- <b-col align-self="baseline"
        >
        
        </b-col
      > -->
    <b-row>
      <b-col align-self="stretch"
        ><div class="accordion">
          <b-collapse id="collapse-1" visible accordion="my-accordion">
            <b-col><login id="" /> </b-col
          ></b-collapse>
          <b-collapse id="collapse-2" accordion="my-accordion">
            <b-col> <register /> </b-col></b-collapse
          ><b-collapse id="collapse-3" accordion="my-accordion"
            ><b-col> <vueqrcode /> </b-col></b-collapse
          ><b-collapse id="collapse-4" accordion="my-accordion"
            ><b-col> <emailcode /> </b-col
          ></b-collapse></div
      ></b-col>
    </b-row>
  </b-container>
</template>

<script>
import Login from '../views/Login';
import Register from '../views/Register';
import Qrcode from '../views/Qrcode';
import EmailCode from '../views/emailcode'
//import $ from 'jquery'

//import DeviceDetector from 'device-detector-js';
export default {
  data() {
    return {
      content: '',
      role: 'public'
    };
  },
 

  components: {
    login: Login,
    register: Register,
    vueqrcode: Qrcode,
    emailcode : EmailCode
  }
};
</script>
