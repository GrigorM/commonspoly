<template lang="html">
  <section id="revolution-container">
    <div class="revolution" v-if="!hasRevolution(roundIndex) && roundIndex==round">
      <button type="button" name="button" @click="startUprising" v-if="!revolution"
        :disabled="totalLP < 10*players.length">
        Start collective uprising
      </button>
      <div class="" v-if="revolution"> <!--v-if="revolution" -->
        <button type="button" name="button" @click="commonise"
        :disabled="revolutionPoints < 10*players.length || revolutionaries.length < 2">
          Commonise!
        </button>
        <span>Total points: {{ revolutionPoints }}</span>
      </div>
    </div>
    <div class="revolution-grid">
      <div class="revolution" v-for="(player, playerIndex) in players" :key="700+playerIndex" v-if="revolution && !hasRevolution(roundIndex)">
        <input type="checkbox" name="revolutionaries" :value="player.name"
          v-model="revolutionaries" :disabled="revolutionaries.length >= 2"><br>
        <span>Contribute LPs</span><br/>
        <div class="custom-input-container">
          <button type="button" class="custom-input-btn" @click="revolutionLPs('sub', playerIndex)">-</button>
          <input type="text" name="" class="custom-input" v-model="lpsForRevolution[playerIndex]">
          <button type="button" class="custom-input-btn" @click="revolutionLPs('add', playerIndex)">+</button>
        </div>

        <!-- Contribution: {{ lpsForRevolution[playerIndex] }} -->
      </div>
    </div>
    <div class="post-revolution-grid">
      <div class="revolution-data"  v-for="(player, playerIndex) in players" v-if="hasRevolution(roundIndex)">
        <!-- v-for="rev in whichRevolution(roundIndex)" -->
        <span class="star" v-if="whichRevolution(roundIndex).revolutionaries.indexOf(player.name) !== -1" ></span>
        <span v-else class="nostar"></span>
        Contribution: {{ whichRevolution(roundIndex).lps[playerIndex] }} LPs
      </div>
    </div>

  </section>
</template>

<script>
import { mapState } from 'vuex'
import sharedb from '@/sharedb'

export default {
  name: 'Uprising',
  props: ['roundIndex'],
  data() {
    return {
      revolution: false,
      // revolutionPoints: 0,
      revolutionaries: [],
      lpsForRevolution: []
    }
  },
  computed: {
    ...mapState(['players', 'revolutions', 'round']),
    totalLP() {
      return this.players.reduce((sum, player) => {
        return sum + player.LP
      }, 0)
    },
    revolutionPoints() {
      return this.lpsForRevolution.reduce((sum, contribution) => {
        return sum + parseInt(contribution)
      }, 0)
    }
  },
  methods: {
    startUprising() {
      this.revolution = true
      // this.players.forEach(p => this.lpsForRevolution.push(0))
      for(let i=0; i<this.players.length; i++) {
        this.$set(this.lpsForRevolution, i, 0)
      }
      // this.lpsForRevolution = this.players.map(p => 0);
    },
    revolutionLPs(action, index) {
      if (action === 'add' && this.lpsForRevolution[index] < this.players[index].LP) {
        // this.lpsForRevolution[index] ++
        this.$set(this.lpsForRevolution, index, parseInt(this.lpsForRevolution[index])+1)
      } else if (action == 'sub' && this.lpsForRevolution[index] > 0) {
        // this.lpsForRevolution[index] --
        this.$set(this.lpsForRevolution, index, this.lpsForRevolution[index]-1)
      }
    },
    commonise() {
      let revolution = {};
      revolution.revolutionaries = this.revolutionaries
      revolution.lps = this.lpsForRevolution
      revolution.round = this.round
      // empty revolutionaries array
      this.revolutionaries.splice(0, -1)
      // ruaj piket e harxhuara nga secili user gjate revolucionit
      let i = 0;
      let updateInterval = setInterval(() => {
        if (i < this.players.length) {
          // update players LPs
          let modifiedPlayer = {}
          Object.assign(modifiedPlayer, this.players[i])
          modifiedPlayer.LP -= this.lpsForRevolution[i]
          this.$set(this.lpsForRevolution, i, 0)
          // modifiedPlayer.revolutions.push
          let op = [{
            p: ['players', i],
            ld: this.players[i],
            li: modifiedPlayer
          }]
          sharedb.submitOperation(op)
          i++;
        } else {
          // submit revolution data
          let op = [{
            p: ['revolutions', this.revolutions.length],
            li: revolution
          }]
          sharedb.submitOperation(op)
          clearInterval(updateInterval)
          updateInterval = null;
        }
      }, 500)
      this.revolution = false
    },
    hasRevolution(roundIndex) {
      return this.revolutions.findIndex(r => r.round == roundIndex) !== -1 ? true : false
    },
    whichRevolution(roundIndex) {
      return this.revolutions.filter(r => r.round == roundIndex)[0]
    }
  }
}
</script>

<style lang="scss" scoped>
section {
  margin-bottom: 0px;
  .full-row {
    grid-column: 1 / -1;
  }
  .revolution-grid, .post-revolution-grid {
    display: grid;
    grid-template-columns: repeat(var(--number-of-players), minmax(300px, 1fr));
  }
  .revolution {
    padding: 10px;
    border: 1px solid gray;
    .custom-input-container {
      border: 1px solid rgba(0, 0, 0, .12);
      display: inline-block;
      .custom-input {
        // appearance: none;
        // -webkit-appearance: none;
        // -moz-appearance: none;
        // background: none;
        border: none;
        // -webkit-border-radius: 0;
        // border-radius: 0;
        // border-radius: none;
        box-sizing: border-box;
        // font-size: 1em;
        // line-height: 1.5;
        text-align: center;
        display: inline-block;
        width: 50px;
      }
      .custom-input-btn {
        background-color: transparent;
        color: gray;
      }
    }

    button {
      font-weight: bold;
      background-color: #ef767a; //#a11a1b;
      // background-color: transparent;

      &:hover, &:active, &:disabled, &:focus {
        border: 1px solid #ef767a;
      }
    }
  }
  .revolution-data {
    height: 50px;
    text-align: center;
    .star {
      margin: auto;
      width: 25px;
      height: 25px;
      display: inline-block;
      background-color: #c21b1c;
      -webkit-clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
      clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
      display: block;
    }
    .nostar {
      height: 25px;
      display: block;
    }
  }
}

</style>
