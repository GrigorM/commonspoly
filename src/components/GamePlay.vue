<template lang="html">
  <section id="container">
    <div class="" v-if="role === 'master'">
      <h3>Game: {{ gameId }}</h3>
      <p>Total LP: {{ totalLP }}</p>
      <div class="table" id="gameTable">
        <!-- {{ player.name }}, playing as {{ player.character }}, has {{ player.WP }} welfare points and {{ player.LP }} legitimacy points -->
        <div class="header">
          <div class="header-cell" v-for="(player, index) in players" :key="index">
            {{ player.character }} / {{ player.name }} <br/>
            WP: {{ player.WP }} <br/>
            LP: {{ player.LP }} <br/>
            <!-- <span class="goods-unlocked" v-for="good in player.goodsUnlocked" :class="good"></span> -->
            <!-- {{ totalForGood(index, 'health') }} <span class="goods-unlocked health"></span> /
            {{ totalForGood(index, 'urban') }} <span class="goods-unlocked urban"></span> /
            {{ totalForGood(index, 'intangible') }} <span class="goods-unlocked intangible"></span> /
            {{ totalForGood(index, 'environmental') }} <span class="goods-unlocked environmental"></span>  -->
            <Unlocked :playerIndex="index"/>
            <!-- <br/> -->
            <span v-if="isRevolutionary(player.name) > 0" class="star"
              v-for="r in isRevolutionary(player.name)"></span>
          </div>
        </div>
        <div class="rounds">
          <div class="round" v-for="roundIndex in round" :key="100+roundIndex" :class="collapsed(roundIndex)">
            <div class="full-row round-number">
              <span @click="viewRound(roundIndex)">Round {{ roundIndex }}</span>
            </div>

            <div class="edit-player-box" v-for="(player, index) in players" :key="600+index">
              <button type="button" name="button" @click="updatePlayer(player.character, roundIndex, index)">Edit</button>
            </div>


            <div class="full-row revolution" v-if="!hasRevolution(roundIndex) && roundIndex==round">
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
            <div class="revolution" v-for="(player, playerIndex) in players" :key="700+playerIndex" v-if="revolution && !hasRevolution(roundIndex)">
              <input type="checkbox" name="revolutionaries" :value="player.name"
                v-model="revolutionaries" :disabled="revolutionaries.length >= 2"><br>
              <span>Contribute LPs</span>
              <button type="button" name="button" @click="revolutionLPs('sub', playerIndex)">-</button>
              <button type="button" name="button" @click="revolutionLPs('add', playerIndex)">+</button>
              Contribution: {{ lpsForRevolution[playerIndex] }}
            </div>
            <div class="revolution-data"  v-for="(player, playerIndex) in players" v-if="hasRevolution(roundIndex)">
              <!-- v-for="rev in whichRevolution(roundIndex)" -->
              <span class="star" v-if="whichRevolution(roundIndex).revolutionaries.indexOf(player.name) !== -1" ></span>
              <span v-else class="nostar"></span>
              Contribution: {{ whichRevolution(roundIndex).lps[playerIndex] }} LPs
            </div>
          </div>
        </div>
        <button class="next-round" type="button" name="button" @click="addRound()">Next round</button>
      </div>
    </div>
    <SelectedPlayer :editPlayer="selectedPlayer" :editPlayerIndex="selectedPlayerIndex"
                    :editRound="selectedRound" v-show="selectedPlayer"/>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import sharedb from '@/sharedb'
import UnlockGoods from '@/components/UnlockGoods'
import PointsTracker from '@/components/PointsTracker'
import SelectedPlayer from '@/components/SelectedPlayer'
import Unlocked from '@/components/Unlocked'

export default {
  components: {
    UnlockGoods,
    PointsTracker,
    SelectedPlayer,
    Unlocked
  },
  data() {
    return {
      activeRound: null,
      selectedRound: null,
      selectedPlayerIndex: null,
      id: '',
      revolution: false,
      // revolutionPoints: 0,
      revolutionaries: [],
      lpsForRevolution: []
    }
  },
  computed: {
    ...mapState(['round', 'gameId', 'role', 'revolutions', 'selectedPlayer']),
    ...mapGetters(['players']),
    totalLP() {
      return this.players.reduce((sum, player) => {
        return sum + player.LP
      }, 0)
    },
    revolutionPoints() {
      return this.lpsForRevolution.reduce((sum, val) => {
        return sum + val
      }, 0)
    }
  },
  methods: {
    addRound() {
      this.activeRound = null
      const op = [{
        p: ['round'],
        na: 1
      }]
      sharedb.submitOperation(op);
      // this.$store.dispatch('incrementRound')
    },
    collapsed(round) {
      if (round < this.round && !(this.activeRound === round)) return 'collapsed'
      else if (round === this.round && (this.activeRound !== null && this.activeRound !== round)) return 'collapsed'
      else return 'active'
      // if (round === this.round || this.activeRound === round) return 'active'
      // else if (this.activeRound !== round) return 'collapsed'
      // return ''
    },
    updatePlayer(character, round, index) {
      this.selectedRound = round;
      this.selectedPlayerIndex = index;
      this.$store.dispatch('selectCharacter', character)
    },
    totalForGood(index, typeOfGood) {
      if (index > -1)
        return this.players[index].goodsUnlocked.reduce((sum, g) => { return g == typeOfGood ? sum + 1 : sum; }, 0)
      else {
        let i = this.players.findIndex(p => p.name === this.role);
        return this.players[i].goodsUnlocked.reduce((sum, g) => { return g == typeOfGood ? sum + 1 : sum; }, 0)
      }
    },
    viewRound(roundIndex) {
      this.activeRound = roundIndex
    },
    startUprising() {
      this.revolution = true
      // this.players.forEach(p => this.lpsForRevolution.push(0))
      for(let i=0; i<this.players.length; i++) {
        this.$set(this.lpsForRevolution, i, 0)
      }
      // this.lpsForRevolution = this.players.map(p => 0);
    },
    revolutionLPs(action, index) {
      let modifiedPlayer = {}
      if (action == 'add') {
        if (this.players[index].LP > 0) { // > this.lpsForRevolution[index]
          this.$set(this.lpsForRevolution, index, this.lpsForRevolution[index]+1)

          Object.assign(modifiedPlayer, this.players[index])
          modifiedPlayer.LP--
          let op = [{
            p: ['players', index],
            ld: this.players[index],
            li: modifiedPlayer
          }]
          sharedb.submitOperation(op)
        }
      } else if (action == 'sub' && this.lpsForRevolution[index] > 0) {
        this.$set(this.lpsForRevolution, index, this.lpsForRevolution[index]-1)

        Object.assign(modifiedPlayer, this.players[index])
        modifiedPlayer.LP++
        // modifiedPlayer.revolutions.push
        let op = [{
          p: ['players', index],
          ld: this.players[index],
          li: modifiedPlayer
        }]
        sharedb.submitOperation(op)
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
      let op = [{
        p: ['revolutions', this.revolutions.length],
        li: revolution
      }]
      sharedb.submitOperation(op)
      this.revolution = false
    },
    hasRevolution(roundIndex) {
      return this.revolutions.findIndex(r => r.round == roundIndex) !== -1 ? true : false
    },
    whichRevolution(roundIndex) {
      return this.revolutions.filter(r => r.round == roundIndex)[0]
    },
    isRevolutionary(name) {
      let uprisings = [];
      this.revolutions.forEach(r => {
        if (r.revolutionaries.indexOf(name) !== -1) uprisings.push(r.round)
      })
      return uprisings.length
    }
  },
  mounted() {
    if (this.players.length === 0)
      sharedb.load(this.$route.params.gameId)
    // console.log(this.$route.params.gameId);
    let el = document.getElementById('gameTable');
    if (el) {
      el.style.setProperty('--number-of-players', this.players.length)
      setTimeout(() => {
        let el = document.getElementById('gameTable');
        el.style.setProperty('--number-of-players', this.players.length)
      }, 1000)
    }

  }
};
</script>

<style lang="scss" scoped>
#container {
  --number-of-players: 0;
  color: #003949;
}
#gameTable {
  overflow-x: scroll;
  .star {
    margin: auto;
    width: 25px;
    height: 25px;
    display: inline-block;
    background-color: #c21b1c;
    -webkit-clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  }
  .table {
    display: grid;
  }
  .header {
    // border: 2px double black;
    display: grid;
    grid-template-columns: repeat(var(--number-of-players), minmax(300px, 1fr));
    .header-cell {
      border-left: 2px double black;
      border-top: 2px double black;
      border-bottom: 2px double black;
      // &:not(:last-child) {
      //
      // }
      &:last-child {
        border-right: 2px double black;
      }

      .goods-unlocked {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: inline-block;
        &.health{
          background-color: purple;
        }
        &.urban{
          background-color: red;
        }
        &.intangible{
          background-color: gold;
        }
        &.environmental{
          background-color: green;
        }
      }
    }
  }
  .rounds {
    margin-bottom: 20px;
    .round {
      display: grid;
      grid-template-columns: repeat(var(--number-of-players), minmax(300px, 1fr));
      // overflow-x: visible;
      // overflow-y: hidden;
      transition: height .5s;
      &.collapsed {
        // height: 50px;
        .edit-player-box, .revolution-data, .revolution {
          // opacity: 0;
          // visibility: hidden;
          display: none;
        }
      }
      .full-row {
        grid-column: 1 / -1;
      }
      .round-number {
        // background-color: lightgreen;
        background-color: #bad9b5;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          text-decoration: underline;
          &:hover {
            color: white
          }
        }
      }
      .global-effect {
        background-color: yellow;
        padding-top: 5px;
        padding-bottom: 10px;
      }
      .situation-effect {
        background-color: lightblue;
        padding-top: 5px;
        padding-bottom: 10px;
      }
      .unlocks {
        background-color: lightcoral;
        padding-top: 5px;
        padding-bottom: 10px;
      }
      .rewards {
        background-color: lightgray;
        padding-top: 5px;
        padding-bottom: 10px;
      }
      .wp-modifier {
        background-color: orange;
      }
      .lp-modifier {
        background-color: #5b5bff;
      }
      .health-good{
        background-color: purple;
      }
      .urban-good{
        background-color: red;
      }
      .intangible-good{
        background-color: gold;
      }
      .environmental-good{
        background-color: green;
      }
      .edit-player-box {
        padding: 10px;
        button {
          background-color: var(--color-primary);
          border-radius: 2px;
        }
      }
      .revolution {
        padding: 10px;
        border: 1px solid gray;
        button {
          font-weight: bold;
          background-color: #ef767a; //#a11a1b;
          &:hover, &:active, &:disabled, &:focus {
            border: 1px solid #ef767a;
          }
        }
      }
      .revolution-data {
        height: 50px;
        text-align: center;
        .star {
          display: block;
        }
        .nostar {
          height: 25px;
          display: block;
        }
      }

    }
  }
  .next-round {
    background-color: var(--color-primary);
  }
}
</style>
