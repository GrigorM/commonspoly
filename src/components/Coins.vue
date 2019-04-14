<template lang="html">
  <div>
    <div class="coins wp">
      {{ wp }}
    </div>
    <div class="coins lp">
      {{ lp }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Coins',
  props: ['wp', 'lp']
}
</script>

<style lang="scss" scoped>
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
    background-color: var(--welfare-points);
  }
  &.lp {
    background-color: var(--legitimacy-points);
  }
}
</style>
