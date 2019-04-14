<template lang="html">
  <section class="simple-container">
    <label for="gameId">Enter game id</label>
    <input type="text" name="" v-model="gameId" id="gameId">
    <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
    <br>
    <button type="button" name="button" class="standard-btn" @click="loadGame">Load</button>
  </section>
</template>

<script>
import { bus } from '@/main'
import sharedb from '@/sharedb'

export default {
  data() {
    return {
      gameId: null,
      errorMessage: null
    }
  },
  methods: {
    loadGame() {
      if (this.gameId) {
        sharedb.load(this.gameId)
      }
    }
  },
  mounted() {
    bus.$on('wrongId', () => {
      this.errorMessage = 'Wrong game id'
    })
  }
}
</script>

<style lang="css" scoped>
.error {
  color: red;
  margin-bottom: 0;
}
</style>
