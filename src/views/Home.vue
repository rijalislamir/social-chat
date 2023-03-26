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


    <div class="text-sm p-4 py-2 overflow-auto mb-auto">
      <div
        class="flex py-2 gap-4 border-t-2 border-custom-gray"
        v-for="conversation in conversationStore.history"
        @click="() => openConversation([{ name: conversation.name, email: conversation.email }])"
      >
        <div class="rounded-full bg-custom-gray w-12 h-12"></div>
        <div class="flex flex-col justify-around grow">
          <div class="flex justify-between">
            <span>{{ conversation.name }}</span>
            <span>time</span>
          </div>
          <div>{{ conversation.message[conversation.message.length - 1].message }}</div>
        </div>
      </div>
    </div>

    <Navbar />
  </section>

  <NewChatModal
    :show="showNewChatModal"
    :online-users="onlineUsers"
    @open-conversation="openConversation"
    @on-close="closeNewChatModal"
  />
  <Conversation
    v-if="showConversation"
    :recipients="recipients"
    @on-close="closeConversation"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { socket } from '../socket';
import { useConversationStore } from '../stores/conversation';
import NewChatModal from '../components/NewChatModal.vue';
import Conversation from '../components/Conversation.vue';
import Navbar from '../components/Navbar.vue';

const conversationStore = useConversationStore()
const onlineUsers = ref<any>([])
const recipients = ref<any>([])
const showConversation = ref(false)
const showNewChatModal = ref(false)

const openNewChatModal = () => {
  showNewChatModal.value = true
}

const closeNewChatModal = () => {
  showNewChatModal.value = false
}

const openConversation = (selectedUsers?: any) => {
  recipients.value = selectedUsers
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

socket.on('fetchMessage', ({ message, senderEmail, senderName }: any) => {
  console.log('fetch message from Home')
  conversationStore.history[senderEmail] = {
    name: senderName,
    email: senderEmail,
    message: 
        conversationStore.history.hasOwnProperty(senderEmail)
          ? [...conversationStore.history[senderEmail].message, { message, senderEmail }]
          : [{ message, senderEmail }]
  }
})
</script>
