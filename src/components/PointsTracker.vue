<template lang="html">
  <div class="point-tracker">
    <!-- {{displayPointChanges}} -->

    <div class="score-modifier" v-if="role === 'master'">
      <div class="score-modifier__b1">
        <h3 class="category-title">{{ context }}</h3>
      </div>
      <div class="score-modifier__b2">
        <div class="score-modifier__b2-part">
          <button type="button" name="button" class="wp-modifier minus" @click="subtractWP(playerIndex, context)">-</button>
          <div class="wp-modified" >WP: {{ displayWPChanges }}</div>
          <button type="button" name="button" class="wp-modifier plus" @click="addWP(playerIndex, context)">+</button>
        </div>
        &nbsp;
        <div class="score-modifier__b2-part">
          <button type="button" name="button" class="lp-modifier minus" @click="subtractLP(playerIndex, context)">-</button>
          <div class="lp-modified" >LP: {{ displayLPChanges }}</div>
          <button type="button" name="button" class="lp-modifier plus" @click="addLP(playerIndex, context)">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import sharedb from '@/sharedb'

export default {
  props: ['roundIndex', 'player', 'context', 'playerIndex'],
  computed: {
    ...mapState(['role', 'players']),
    displayPointChanges() {
      let finalString = "";
      // console.log(this.context);
      // console.log(this.player[this.context][this.roundIndex-1]);
      // console.log(this.player[this.context][this.roundIndex-1].wp);
      if (this.player[this.context][this.roundIndex-1] && this.player[this.context][this.roundIndex-1].wp !== undefined) {
        finalString += `WP: ${this.player[this.context][this.roundIndex-1].wp}`
      } else {
        finalString += `WP: 0`
      }
      finalString += " / "
      if (this.player[this.context][this.roundIndex-1] && this.player[this.context][this.roundIndex-1].lp !== undefined) {
        finalString += `LP: ${this.player[this.context][this.roundIndex-1].lp}`
      } else {
        finalString += `LP: 0`
      }
      return finalString
    },
    displayWPChanges() {
      let finalString = ""
      if (this.player[this.context][this.roundIndex-1] && this.player[this.context][this.roundIndex-1].wp !== undefined) {
        finalString += `${this.player[this.context][this.roundIndex-1].wp}`
      } else {
        finalString += `0`
      }
      return finalString
    },
    displayLPChanges() {
      let finalString = ""
      if (this.player[this.context][this.roundIndex-1] && this.player[this.context][this.roundIndex-1].lp !== undefined) {
        finalString += `${this.player[this.context][this.roundIndex-1].lp}`
      } else {
        finalString += `0`
      }
      return finalString
    }
  },
  data() {
    return {

    }
  },
  methods: {
    subtractWP(playerIndex, context) {
      // this.players[playerIndex].WP --
      let modifiedPlayer = {}
      Object.assign(modifiedPlayer, this.players[playerIndex])
      if (modifiedPlayer.WP > 0) {
        modifiedPlayer.WP--
      }

      if (modifiedPlayer[context][this.roundIndex-1] && modifiedPlayer[context][this.roundIndex-1].wp !== undefined) {
        modifiedPlayer[context][this.roundIndex-1].wp--
      } else {
        modifiedPlayer[context][this.roundIndex-1] = { wp: 0, lp: 0 }
        modifiedPlayer[context][this.roundIndex-1].wp--
      }

      let op = [{
        p: ['players', playerIndex],
        ld: this.players[playerIndex],
        li: modifiedPlayer
      }]
      sharedb.submitOperation(op)
    },
    addWP(playerIndex, context) {
      // this.players[playerIndex].WP ++
      let modifiedPlayer = {}
      Object.assign(modifiedPlayer, this.players[playerIndex])
      modifiedPlayer.WP++

      if (modifiedPlayer[context][this.roundIndex-1] && modifiedPlayer[context][this.roundIndex-1].wp !== undefined) {
        modifiedPlayer[context][this.roundIndex-1].wp++
      } else {
        modifiedPlayer[context][this.roundIndex-1] = { wp: 0, lp: 0 }
        modifiedPlayer[context][this.roundIndex-1].wp++
      }

      let op = [{
        p: ['players', playerIndex],
        ld: this.players[playerIndex],
        li: modifiedPlayer
      }]
      sharedb.submitOperation(op)
    },
    subtractLP(playerIndex, context) {
      // this.players[playerIndex].LP --
      let modifiedPlayer = {}
      Object.assign(modifiedPlayer, this.players[playerIndex])
      if (modifiedPlayer.LP > 0) {
        modifiedPlayer.LP--
      }
      if (modifiedPlayer[context][this.roundIndex-1] && modifiedPlayer[context][this.roundIndex-1].lp !== undefined) {
        modifiedPlayer[context][this.roundIndex-1].lp--
      } else {
        modifiedPlayer[context][this.roundIndex-1] = { wp: 0, lp: 0 }
        modifiedPlayer[context][this.roundIndex-1].lp--
      }

      let op = [{
        p: ['players', playerIndex],
        ld: this.players[playerIndex],
        li: modifiedPlayer
      }]
      sharedb.submitOperation(op)
    },
    addLP(playerIndex, context) {
      let modifiedPlayer = {}
      Object.assign(modifiedPlayer, this.players[playerIndex])
      modifiedPlayer.LP++

      if (modifiedPlayer[context][this.roundIndex-1] && modifiedPlayer[context][this.roundIndex-1].lp !== undefined) {
        modifiedPlayer[context][this.roundIndex-1].lp++
      } else {
        modifiedPlayer[context][this.roundIndex-1] = { wp: 0, lp: 0 }
        modifiedPlayer[context][this.roundIndex-1].lp++
      }

      let op = [{
        p: ['players', playerIndex],
        ld: this.players[playerIndex],
        li: modifiedPlayer
      }]
      sharedb.submitOperation(op)
    },
  }
}
</script>

<style lang="scss" scoped>
.point-tracker {
  border-bottom: 1px solid #4AAE9B;
}
.score-modifier {
  // margin-bottom: 20px;
  display: grid;
  grid-template-columns: 2fr 3fr;

  &__b1 {
    text-align: right;
    padding: 30px;
    display: table;
    vertical-align: middle;
    & .category-title {
      display: inline-block;
      font-weight: 700;
      font-size: 21px;
      margin-right: 20px;
      text-transform: capitalize;
      margin: 10px 0 0 0;
    }
  }
  &__b2 {
    text-align: left;
    padding: 30px;
    &-part {
      display: inline-block;
    }
  }
  /* width: 500px; */
}

.wp-modifier {
  background-color: var(--welfare-points);
}
.lp-modifier {
  background-color: var(--legitimacy-points)//#5b5bff;
}
.minus {
  /* clip-path: polygon(0% 50%, 100% 0%, 100% 100%) */
}
.plus {
  /* clip-path: polygon(0% 0%, 100% 50%, 0% 100%) */
}
.wp-modified, .lp-modified {
  display: inline-flex;
  /* background-color: orange; */
  /* color: white; */
  font-weight: bold;
  height: 41px;
  /* line-height: -moz-block-height; */
  /* width: 20px; */
  justify-content: center;
  margin: 5px;

}

@media only screen and (max-width: 600px) {
  .score-modifier {
    grid-template-columns: 1fr;
    &__b1 {
      text-align: center;
    }
    &__b2 {
      text-align: center;
      &-part {
        display: block;
      }
    }
  }
}

</style>
