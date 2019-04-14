<template lang="html">
  <!-- <transition name="modal-fade"> -->
    <div class="modal-backdrop">
      <div class="modal" v-if="editPlayer">
        <header class="modal-header">
          <slot name="header">
            <h1>{{ editPlayer.name }} / {{ editPlayer.character }}</h1>
            <!-- <div>
              <span class="coins welfare">{{ editPlayer.WP }}</span>
              <span class="coins legitimacy">{{ editPlayer.LP }}</span>
            </div> -->
            <Coins :wp="editPlayer.WP" :lp="editPlayer.LP"/>
            <!-- <div class="skills">
              <span class="powers health">{{ editPlayer.h }}</span>
              <span class="powers urban">{{ editPlayer.u }}</span>
              <span class="powers intangible">{{ editPlayer.i }}</span>
              <span class="powers environmental">{{ editPlayer.e }}</span>
            </div> -->
            <Skills :health="editPlayer.h" :urban="editPlayer.u" :intangible="editPlayer.i" :environmental="editPlayer.e"/>

            <!-- <span class="goods-unlocked health">{{ totalForGood(editPlayerIndex, 'health') }} </span> /
            <span class="goods-unlocked urban">{{ totalForGood(editPlayerIndex, 'urban') }} </span> /
            <span class="goods-unlocked intangible">{{ totalForGood(editPlayerIndex, 'intangible') }} </span> /
            <span class="goods-unlocked environmental">{{ totalForGood(editPlayerIndex, 'environmental') }} </span> <br/> -->

            <Unlocked :playerIndex="editPlayerIndex"/>
            <button type="button" class="btn-close" @click="exitEditing">
              x
            </button>
          </slot>
        </header>
        <section class="modal-body">
          <slot name="body">
            <h2>Round: {{ editRound }}</h2>
            <PointsTracker :roundIndex="editRound" :player="editPlayer" :playerIndex="editPlayerIndex" :context="'global'"/>
            <PointsTracker :roundIndex="editRound" :player="editPlayer" :playerIndex="editPlayerIndex" :context="'situations'"/>
            <PointsTracker :roundIndex="editRound" :player="editPlayer" :playerIndex="editPlayerIndex" :context="'rewards'"/>
            <UnlockGoods :playerIndex="editPlayerIndex" :name="'unlock'+editRound" :roundIndex="editRound"/>
          </slot>
        </section>
         <footer class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn-green" @click="exitEditing">
                Close
              </button>
           </slot>
         </footer>
       </div>
    </div>

    </div>
  <!-- <transition/> -->
  <!-- <transition name="modal">
    <div class="v-modal-mask" tabindex="0">
      <div class="v-modal-wrapper">
        <div class="v-modal-container">

          <div class="v-modal-header">
            <h1>{{ editPlayer.name }} / {{ editPlayer.character }}</h1>
            <span class="close-edit" @click="exitEditing">X</span>
          </div>

          <div class="v-modal-body">
            {{ editRound }}
          </div>

        </div>
      </div>
    </div>
  <transition/> -->
</template>

<script>
// import { mapState } from 'vuex'
import Coins from '@/components/Coins'
import Skills from '@/components/Skills'
import Unlocked from '@/components/Unlocked'
import UnlockGoods from '@/components/UnlockGoods'
import PointsTracker from '@/components/PointsTracker'

export default {
  components: {
    Coins,
    Skills,
    Unlocked,
    UnlockGoods,
    PointsTracker
  },
  props: ['editPlayer', 'editRound', 'editPlayerIndex'],
  // computed: {
  //   // ...mapState['players']
  // }
  methods: {
    exitEditing() {
      this.$store.dispatch('exitEditing')
    },
    totalForGood(index, typeOfGood) {
      if (index > -1)
        return this.editPlayer.goodsUnlocked.reduce((sum, g) => { return g == typeOfGood ? sum + 1 : sum; }, 0)
      // else {
      //   let i = editPlayer.findIndex(p => p.name === this.role);
      //   return this.players[i].goodsUnlocked.reduce((sum, g) => { return g == typeOfGood ? sum + 1 : sum; }, 0)
      // }
    },
  }
}
</script>

<style lang="scss" scoped>
.edit-player {
  position: absolute;
  top: 0;
  left: 0;
  height: 90vh;
  width: 98vh;
  margin: 0 auto;
  background-color: white;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #FFFFFF;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 90%;
}

.modal-header,
.modal-footer {
  padding: 15px;
  // display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  color: #4AAE9B;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px 40px;
  & h2 {
    font-size: 25px;
    font-weight: 700;
  }
}

.btn-close {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  font-size: 20px;
  padding: 20px;
  cursor: pointer;
  font-weight: bold;
  color: #4AAE9B;
  background: transparent;
}

.btn-green {
  color: white;
  background: #4AAE9B;
  border: 1px solid #4AAE9B;
  border-radius: 2px;
}
.modal-fade-enter,
 .modal-fade-leave-active {
   opacity: 0;
 }

 .modal-fade-enter-active,
 .modal-fade-leave-active {
   transition: opacity .5s ease
 }
 .goods-unlocked {
   margin: 0 20px;
 }
 // .coins {
 //   display: inline-block;
 //   padding: 10px;
 //   margin: 10px;
 //   width: 70px;
 //   height: 70px;
 //   border-radius: 50%;
 //   &.welfare {
 //     background-color: orange;
 //   }
 //   &.legitimacy {
 //     background-color: #5bb3ff;
 //   }
 // }


</style>
