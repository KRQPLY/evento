<template>
  <div class="login-container">
    <div class="forms">
      <SignForm
        is-signup
        v-if="signType === 'signup'"
        :redirect="redirect"
        :redirect-id="redirectId"
      />
      <SignForm v-else :redirect="redirect" :redirect-id="redirectId" />
    </div>
    <div class="credit desktop">
      Image by
      <a
        target="_blank"
        href="https://pixabay.com/users/cocoparisienne-127419/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1843350"
        >Anja</a
      >
      from
      <a
        target="_blank"
        href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1843350"
        >Pixabay</a
      >
    </div>
  </div>
</template>

<script setup>
import SignForm from '../components/SignForm.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const signType = computed(() => {
  return router.currentRoute.value.name
})

defineProps({
  redirect: {
    type: String,
    default: 'findEvents'
  },
  redirectId: Number
})
</script>

<style lang="scss" scoped>
.login-container {
  padding: 10px 0;
  display: flex;
  justify-content: center;
  position: relative;
  background-image: url('@/assets/sign-background-sm.jpg');
  background-color: $color-main;
  background-position: bottom left;
  background-repeat: no-repeat;
  background-size: cover;
  .credit {
    font-size: 8px;
    position: absolute;
    right: 5px;
    bottom: 5px;
    color: #fff;
    a {
      color: #fff;
    }
  }
}

@include media-xs {
  .login-container {
    padding: 40px 0;
    background-image: url('@/assets/sign-background-md.jpg');
  }
}
@include media-hd {
  .login-container {
    background-image: url('@/assets/sign-background-xl.jpg');
  }
}
</style>
