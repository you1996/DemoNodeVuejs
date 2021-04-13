<template>
  <div class="container">
    <header class="jumbotron">
      <recette v-if="content" :FiltredRecette = content :role= role></recette>
      <div v-else>{{err}}</div>
    </header> 
  </div>
</template>

<script>
import UserService from '../services/user.service';
import Recette from './Recette.vue';

export default {
  name: 'Admin',
  
  data() {
    return {
      content: '',
      err:'',
      role : "admin"
    };
  },
  components: {
    recette : Recette
  },
  mounted() {
    UserService.getAdminBoard().then(
      response => {
        this.content = response.data;
      },
      error => {
        this.err =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  }
};
</script>
