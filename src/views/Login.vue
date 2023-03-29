<template>
  <section class="mx-auto min-h-screen flex flex-col justify-center px-4 gap-8">
    <h1 class="text-3xl font-bold text-center">Login</h1>

    <form 
      class="flex flex-col gap-8"
      @submit="submitLoginForm"
    >
      <div class="text-left flex flex-col gap-2">
        <div class="flex flex-col">
          <label for="email">Email</label>
          <input 
            class="p-2 rounded"
            @input="changeInput"
            ref="emailInput"
            type="email"
            name="email"
            id="email"
            placeholder="Enter an email"
            required
          >
        </div>
        <div class="flex flex-col">
          <label for="password">Password</label>
          <input 
            class="p-2 rounded"
            @input="changeInput"
            ref="passwordInput"
            type="password"
            name="password"
            id="password"
            placeholder="Enter a password"
            required
          >
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="text-center text-red-600"
      >
        {{ errorMessage }}
      </div>

      <button 
        class="bg-white disabled:opacity-50 disabled:cursor-not-allowed py-2 text-black font-bold rounded"
        type="submit"
        :disabled="isButtonDisabled"
      >
        Login
      </button>
    </form>

    <div class="text-center">
      <p class="text-sm">Don't have an account?
        <span
          class="font-bold cursor-pointer"
          @click="() => { router.push('/register')}"
        >
          Register
        </span>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCookies } from "vue3-cookies";
import { useRouter } from 'vue-router';
import { getUserConversations } from '../apis/conversation'
import { getConversationMessages } from '../apis/message'
import { login, getConversationUsers, getUser } from '../apis/user'
import { useUserStore } from '../stores/user';
import { useConversationStore } from '../stores/conversation';
import { socket } from '../socket';
// import { fileURLToPath, URL } from 'node:url'

const router = useRouter()
const { cookies } = useCookies()
const userStore = useUserStore()
const conversationStore = useConversationStore()
// TODO: replace any with specific type
const emailInput = ref<any>(null)
const passwordInput = ref<any>(null)
const isButtonDisabled = ref<boolean>(true)
const errorMessage = ref(null)

onMounted(() => {
  emailInput.value.focus()
})

const submitLoginForm = async (e: any) => {
  e.preventDefault()

  const res = await login({
    email: emailInput.value.value,
    password: passwordInput.value.value
  })

  if (!res.success) {
    errorMessage.value = res.message
    return
  }

  emailInput.value.value = ''
  passwordInput.value.value = ''
  
  cookies.set('accesstoken', res.accessToken)

  const response = await getUser({ token: res.accessToken })
      
  if (!response.success) {
    errorMessage.value = res.message
    return
  }

  userStore.setUser({
    newId: response.user.id,
    newName: response.user.name,
    newEmail: response.user.email
  })

  socket.auth = {
    userId: response.user.id,
    email: response.user.email,
    name: response.user.name
  };
  socket.connect()

  const response2 = await getUserConversations({ userId: response.user.id })

  if (response2.success) {
    for (let { conversationId, name } of response2.conversations) {
      const { messages } = await getConversationMessages({ conversationId })
      const { users } = await getConversationUsers({ conversationId })
      
      conversationStore.data[conversationId] = {
        id: conversationId,
        name,
        users,
        messages
      }
    }
  }

  router.push('/')
}

const changeInput = () => {
  if (
    emailInput.value?.value &&
    passwordInput.value?.value
  ) {
    isButtonDisabled.value = false
  } else {
    isButtonDisabled.value = true
  }
  errorMessage.value = null
}
</script>
