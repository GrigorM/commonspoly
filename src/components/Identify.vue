<template lang="html">
  <section class="simple-container">
    Who are you?
    <input type="text" v-model="id">
    <span v-if="message">{{ message }}</span>
    <br>
    <button type="button" name="button" class="standard-btn" @click="identify()">That's me!</button>
  </section>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      message: null
    }
  },
  methods: {
    identify() {
      this.$store.dispatch('setRole', this.id).then(() => {
        if (this.$store.state.role == 'master') this.$router.push({ name: 'game', params: { gameId: this.$store.state.gameId } })
        else if (this.$store.state.role == '') this.message = 'Player does not exist'
        else this.$router.push({ name: 'single', params: { gameId: this.$store.state.gameId } })
      })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
