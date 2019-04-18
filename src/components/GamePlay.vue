<template lang="html">
  <section id="container">
    <div class="" v-if="role === 'master'">
      <h1>Game: {{ gameId }}</h1>
      <h2>Total LP: {{ totalLP }}</h2>
      <div class="table" id="gameTable">
        <div class="header">
          <div class="header-cell" v-for="(player, index) in players" :key="index">
            {{ player.character }} / {{ player.name }} <br/>
            WP: {{ player.WP }} <br/>
            LP: {{ player.LP }} <br/>
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

            <Uprising :roundIndex="roundIndex" class="full-row revolution-container"/>

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
import Uprising from '@/components/Uprising'

export default {
  components: {
    UnlockGoods,
    PointsTracker,
    SelectedPlayer,
    Unlocked,
    Uprising
  },
  data() {
    return {
      activeRound: null,
      selectedRound: null,
      selectedPlayerIndex: null,
      id: '',
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
    document.documentElement.style.setProperty('--number-of-players', this.players.length)
  }
};
</script>

<style lang="scss" scoped>
#container {
  color: #003949;
}
#gameTable {
  overflow-x: scroll;
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
        .edit-player-box, .revolution-data, .revolution, .revolution-container {
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

    }
  }
  .next-round {
    background-color: var(--color-primary);
  }
}
</style>
