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
        Name
      </div>
    </div>

    <div class="bg-custom-gray grow flex flex-col gap-2 p-2">
      <div
        v-for="{ from, text } in messages"
        class="p-2 rounded-xl"
        :class="from ? 'bg-black mr-auto' : 'bg-white text-black ml-auto' "
      >
        {{ text }}
      </div>
    </div>

    <div class="bg-black p-4 flex items-center gap-4">
      <input 
        class="grow rounded-md p-2"
        ref="messageInput"
        type="text"
        placeholder="Enter a message"
      >
      <div
        class="text-2xl font-bold rounded-full w-10 h-10 bg-custom-gray flex items-center justify-center"
        @click="sendMessage"
      >
        &rightarrow;
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const emits = defineEmits(['onClose'])
const messageInput = ref<any>(null)

const messages = ref([
  {
    from: 'other',
    text: 'Hello'
  },
  {
    from: 'other',
    text: 'How are you?'
  },
  {
    text: 'Hi'
  },
  {
    text: 'I am good'
  }
])

onMounted(() => {
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = 'auto'
})

const sendMessage = () => {
  messages.value.push({ text: messageInput.value.value })
  messageInput.value.value = ''
}
</script>
