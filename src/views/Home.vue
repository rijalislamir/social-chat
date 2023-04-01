<template>
  <!-- HOME -->
  <section class="h-screen flex flex-col justify-between">
    <!-- TODO: set gradient bg color -->
    <div class="sticky top-0 py-2 px-4">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold">Social Chat</h1>
        <div
          class="text-4xl font-bold cursor-pointer"
          @click="openNewChatModal"
        >
          &plus;
        </div>
      </div>

      <div class="flex pt-4">
        <input
          class="p-2 rounded grow"
          type="search"
          placeholder="Search conversation"
        />
      </div>
    </div>

    <div class="text-sm py-2 overflow-auto mb-auto grow">
      <div
        v-if="!anyConversations"
        @click="openNewChatModal"
        class="flex flex-col justify-center items-center h-full cursor-pointer"
      >
        <span class="font-semibold">click here to</span>
        <span class="text-2xl font-semibold">Start a Conversation</span>
      </div>

      <div
        v-else
        v-for="({ id, name, users, messages }, i) in conversationStore.data"
        :key="`conversation-${i}`"
        @click="() => openConversation(id, users)"
        class="flex px-4 py-2 gap-4 border-t-2 border-custom-gray hover:bg-gray-700 cursor-pointer"
      >
        <div class="rounded-full bg-custom-gray w-12 h-12"></div>
        <div class="flex flex-col justify-around grow">
          <div class="flex justify-between">
            <span class="font-bold">{{ name }}</span>
            <span class="text-xs">{{ getConversationDatetime(messages) }}</span>
          </div>
          <div>{{ messages[messages.length - 1].message }}</div>
        </div>
      </div>
    </div>

    <Navbar />
  </section>

  <NewChatModal
    v-if="showNewChatModal"
    @open-conversation="openConversation"
    @on-close="closeNewChatModal"
  />
  <Conversation
    v-if="showConversation"
    :id="conversationId"
    :recipients="recipients"
    @on-close="closeConversation"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useConversationStore } from '../stores/conversation';
import { User } from '../types';
import { getConversationName, getConversationDatetime } from '../utils';
import NewChatModal from '../components/NewChatModal.vue';
import Conversation from '../components/Conversation.vue';
import Navbar from '../components/Navbar.vue';

const conversationStore = useConversationStore();
const recipients = ref<User[]>([]);
const showConversation = ref(false);
const showNewChatModal = ref(false);
const anyConversations = computed(() => !conversationStore.isEmpty());
const conversationId = ref<string>('');

const openNewChatModal = () => {
  showNewChatModal.value = true;
};

const closeNewChatModal = () => {
  showNewChatModal.value = false;
};

const openConversation = (id: string, selectedUsers: User[]) => {
  conversationId.value = id;
  recipients.value = selectedUsers;
  showConversation.value = true;
};

const closeConversation = () => {
  conversationId.value = '';
  showConversation.value = false;
};
</script>
