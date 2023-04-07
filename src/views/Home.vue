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
          ref="searchConversationInput"
          @input="setConversationNameQuery"
          class="p-2 rounded grow"
          type="search"
          placeholder="Search conversation"
        />
      </div>
    </div>

    <div class="text-sm py-2 overflow-auto overflow-x-hidden mb-auto grow">
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
        v-for="({ id, name, users, messages }, i) in sortedConversations"
        :key="`conversation-${i}`"
        @click="() => openConversation(id, users)"
        class="flex px-4 py-2 gap-4 border-t-2 border-custom-gray hover:bg-gray-700 cursor-pointer"
      >
        <div class="rounded-full bg-custom-gray w-12 h-12 shrink-0"></div>
        <div class="flex flex-col justify-around grow min-w-0">
          <div class="flex justify-between">
            <span class="font-bold">{{ name }}</span>
            <span class="text-xs">{{ getConversationDatetime(messages) }}</span>
          </div>
          <div class="truncate">
            {{ messages[messages.length - 1].message }}
          </div>
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
import { Conversation as ConversationType, User } from '../types';
import { getConversationDatetime, searchConversation } from '../utils';
import NewChatModal from '../components/NewChatModal.vue';
import Conversation from '../components/Conversation.vue';
import Navbar from '../components/Navbar.vue';

const conversationStore = useConversationStore();
const recipients = ref<User[]>([]);
const showConversation = ref(false);
const showNewChatModal = ref(false);
const conversationId = ref<string>('');
const searchConversationInput = ref<HTMLInputElement | null>(null);
const conversationNameQuery = ref('');
const conversations = computed(() =>
  searchConversation(conversationStore, conversationNameQuery.value)
);
const anyConversations = computed(
  () => Object.keys(conversations.value).length !== 0
);
const sortedConversations = computed(() => {
  const sortable = [];

  for (const conversationId in conversations.value) {
    const conversation = conversations.value[conversationId];
    sortable.push(conversation);
  }

  sortable.sort(
    (a: ConversationType, b: ConversationType) =>
      new Date(b.messages[b.messages?.length - 1].createdAt).getTime() -
      new Date(a.messages[a.messages?.length - 1].createdAt).getTime()
  );

  return sortable;
});

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

const setConversationNameQuery = () => {
  conversationNameQuery.value = searchConversationInput?.value?.value || '';
};
</script>
