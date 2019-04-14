<template lang="html">
  <div class="unlock">
    <h3 class="category-title">Unlocks</h3>
    <div class="" v-if="!hasUnlocked1">
      <div class="input-group">
        <input type="radio" :name="name" v-model="typeOfGood" value="health"
         :checked="unlockedWhat=='health'" :disabled="hasUnlocked1" id="health-good" hidden>
        <label for="health-good">
          <span class="custom-radio health-btn"></span>
        </label>
      </div>

      <div class="input-group">
        <input type="radio" :name="name" v-model="typeOfGood" value="urban"
        :disabled="hasUnlocked1" :checked='unlockedWhat=="urban"' id="urban-good" hidden>
        <label for="urban-good">
          <span class="custom-radio urban-btn"></span>
        </label>
      </div>

      <div class="input-group">
        <input type="radio" :name="name" v-model="typeOfGood" value="intangible"
        :disabled="hasUnlocked1" :checked='unlockedWhat=="intangible"' id="intangible-good" hidden>
        <label for="intangible-good">
          <span class="custom-radio intangible-btn"></span>
        </label>
      </div>

      <div class="input-group">
        <input type="radio" :name="name" v-model="typeOfGood" value="environmental"
        :disabled="hasUnlocked1" :checked='unlockedWhat == "environmental"' id="environmental-good" hidden>
        <label for="environmental-good">
          <span class="custom-radio environmental-btn"></span>
        </label>
      </div>

      <br/>
      <button type="button" name="button" class="standard-btn" @click="unlock" :disabled="hasUnlocked1">
        Unlock!
      </button>
    </div>
    <div class="capitalize" v-else>
      <!-- {{ unlockedWhat }} good unlocked -->
      <div class="unlockedGood" :class="unlockedWhat">

      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import sharedb from '@/sharedb'

export default {
  props: ['playerIndex', 'name', 'roundIndex'],
  data() {
    return {
      typeOfGood: null,
      hasUnlocked: false,
    }
  },
  computed: {
    ...mapState(['players', 'round', 'gameId', 'role']),
    hasUnlocked1() {
      return this.hasUnlocked || (this.players[this.playerIndex].goodsUnlocked[this.roundIndex-1] !== undefined)
    },
    unlockedWhat() {
      // if (this.players[this.playerIndex].goodsUnlocked[this.roundIndex-1] !== 'none')
      return this.players[this.playerIndex].goodsUnlocked[this.roundIndex-1]
    }
  },
  methods: {
    unlock() {
      // console.log(this.typeOfGood)
      // console.log(this.playerIndex)
      let modifiedPlayer = {}
      Object.assign(modifiedPlayer, this.players[this.playerIndex])
      // console.log(modifiedPlayer);
      // console.log(modifiedPlayer[this.typeOfGood[0]]);
      // console.log(modifiedPlayer.WP);
      if (parseInt(modifiedPlayer[this.typeOfGood[0]]) + modifiedPlayer.WP >= 10) {
        modifiedPlayer.goodsUnlocked[this.roundIndex-1] = this.typeOfGood;
        let unclockedSoFar = modifiedPlayer.goodsUnlocked.reduce(
          (sum, g) => { return g == this.typeOfGood ? sum + 1 : sum; }, 0
        )
        console.log(unclockedSoFar);
        // apply special rule -> upgrade skill points when unlocking 3 or 5 goods of one kind
        if (unclockedSoFar == 3 || unclockedSoFar == 5) {
          modifiedPlayer[this.typeOfGood[0]] ++
        }
        modifiedPlayer.WP = modifiedPlayer.WP - (10 - modifiedPlayer[this.typeOfGood[0]]);
        modifiedPlayer.LP ++;
        let op = [{
          p: ['players', this.playerIndex],
          ld: this.players[this.playerIndex],
          li: modifiedPlayer
        }]
        sharedb.submitOperation(op)
        this.hasUnlocked = true
      } else {
        console.log('Impossibru');
      }


    }
  }
}
</script>

<style lang="scss" scoped>
.category-title {
  display: inline-block;
  font-weight: 700;
  font-size: 21px;
  margin-right: 20px;
  text-transform: capitalize;
  margin: 10px 0 0 0;
}

.input-group {
  display: inline-block;
  input[type='radio'] {
    display: none;
    &:checked + label > .custom-radio::after {
      opacity: 1;
    }
  }
  label {
    padding: 10px 20px;
    .custom-radio {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: inline-block;
      border-width: 3px;
      border-style: solid;
      &.health-btn {
        border-color: purple;
        &::after {
          background-color: purple;
        }
      }
      &.urban-btn {
        border-color: red;
        &::after {
          background-color: red;
        }
      }
      &.intangible-btn {
        border-color: yellow;
        &::after {
          background-color: yellow;
        }
      }
      &.environmental-btn {
        border-color: green;
        &::after {
          background-color: green;
        }
      }
      &::after {
        content: '';
        display: inline-block;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        opacity: 0;
        transition: all .2s;
      }
    }
  }
}

.unlockAction {
  background-color: var(--color-primary);
  border-radius: 2px;
  &:hover {
    border-color: gray;
  }
}
.capitalize {
  text-transform: capitalize;
}
.unlockedGood {
  border-radius: 50%;
  width: 25px;
  height: 25px;
  margin: auto;
  &.environmental {
    background-color: var(--environmental-color);
  }
  &.urban {
    background-color: var(--urban-color);
  }
  &.health {
    background-color: var(--health-color);
  }
  &.intangible {
    background-color: var(--intangible-color);
  }
}
</style>
