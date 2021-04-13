<template>
  <div class="container">
    <header class="jumbotron">
      <recette v-if="content" :FiltredRecette = content :role = role></recette>
            <div v-else>{{err}}</div>

    </header>
  </div>
</template>

<script>
import UserService from '../services/user.service';

export default {
  name: 'User',
  data() {
    return {
      content: '',
      err:'',
      role : "user"    };
  },
  mounted() {
    UserService.getUserBoard().then(
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
