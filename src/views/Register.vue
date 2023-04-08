<template>
  <section class="mx-auto min-h-screen flex flex-col justify-center px-4 gap-8">
    <h1 class="text-3xl font-bold text-center mt-auto">
      {{ t('Register.Title') }}
    </h1>

    <form class="flex flex-col gap-8" @submit="submitRegistrationForm">
      <div class="text-left flex flex-col gap-2">
        <div class="flex flex-col">
          <label for="name">{{ t('Register.Name') }}</label>
          <input
            class="p-2 rounded"
            @input="changeInput"
            ref="nameInput"
            type="text"
            name="name"
            id="name"
            :placeholder="t('Register.NamePlaceholder')"
            required
          />
        </div>
        <div class="flex flex-col">
          <label for="email">{{ t('Register.Email') }}</label>
          <input
            class="p-2 rounded"
            @input="changeInput"
            ref="emailInput"
            type="email"
            name="email"
            id="email"
            :placeholder="t('Register.EmailPlaceholder')"
            required
          />
        </div>
        <div class="flex flex-col">
          <label for="password">{{ t('Register.Password') }}</label>
          <input
            class="p-2 rounded"
            @input="changeInput"
            ref="passwordInput"
            type="password"
            name="password"
            id="password"
            :placeholder="t('Register.PasswordPlaceholder')"
            required
          />
        </div>
        <div class="flex flex-col">
          <label for="confirm-password">{{
            t('Register.ConfirmPassword')
          }}</label>
          <input
            class="p-2 rounded"
            @input="changeInput"
            ref="confirmPasswordInput"
            type="password"
            name="confirm-password"
            id="confirm-password"
            :placeholder="t('Register.ConfirmPasswordPlaceholder')"
            required
          />
        </div>
      </div>

      <div v-if="isRegisteredSuccessfully" class="text-center text-green-600">
        {{ t('Register.SuccessMessage') }}
      </div>

      <div v-if="errorMessage" class="text-center text-red-600">
        {{ errorMessage }}
      </div>

      <button
        class="bg-white disabled:opacity-50 disabled:cursor-not-allowed py-2 text-black font-bold rounded"
        type="submit"
        :disabled="isButtonDisabled"
      >
        {{ t('Register.Button') }}
      </button>
    </form>

    <div class="text-center">
      <p class="text-sm">
        {{ t('Register.LoginOption') }}
        <span
          class="font-bold cursor-pointer"
          @click="
            () => {
              router.push('/login');
            }
          "
        >
          {{ t('Register.LoginLink') }}
        </span>
      </p>
    </div>

    <LanguageOption />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { createUser } from '../apis/user';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import LanguageOption from '../components/LanguageOption.vue';

const { t } = useI18n();
const router = useRouter();
const nameInput = ref<HTMLInputElement | null>(null);
const emailInput = ref<HTMLInputElement | null>(null);
const passwordInput = ref<HTMLInputElement | null>(null);
const confirmPasswordInput = ref<HTMLInputElement | null>(null);
const isButtonDisabled = ref<boolean>(true);
const isRegisteredSuccessfully = ref<boolean>(false);
const errorMessage = ref(null);

onMounted(() => {
  nameInput.value?.focus();
});

const submitRegistrationForm = async (e: Event) => {
  if (
    !nameInput.value ||
    !emailInput.value ||
    !passwordInput.value ||
    !confirmPasswordInput.value
  )
    return;

  e.preventDefault();

  const { success, message } = await createUser(
    nameInput.value.value,
    emailInput.value.value,
    passwordInput.value.value
  );

  if (!success) {
    errorMessage.value = message;
    return;
  }

  nameInput.value.value = '';
  emailInput.value.value = '';
  passwordInput.value.value = '';
  confirmPasswordInput.value.value = '';

  isRegisteredSuccessfully.value = true;
};

const changeInput = () => {
  if (
    nameInput.value?.value &&
    emailInput.value?.value &&
    passwordInput.value?.value &&
    passwordInput.value?.value === confirmPasswordInput.value?.value
  ) {
    isButtonDisabled.value = false;
  } else {
    isButtonDisabled.value = true;
  }
  isRegisteredSuccessfully.value = false;
  errorMessage.value = null;
};
</script>
