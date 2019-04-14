<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <Setup v-if='!started'/>
    <GamePlay v-if='started'/> -->
    <router-view></router-view>
  </div>
</template>

<script>
import { bus } from '@/main'

export default {
  name: 'app',
  data() {
    return {
      started: false
    }
  },
  created() {
    bus.$on('startGame', (data) => {
      this.$store.dispatch('setGame', data)
      this.started = true;
      this.$router.push({ name: 'game', params: { gameId: data.gameId } })
    })

    bus.$on('loadGame', (data) => {
      this.$store.dispatch('loadGameStatus', data)
      // this.$router.push({ name: 'game', params: { gameId: data.gameId } })
      this.$router.push({ name: 'identify', params: { gameId: data.gameId } })
    })

    bus.$on('playerUpdate', (data) => {
      this.$store.dispatch('updatePlayer', data)
    })

    bus.$on('addRound', () => {
      this.$store.dispatch('incrementRound')
    })

    bus.$on('revolution', (data) => {
      this.$store.dispatch('storeRevolution', data)
    })

    bus.$on('refreshGame', (data) => {
      this.$store.dispatch('refreshGame', {...data})
    })
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
  color: var(--font-color);
}
body {
  background-color: var(--background-color);
  color: var(--font-color);
}

.standard-btn {
  background-color: var(--color-primary);
  color: white;
  border-radius: 2px;
  &:hover, &:focus, &:active {
    background-color: var(--color-primary-2);
    border: 1px solid var(--color-primary);
  }
}

.simple-container {
  max-width: 600px;
}
</style>
