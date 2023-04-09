<template>
  <section class="mx-auto min-h-screen flex flex-col justify-center px-4 gap-8">
    <h1 class="text-3xl font-bold text-center mt-auto">
      {{ t('Login.Title') }}
    </h1>

    <form
      class="flex flex-col gap-8 w-full max-w-lg mx-auto"
      @submit="submitLoginForm"
    >
      <div class="text-left flex flex-col gap-2">
        <div class="flex flex-col">
          <label for="email">{{ t('Login.Email') }}</label>
          <input
            class="p-2 rounded"
            @input="changeInput"
            ref="emailInput"
            type="email"
            name="email"
            id="email"
            :placeholder="t('Login.EmailPlaceholder')"
            required
          />
        </div>
        <div class="flex flex-col">
          <label for="password">{{ t('Login.Password') }}</label>
          <input
            class="p-2 rounded"
            @input="changeInput"
            ref="passwordInput"
            type="password"
            name="password"
            id="password"
            :placeholder="t('Login.PasswordPlaceholder')"
            required
          />
        </div>
      </div>

      <div
        v-if="errorType === 'invalid.credential'"
        class="text-center text-red-600"
      >
        {{ $t('Error.InvalidCredential') }}
      </div>
      <div
        v-else-if="errorType === 'unregistered.email'"
        class="text-center text-red-600"
      >
        {{ $t('Error.UnregisteredEmail') }}
      </div>
      <div v-else-if="errorMessage" class="text-center text-red-600">
        {{ $t('Error.Unidentified') }}
      </div>

      <button
        class="bg-white disabled:opacity-50 disabled:cursor-not-allowed py-2 text-black font-bold rounded"
        type="submit"
        :disabled="isButtonDisabled"
      >
        {{ t('Login.Button') }}
      </button>
    </form>

    <div class="text-center">
      <p class="text-sm">
        {{ t('Login.RegisterOption') }}
        <span
          class="font-bold cursor-pointer"
          @click="
            () => {
              router.push('/register');
            }
          "
        >
          {{ t('Login.RegisterLink') }}
        </span>
      </p>
    </div>

    <LanguageOption />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCookies } from 'vue3-cookies';
import { useRouter } from 'vue-router';
import { getUserConversations } from '../apis/conversation';
import { getConversationMessages } from '../apis/message';
import { login, getConversationUsers, getUser } from '../apis/user';
import { useUserStore } from '../stores/user';
import { useConversationStore } from '../stores/conversation';
import { connectSocket } from '../utils/socket';
import { useI18n } from 'vue-i18n';
import LanguageOption from '../components/LanguageOption.vue';

const { t } = useI18n();
const router = useRouter();
const { cookies } = useCookies();
const userStore = useUserStore();
const conversationStore = useConversationStore();
const emailInput = ref<HTMLInputElement | null>(null);
const passwordInput = ref<HTMLInputElement | null>(null);
const isButtonDisabled = ref<boolean>(true);
const errorMessage = ref('');
const errorType = ref('');

onMounted(() => {
  emailInput.value?.focus();
});

const submitLoginForm = async (e: Event) => {
  if (!emailInput.value || !passwordInput.value) return;

  e.preventDefault();

  const {
    success: isLoginSuccess,
    message: loginMessage,
    error: loginError,
    accessToken,
  } = await login(emailInput.value.value, passwordInput.value.value);

  if (!isLoginSuccess) {
    errorType.value = loginError?.type || loginError?.code;
    errorMessage.value = loginMessage;
    return;
  }

  emailInput.value.value = '';
  passwordInput.value.value = '';

  cookies.set('accesstoken', accessToken);
  const {
    success: isGetUserSuccess,
    message: getUserMessage,
    user,
  } = await getUser();

  if (!isGetUserSuccess || !user) {
    errorMessage.value = getUserMessage;
    return;
  }

  userStore.setUser(user.id, user.name, user.email, user.profilePicture);
  connectSocket(user.id, user.name, user.email);

  const { success: isGetUserConversationsSuccess, conversations } =
    await getUserConversations(user.id);

  if (isGetUserConversationsSuccess) {
    for (const { conversationId, name } of conversations) {
      const { success: successGetConversationMessage, messages } =
        await getConversationMessages(conversationId);
      if (!successGetConversationMessage) return;

      const { success: successGetConversationUsers, users } =
        await getConversationUsers(conversationId);
      if (!successGetConversationUsers) return;

      conversationStore.updateData(
        {
          conversationId,
          userId: null,
          name,
          users,
          messages,
          message: null,
        },
        userStore
      );
    }
  }

  router.push('/');
};

const changeInput = () => {
  if (emailInput.value?.value && passwordInput.value?.value) {
    isButtonDisabled.value = false;
  } else {
    isButtonDisabled.value = true;
  }
  errorType.value = '';
  errorMessage.value = '';
};
</script>
