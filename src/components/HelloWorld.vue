<template>
  <div class="hello">
    <h1>Welcome to Commonspoly</h1>
    <!-- <button type="button" name="button">Start new game</button>
    <button type="button" name="button">Load existing game</button> -->
    <router-link :to="{ name: 'setup', params: {} }">Start new game</router-link> <br>
    <router-link :to="{ name: 'load', params: {} }">Load existing game</router-link>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
