<template>
  <div class="users-list">
    <div class="section">
      <div class="list">
        <div class="result" v-for="user in users">
          <div class="user">
            {{ user }}
          </div>
          <div class="buttons">
            <Button v-if="acceptButton" @click="handleAccept(user)">accept</Button>
            <Button filled danger v-if="deleteButton" @click="handleDelete(user)">delete</Button>
            <Button v-if="customButton" @click="$emit('custom-click', user)">{{
              customButton
            }}</Button>
          </div>
        </div>
        <div class="result empty" v-if="!users.length">No results</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from './Button.vue'
import postData from '@/helpers/postData'
import deleteData from '@/helpers/deleteData'

defineProps({
  users: {
    type: Array,
    default: []
  },
  deleteButton: {
    type: Boolean,
    default: false
  },
  acceptButton: {
    type: Boolean,
    default: false
  },
  customButton: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['updated', 'custom-click'])

async function handleDelete(username) {
  await deleteData(`${import.meta.env.VITE_API_URL}/friends/${username}`, true)

  emits('updated')
}

async function handleAccept(username) {
  await postData(`${import.meta.env.VITE_API_URL}/friends/${username}`)

  emits('updated')
}
</script>

<style lang="scss" scoped>
.users-list {
  color: $color-contrast;
  .section {
    padding: 10px;
    background-color: $color-secondary;
    border-radius: 7px;
    .list {
      .result {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
        border-bottom: 1px solid $color-main;

        .buttons {
          display: flex;
        }
        &.empty {
          flex-direction: column;
          color: $color-accent;
        }
        &:first-child {
          padding-top: 0;
        }
        &:last-child {
          border: none;
          padding-bottom: 0;
        }
      }
    }
  }
}
</style>
