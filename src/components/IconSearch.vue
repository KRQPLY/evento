<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 30 30"
    width="20px"
    height="20px"
    class="svg"
  >
    <circle style="fill: none; stroke-width: 2; stroke-miterlimit: 10" cx="13" cy="13" r="9" />
    <line
      style="fill: none; stroke-width: 2; stroke-linecap: round; stroke-miterlimit: 10"
      x1="26"
      y1="26"
      x2="19.437"
      y2="19.437"
    />
  </svg>
</template>

<script setup></script>

<style lang="scss" scoped>
.svg {
  stroke: $color-contrast;
  transition: stroke 0.4s ease;
}
</style>
