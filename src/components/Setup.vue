<template lang="html">
  <section class="setup">
    <!-- <h1>Commonspoly</h1> -->
    <b>Add players:</b>
    <form class="" action="index.html" method="post">
      <label for="name">Name</label>
      <input type="text" id="name" v-model="name">
      <label for="character">Character</label>
      <input type="text" id="character" v-model="character">
      <label for="h">Care / Health</label>
      <input type="number" id="h" v-model="h">
      <label for="u">Occupy / Urban</label>
      <input type="number" id="u" v-model="u">
      <label for="i">Share / Ideas</label>
      <input type="number" id="i" v-model="i">
      <label for="e">Regenarative / Environment</label>
      <input type="number" id="e" v-model="e">
      <br>
      <button type="button" name="button" @click="addPlayer">Add player</button>
    </form>
    <div class="list-of-players">
      <div v-for="player in players">
        {{ player.name }} / {{ player.character }} :
        <span class="purple">{{ player.h }}</span> /
        <span class="red">{{ player.u }}</span> /
        <span class="yellow">{{ player.i }}</span> /
        <span class="green">{{ player.e }}</span> /
      </div>
    </div>
    <label for="code">Master access code</label>
    <input type="text" id="code" v-model="code">
    <br>
    <button type="button" name="button" :disabled="players.length < 2 || code == ''" @click="startGame">Start game</button>

  </section>
</template>

<script>
import { mapState } from 'vuex';
import sharedb from '@/sharedb'

export default {
  data() {
    return {
      name: '',
      character: '',
      h: 0,
      u: 0,
      i: 0,
      e: 0,
      code: ''
    }
  },
  computed: {
    ...mapState(['players'])
  },
  methods: {
    addPlayer() {
      if (this.name && this.character && this.h && this.u && this.i && this.e) {
        this.$store.dispatch('addPlayer', {
          name: this.name,
          character: this.character,
          h: this.h,
          u: this.u,
          i: this.i,
          e: this.e,
          WP: 5,
          LP: 5,
          global: [],
          situations: [],
          goodsUnlocked: [],
          rewards: []
        })
        this.name = "";
        this.character = "";
        this.h = 0;
        this.u = 0;
        this.i = 0;
        this.e = 0;
      }
    },
    startGame() {
      sharedb.initialize(this.players, this.code);
    }
  }
}
</script>

<style lang="css" scoped>
.setup {
  max-width: 600px;
}

.list-of-players {
  margin: 20px 0;
}
.purple{
  color: var(--health-color);
  font-weight: bold;
}
.red{
  color: var(--urban-color);
  font-weight: bold;
}
.yellow{
  color: var(--intangible-color);
  font-weight: bold;
}
.green{
  color: var(--environmental-color);
  font-weight: bold;
}
</style>
