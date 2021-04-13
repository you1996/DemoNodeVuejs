<template>
  <div class="container">
    <header class="jumbotron">
      <recette :FiltredRecette = content :role = role></recette>
      <h3>Protected</h3>
    </header>
  </div>
</template>

<script>
import UserService from '../services/user.service';
import Recette from './Recette.vue';

export default {
  name: 'Home',
  data() {
    return {
      content: '',
      role : "public"
    };
  },
  
  mounted (){
    UserService.getPublicContent().then(
      response => {
        this.content = response.data;
      },
      error => {
        this.content =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
      }
    )
  },
  components: {
    recette : Recette
  },
};
</script>
