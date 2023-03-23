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

import { login } from '../utils/api'

const router = useRouter()
const { cookies } = useCookies()

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

  switch (res.status) {
    case 'success':
      emailInput.value.value = ''
      passwordInput.value.value = ''
      
      cookies.set('accesstoken', res.accessToken)
      router.push('/')
      break;

    case 'failed':
      errorMessage.value = res.message
      break;
  
    default:
      break;
  }
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
