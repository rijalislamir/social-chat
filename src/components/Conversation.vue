<template>
  <!-- CONVERSATION -->
  <div class="fixed inset-0 bg-black flex flex-col">
    <div class="flex items-center gap-4 p-4">
      <div
        class="text-4xl font-bold"
        @click="() => emits('onClose')"
        >
        &leftarrow;
      </div>
    
      <div class="text-xl">
        {{ conversationTitle }}
      </div>
    </div>

    <div class="bg-custom-gray grow flex flex-col gap-2 p-2">
      <div
        v-for="{ message, senderEmail } in messages"
        class="p-2 rounded-xl"
        :class="senderEmail ? 'bg-black mr-auto' : 'bg-white text-black ml-auto' "
      >
        {{ message }}
      </div>
    </div>

    <form
      class="bg-black p-4 flex items-center gap-4"
      @submit="sendMessage"
    >
      <input 
        class="grow rounded-md p-2"
        ref="messageInput"
        type="text"
        placeholder="Enter a message"
      >
      <button
        class="text-2xl font-bold rounded-full w-10 h-10 bg-custom-gray flex items-center justify-center"
        type="submit"
      >
        &rightarrow;
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { socket } from '../socket';
import { useConversationStore } from '../stores/conversation';

const { recipients } = defineProps(['recipients'])
const emits = defineEmits(['onClose'])
const conversationStore = useConversationStore()
const messageInput = ref<any>(null)
const conversationTitle = computed(() => {
  let title = ''

  if (!recipients) return title

  recipients.forEach((user: any, index: number) => {
    title += user.name

    if (index !== recipients.length - 1) title += ', '
  })

  return title
})

const messages = computed(() => conversationStore.history[recipients[0].email]?.message)

onMounted(() => {
  document.body.style.overflow = 'hidden'
  messageInput.value.focus()
})

onUnmounted(() => {
  document.body.style.overflow = 'auto'
})

const sendMessage = (e: any) => {
  e.preventDefault()

  // TODO: adjust when implementing group chat
  if (recipients.length === 1) {
    const message = messageInput.value.value
    const name = recipients[0].name
    const email = recipients[0].email

    socket.emit('sendMessage', { message, to: email })

    console.log('sendMessage conversation')
    conversationStore.history[email] = {
      email,
      name,
      message: 
        conversationStore.history.hasOwnProperty(email)
          ? [...conversationStore.history[email].message, { message }]
          : [{ message }]
    }

    messageInput.value.value = ''
  }
}
</script>
