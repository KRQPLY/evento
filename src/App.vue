<script setup>
import Header from './components/Header.vue'
import Drawer from './components/Drawer.vue'
import Footer from './components/Footer.vue'
import { RouterView } from 'vue-router'
import { ref } from 'vue'

const isDrawerVisible = ref(false)
</script>

<template>
  <Header @toggleDrawer="isDrawerVisible = !isDrawerVisible" />
  <Drawer @closeDrawer="isDrawerVisible = false" v-if="isDrawerVisible" />
  <RouterView class="full-height" />
  <Footer />
</template>

<style scoped lang="scss">
.full-height {
  box-sizing: border-box;
  min-height: calc(100vh - #{$height-header} - #{$height-footer});
}
</style>
