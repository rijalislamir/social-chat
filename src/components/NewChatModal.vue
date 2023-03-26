<template>
  <!-- NEW CHAT MODAL -->
  <div
    class="fixed inset-0 flex bg-black/90 flex-col justify-between"
  >
    <div class="flex flex-col h-screen">
      <div class="relative p-4">
        <div class="text-center text-xl font-semibold">Online Users</div>
        <div
          class="absolute p-4 right-0 top-0 text-xl font-bold"
          @click="() => emits('onClose')"
        >
          &times;
        </div>
      </div>

      <div class="overflow-auto grow">
        <div
          v-if="!anyOnlineUsers"
          class="flex flex-col justify-center items-center h-full"
        >
          <span class="text-4xl font-semibold">
            No online user
          </span>
          <span>
            (invite your friends)
          </span>
        </div>

        <!-- TODO: better not use v-show to exclude unnecessary users to DOM -->
        <div 
          v-else
          v-for="{ name, email, isSelected } in users"
          v-show="onlineUsers.includes(email) && email !== userStore.email" 
          @click="() => {
            toggleSelectedUser(email)
            startConversation()
          }"
          class="flex py-2 gap-2 px-4"
          :class="isSelected ? 'bg-blue-500' : ''"
        >
          <div class="rounded-full bg-custom-gray w-12 h-12"></div>
          <div class="flex flex-col justify-around">
            <span>{{ name }}</span>
            <span class="text-xs">{{ email }}</span>
          </div>
        </div>
      </div>

      <!-- TODO: show start conversation button when implementing group chat -->
      <div
        v-if="false"
        class="flex justify-center p-6 text-xl font-semibold bg-blue-800"
        @click="startConversation"
      >
        Start Conversation
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout, getAllUsers } from '../utils/api';
import { useUserStore } from '../stores/user';
import { useConversationStore } from '../stores/conversation';

const props = defineProps(['onlineUsers'])
const emits = defineEmits(['onClose', 'openConversation'])
const router = useRouter()
const userStore = useUserStore()
const conversationStore = useConversationStore()
const users = ref<any>([])
const selectedUsers = computed(() => users.value.filter((user: any) => user.isSelected))
const anyOnlineUsers = computed(() => userStore.onlineUsers.length > 1 ? true : false)

onMounted(async () => {
  document.body.style.overflow = 'hidden'

  const res = await getAllUsers()

  if (!res.success) {
    logout({ router, userStore, conversationStore })
    return
  }

  users.value = res.users
})

onUnmounted(() => {
  document.body.style.overflow = 'auto'
})

const toggleSelectedUser = ( email: string ) => {
  const index = users.value.findIndex((user: any) => email === user.email)
  users.value[index].isSelected = !users.value[index].isSelected    
}

const startConversation = () => {
  emits('openConversation', selectedUsers.value)
  emits('onClose')
}
</script>
