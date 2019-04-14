<template lang="html">
  <div class="unlocked">
    <span class="goods-unlocked health">{{ totalForGood(playerIndex, 'health') }} </span> /
    <span class="goods-unlocked urban">{{ totalForGood(playerIndex, 'urban') }} </span> /
    <span class="goods-unlocked intangible">{{ totalForGood(playerIndex, 'intangible') }} </span> /
    <span class="goods-unlocked environmental">{{ totalForGood(playerIndex, 'environmental') }} </span>
    <br/>
  </div>
</template>

<script>
export default {
  name: 'Unlocked',
  props: ['playerIndex'],
  methods: {
    totalForGood(index, typeOfGood) {
      if (index > -1){
        return this.$store.state.players[index].goodsUnlocked.reduce(
          (sum, g) => { return g == typeOfGood ? sum + 1 : sum; }, 0
        )
      } else {
        console.log('error '+ index);
      }
      // else {
      //   let i = editPlayer.findIndex(p => p.name === this.role);
      //   return this.players[i].goodsUnlocked.reduce((sum, g) => { return g == typeOfGood ? sum + 1 : sum; }, 0)
      // }
    },
  }
}
</script>

<style lang="scss" scoped>
.goods-unlocked {
  margin: 0 17px;
  font-weight: 700;
  font-size: 20px;
  &.health{
    color: var(--health-color);
  }
  &.urban{
    color: var(--urban-color);
  }
  &.intangible{
    color: var(--intangible-color);
  }
  &.environmental{
    color: var(--environmental-color);
  }

}
</style>
