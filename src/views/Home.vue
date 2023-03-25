<template>
  <!-- HOME -->
  <section class="h-screen flex flex-col justify-between">
    <!-- TODO: set gradient bg color -->
    <div class="sticky top-0 py-2 px-4">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold">Social Chat</h1>
        <div
          class="text-4xl font-bold"
          @click="openNewChatModal"
        >
          &plus;
        </div>
      </div>
      
      <div class="flex pt-4">
        <input class="p-2 rounded grow" type="search" placeholder="Search conversation">
      </div>
    </div>


    <div class="text-sm p-4 py-2 overflow-auto">
      <div class="flex py-2 gap-4 border-t-2 border-custom-gray" v-for="n in 20" @click="openConversation">
        <div class="rounded-full bg-custom-gray w-12 h-12"></div>
        <div class="flex flex-col justify-around grow">
          <div class="flex justify-between">
            <span>Name</span>
            <span>time</span>
          </div>
          <div>Message clip</div>
        </div>
      </div>
    </div>

    <Navbar />
  </section>

  <NewChatModal
    v-if="showNewChatModal"
    :online-users="onlineUsers"
    @on-close="closeNewChatModal"
  />
  <Conversation v-if="showConversation" @on-close="closeConversation" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { socket } from '../socket';
import { useUserStore } from '../stores/user';
import NewChatModal from '../components/NewChatModal.vue';
import Conversation from '../components/Conversation.vue';
import Navbar from '../components/Navbar.vue';

const userStore = useUserStore()
const onlineUsers = ref<any>([])
const showConversation = ref(false)
const showNewChatModal = ref(false)

const openNewChatModal = () => {
  showNewChatModal.value = true
}

const closeNewChatModal = () => {
  showNewChatModal.value = false
}

const openConversation = () => {
  showConversation.value = true
}

const closeConversation = () => {
  showConversation.value = false
}

socket.on("users", (users) => {
  users.forEach((user: any) => {
    user.self = user.userID === socket.id;
    onlineUsers.value.push(user.email)
  });
});

socket.on("newUser", (user) => {
  onlineUsers.value.push(user.email);
});

socket.on('exitUser', (user) => {
  onlineUsers.value = onlineUsers.value.filter((email: string) => email !== user.email)
})
</script>
