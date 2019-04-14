<template lang="html">
  <div class="skills">
    <span class="powers health">{{ health }}</span>
    <span class="powers urban">{{ urban }}</span>
    <span class="powers intangible">{{ intangible }}</span>
    <span class="powers environmental">{{ environmental }}</span>
  </div>
</template>

<script>
export default {
  name: 'Skills',
  props: ['health', 'urban', 'intangible', 'environmental']
}
</script>

<style lang="scss" scoped>
.powers {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  margin: 10px;
  font-weight: 700;
  &.health {
    background-color: var(--health-color);
  }
  &.urban {
    background-color: var(--urban-color);
  }
  &.intangible {
    background-color: var(--intangible-color);
  }
  &.environmental {
    background-color: var(--environmental-color);
  }
}
</style>
