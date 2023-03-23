<template>
  <section class="mx-auto min-h-screen flex flex-col justify-center px-4 gap-8">
    <h1 class="text-3xl font-bold text-center">Register</h1>

    <form 
      class="flex flex-col gap-8"
      @submit="submitRegistrationForm"
    >
      <div class="text-left flex flex-col gap-2">
        <div class="flex flex-col">
          <label for="name">Name</label>
          <input 
            class="p-2 rounded"
            @input="changeInput"
            ref="nameInput"
            type="text"
            name="name"
            id="name"
            placeholder="Enter a name"
            required
          >
        </div>
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
        <div class="flex flex-col">
          <label for="confirm-password">Confirm Password</label>
          <input
            class="p-2 rounded"
            @input="changeInput"
            ref="confirmPasswordInput"
            type="password"
            name="confirm-password"
            id="confirm-password"
            placeholder="Enter the same password"
            required
          >
        </div>
      </div>

      <div
        v-if="isRegisteredSuccessfully"
        class="text-center text-green-600"
      >
        Account is registered successfully!
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
        Register
      </button>
    </form>

    <div class="text-center">
      <p class="text-sm">Have already an account?
        <span
          class="font-bold cursor-pointer" 
          @click="() => { router.push('/login')}"
        >
          Login
        </span>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { createUser } from '../utils/api'
import { useRouter } from 'vue-router';

const router = useRouter()

// TODO: replace any with specific type
const nameInput = ref<any>(null)
const emailInput = ref<any>(null)
const passwordInput = ref<any>(null)
const confirmPasswordInput = ref<any>(null)
const isButtonDisabled = ref<boolean>(true)
const isRegisteredSuccessfully = ref<boolean>(false)
const errorMessage = ref(null)

onMounted(() => {
  nameInput.value.focus()
})

const submitRegistrationForm = async (e: any) => {
  e.preventDefault()

  const res = await createUser({
    name: nameInput.value.value,
    email: emailInput.value.value,
    password: passwordInput.value.value
  })

  switch (res.status) {
    case 'success':
      nameInput.value.value = ''
      emailInput.value.value = ''
      passwordInput.value.value = ''
      confirmPasswordInput.value.value = ''

      isRegisteredSuccessfully.value = true
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
    nameInput.value?.value &&
    emailInput.value?.value &&
    passwordInput.value?.value &&
    passwordInput.value?.value === confirmPasswordInput.value?.value
  ) {
    isButtonDisabled.value = false
  } else {
    isButtonDisabled.value = true
  }
  isRegisteredSuccessfully.value = false
  errorMessage.value = null
}
</script>
