<template>
  <div class="drawer">
    <div class="options" v-if="userStore.uid">
      <div
        class="option"
        :class="{ active: currentRouteName === 'findEvents' }"
        @click="handleInDrawerClick('findEvents')"
      >
        Find Events
      </div>
      <div
        class="option"
        :class="{ active: currentRouteName === 'myEvents' }"
        @click="handleInDrawerClick('myEvents')"
      >
        My Events
      </div>
      <div
        class="option"
        :class="{ active: currentRouteName === 'friends' }"
        @click="handleInDrawerClick('friends')"
      >
        Friends
      </div>
    </div>
    <div class="sign-buttons">
      <Button @click="handleInDrawerClick('signin')" v-if="!userStore.uid">Sign in</Button>
      <Button @click="handleInDrawerClick('signup')" filled v-if="!userStore.uid">Sign up</Button>
      <Button @click="handleSignOut" v-else>Sign out</Button>
    </div>
    <MoonIcon />
  </div>
  <div class="drawer-background"></div>
</template>

<script setup>
import Button from './Button.vue'
import MoonIcon from './MoonIcon.vue'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const emits = defineEmits(['closeDrawer'])
const userStore = useUserStore()
const router = useRouter()
const currentRouteName = computed(() => {
  return router.currentRoute.value.name
})

function handleInDrawerClick(name) {
  router.push({ name })
  closeDrawer()
}

function handleSignOut() {
  userStore.signout()
  router.push({ name: 'signin' })
  closeDrawer()
}

function closeDrawer() {
  emits('closeDrawer')
}
</script>

<style lang="scss" scoped>
.drawer {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  z-index: 1000;
  padding: 50px 0;
  width: 100%;
  font-weight: 200;
  background-color: $color-main;
  .options {
    display: flex;
    flex-direction: column;
    gap: 30px;
    font-size: 20px;
  }

  .option {
    cursor: pointer;
    color: $color-contrast;
    &.active {
      color: $color-accent;
    }
  }
  .sign-buttons {
    display: flex;
  }
}

.drawer-background {
  position: fixed;
  z-index: 999;
  top: 0;
  bottom: 0;
  width: 100%;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
@include media-xs {
  .drawer {
    display: none;
  }
  .drawer-background {
    display: none;
  }
}
</style>
