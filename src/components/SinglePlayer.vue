<template lang="html">
  <section v-if="singlePlayer" class="single-player-view">
    <!-- <h1>Single player view</h1> -->
    <button type="button" name="button" class="refresh-btn" @click="refreshData()">&#8635;</button>
    <h1>{{ singlePlayer.name }} / {{ singlePlayer.character }}</h1>
    <!-- <div class="coins wp">
      {{ singlePlayer.WP }}
    </div>
    <div class="coins lp">
      {{ singlePlayer.LP }}
    </div> -->
    <Coins :wp="singlePlayer.WP" :lp="singlePlayer.LP"/>
    <Skills :health="singlePlayer.h" :urban="singlePlayer.u" :intangible="singlePlayer.i" :environmental="singlePlayer.e"/>
    <!-- <div class="unlocks health">
      {{ filterGoods('health') }}
    </div>
    <div class="unlocks urban">
      {{ filterGoods('urban') }}
    </div>
    <div class="unlocks intangible">
      {{ filterGoods('intangible') }}
    </div>
    <div class="unlocks environmental">
      {{ filterGoods('environmental') }}
    </div> -->
    <Unlocked :playerIndex="playerIndex"/>
    <!-- {{ playerIndex }} -->
    <div class="group-lp">
      Group LPs: {{ totalLP }}
    </div>
    <div class="round" v-for="roundIndex in round" :key="roundIndex" :class="collapsed(roundIndex)">
      <div class="full-row round-number">
        <span @click="viewRound(roundIndex)">Round {{ roundIndex }}</span>
      </div>
      <div class="full-row global">
        <h3 style="display: inline-block">Global effect:</h3>
        {{ displayPointChanges('global', roundIndex) }}
      </div>
      <div class="full-row situation">
        <h3 style="display: inline-block">Situation effect:</h3>
        <!-- WP: {{ singlePlayer.situations[roundIndex-1].wp }}
        LP: {{ singlePlayer.situations[roundIndex-1].lp }} -->
        {{ displayPointChanges('situations', roundIndex) }}
      </div>
      <div class="full-row">
        <h3 style="display: inline-block">Unlocked:</h3>
        {{ displayUnlocks(roundIndex) }}
      </div>
      <div class="full-row rewards">
        <h3 style="display: inline-block">Rewards:</h3>
        <!-- WP: {{ singlePlayer.situations[roundIndex-1].wp }}
        LP: {{ singlePlayer.situations[roundIndex-1].lp }} -->
        {{ displayPointChanges('rewards', roundIndex) }}
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import sharedb from '@/sharedb'
import Coins from '@/components/Coins'
import Skills from '@/components/Skills'
import Unlocked from '@/components/Unlocked'

export default {
  components: {
    Coins,
    Skills,
    Unlocked
  },
  data() {
    return {
      activeRound: null
    }
  },
  computed: {
    ...mapState(['singlePlayer', 'round', 'players', 'gameId']),
    playerIndex() {
      return this.players.indexOf(this.singlePlayer)
    },
    totalLP() {
      return this.players.reduce((sum, player) => {
        return sum + player.LP
      }, 0)
    },
  },
  methods: {
    collapsed(round) {
      if (round < this.round && !(this.activeRound === round)) return 'collapsed'
      else if (round === this.round && (this.activeRound !== null && this.activeRound !== round)) return 'collapsed'
      else return 'active'
    },
    viewRound(roundIndex) {
      this.activeRound = roundIndex
    },
    displayPointChanges(context, roundIndex) {
      let finalString = "";
      // console.log(this.context);
      // console.log(this.player[this.context][this.roundIndex-1]);
      // console.log(this.player[this.context][this.roundIndex-1].wp);
      if (this.singlePlayer[context][roundIndex-1] && this.singlePlayer[context][roundIndex-1].wp !== undefined) {
        finalString += `WP: ${this.singlePlayer[context][roundIndex-1].wp}`
      } else {
        finalString += `WP: 0`
      }
      finalString += " / "
      if (this.singlePlayer[context][roundIndex-1] && this.singlePlayer[context][roundIndex-1].lp !== undefined) {
        finalString += `LP: ${this.singlePlayer[context][roundIndex-1].lp}`
      } else {
        finalString += `LP: 0`
      }
      return finalString
    },
    displayUnlocks(roundIndex) {
      // if (this.singlePlayer.goodsUnlocked[roundIndex])
      return this.singlePlayer.goodsUnlocked[roundIndex-1] ? this.singlePlayer.goodsUnlocked[roundIndex-1] : 'nothing'
    },
    filterGoods(type) {
      return this.singlePlayer.goodsUnlocked.filter(g => g == type).length
    },
    refreshData() {
      sharedb.refresh(this.gameId)
    }
  },
  mounted() {
    if (!this.singlePlayer) {
      this.$router.push({ name: 'game', params: { gameId: this.$route.params.gameId } })
    } else {
      console.log(this.singlePlayer);
    }
  }
}
</script>

<style lang="scss" scoped>
.single-player-view {
  text-align: center;
  .group-lp {
    font-size: 20px;
    font-weight: 700;
    margin: 10px auto;
  }
  .coins {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    color: white;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
    font-size: 20pt;
    // display: inline-block;
    &.wp {
      background: orange;
    }
    &.lp {
      background: #5bb3ff;
    }
  }
  .unlocks {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: white;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
    &.health {
      background-color: purple;
    }
    &.urban {
      background-color: red;
    }
    &.intangible {
      background-color: gold;
    }
    &.environmental {
      background-color: green;
    }
  }
  .round {
    border: 1px solid gray;
    overflow: hidden;
    transition: height .5s;
    &.collapsed {
      height: 50px;
    }
    .round-number {
      // background-color: lightgreen;
      background-color: #9fe99f;
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
    .full-row {
      h3 {
        font-size: 19px;
        font-weight: bold;
      }
    }
  }
  .refresh-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    padding: 0;
    background-color: transparent;
    color: var(--font-color);
    font-size: 30px;
    border-radius: 50%;
    &:hover {
      border: 1px solid var(--color-primary);
    }
  }
}
</style>
