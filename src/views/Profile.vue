<template>
  <section class="flex flex-col h-screen justify-between">
    <div class="flex flex-col gap-8 p-4 overflow-y-auto">
      <div>
        <div
          v-if="uiStore.isLoading"
          class="animate-pulse rounded-full bg-white w-48 h-48 mx-auto cursor-pointer opacity-50"
        ></div>
        <img
          v-else-if="userStore.profilePicture"
          @click="inputProfilePicture"
          :src="userStore.profilePicture"
          alt="profile-picture"
          class="w-48 h-48 rounded-[50%] mx-auto cursor-pointer object-cover"
        />
        <div
          v-else
          class="rounded-full bg-white w-48 h-48 mx-auto cursor-pointer"
          @click="inputProfilePicture"
        >
          <img :src="UserIcon" alt="user-icon" class="p-4" />
        </div>

        <div
          v-if="uiStore.isLoading"
          class="animate-pulse grow rounded-md bg-custom-gray w-3/5 h-4 mx-auto mt-4"
        ></div>
        <p v-else class="pt-4 text-xs text-center">
          {{ $t('Profile.MaxSize') }}
        </p>
      </div>

      <input
        ref="profilePictureInput"
        class="hidden"
        @change="handleProfilePicture"
        type="file"
        name="profile-picture"
        id="profile-picture"
        accept="image/jpg,image/png"
      />

      <div class="flex flex-col gap-2">
        <div>
          <div class="p-2 font-bold">{{ $t('Profile.Name') }}</div>
          <div
            v-if="uiStore.isLoading"
            class="animate-pulse grow rounded-md bg-custom-gray w-full h-10"
          ></div>
          <div
            v-else-if="isEditMode"
            class="flex justify-between items-center gap-4"
          >
            <input
              ref="nameInput"
              class="grow p-2 rounded"
              type="text"
              name="name"
              id="name"
              :value="name"
              autocomplete="off"
            />
            <div
              class="cursor-pointer font-bold text-2xl"
              @click="disableEditMode"
            >
              &times;
            </div>
            <div
              class="cursor-pointer font-bold text-2xl"
              @click="onUpdateUser"
            >
              &check;
            </div>
          </div>
          <div v-else class="flex justify-between items-center gap-4">
            <div class="p-2">{{ name }}</div>
            <div
              class="cursor-pointer font-bold text-2xl"
              @click="activateEditMode"
            >
              &#9998;
            </div>
          </div>
        </div>

        <div>
          <div class="p-2 font-bold">{{ $t('Profile.Email') }}</div>
          <div
            v-if="uiStore.isLoading"
            class="animate-pulse grow rounded-md bg-custom-gray w-full h-10"
          ></div>
          <div v-else class="flex justify-between p-2">
            <div>{{ email }}</div>
          </div>
        </div>

        <div>
          <div class="p-2 font-bold">{{ $t('Profile.Language') }}</div>
          <div
            v-if="uiStore.isLoading"
            class="animate-pulse grow rounded-md bg-custom-gray w-full h-10"
          ></div>
          <select
            v-else
            v-model="language"
            @change="
              () => {
                $i18n.locale = language;
                storeLanguage(language);
              }
            "
            name="language"
            id="language"
            class="w-full p-2 rounded-md cursor-pointer h-10"
          >
            <option
              v-for="(localeLabel, localeKey, i) of LocaleLabels"
              :key="`language-${i}`"
              :value="localeKey"
            >
              {{ localeLabel }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex">
        <button
          class="bg-white disabled:opacity-50 p-2 text-black font-bold rounded grow flex justify-center"
          @click="
            () => {
              uiStore.isLoading = true;
              logout(router);
            }
          "
          :disabled="uiStore.isLoading"
        >
          <MoonLoader
            :loading="uiStore.isLoading"
            :color="'#000000'"
            :size="'24px'"
          />
          <span v-if="!uiStore.isLoading">
            {{ $t('Profile.Logout') }}
          </span>
        </button>
      </div>

      <div class="flex">
        <button
          class="bg-red-600 disabled:opacity-50 p-2 text-white font-bold rounded grow flex justify-center"
          @click="openDeleteModal"
          :disabled="uiStore.isLoading"
        >
          <MoonLoader
            :loading="uiStore.isLoading"
            :color="'#000000'"
            :size="'24px'"
          />
          <span v-if="!uiStore.isLoading">{{
            $t('Profile.DeleteAccount')
          }}</span>
        </button>
      </div>
    </div>

    <Navbar />
  </section>

  <UserDeleteModal
    :show="showDeleteModal"
    @close-modal="closeDeleteModal"
    @logout="() => logout(router)"
  />
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { logout, updateUser } from '../apis/user';
import { useUserStore } from '../stores/user';
import { useUiStore } from '../stores/ui';
import { TimeoutId } from '../types';
import { LocaleLabels } from '../locales';
import { MoonLoader } from 'vue3-spinner';
import Navbar from '../components/Navbar.vue';
import UserDeleteModal from '../components/UserDeleteModal.vue';
import UserIcon from '../assets/user-icon.svg';

const router = useRouter();
const userStore = useUserStore();
const uiStore = useUiStore();
const name = computed(() => userStore.name);
const email = computed(() => userStore.email);
const showDeleteModal = ref(false);
const nameInput = ref<HTMLInputElement | null>(null);
const profilePictureInput = ref<HTMLInputElement | null>(null);
const language = ref(localStorage.getItem('language') || 'en');
const encodedProfilePicture = ref('');
const isEditMode = ref(false);
const timeoutIds: TimeoutId[] = [];

onUnmounted(() => {
  timeoutIds.forEach((id: TimeoutId) => clearTimeout(id));
});

const inputProfilePicture = () => {
  if (profilePictureInput.value) profilePictureInput.value.click();
};

const handleProfilePicture = () => {
  const files = profilePictureInput.value?.files;
  if (!files) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    if (typeof reader.result === 'string') {
      encodedProfilePicture.value = reader.result;
      onUpdateUser();
    }
  };

  reader.readAsDataURL(files[0]);
};

const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const activateEditMode = () => {
  isEditMode.value = true;
  timeoutIds.push(setTimeout(() => nameInput.value?.focus(), 1));
};

const disableEditMode = () => {
  isEditMode.value = false;
};

const onUpdateUser = async () => {
  disableEditMode();
  uiStore.isLoading = true;

  if (
    (!nameInput.value && !encodedProfilePicture.value) ||
    nameInput.value?.value.trim() === userStore.name
  ) {
    uiStore.isLoading = false;
    return;
  }

  const { success, user, message } = await updateUser(
    userStore.id,
    nameInput.value?.value || userStore.name,
    encodedProfilePicture.value || userStore.profilePicture
  );

  if (!success) {
    if (message.type === 'entity.too.large')
      alert('Exceed ~500kb (max size) limit!');
    uiStore.isLoading = false;
    return;
  }

  userStore.setUser(
    user.id,
    user.name,
    user.email,
    encodedProfilePicture.value
  );
  uiStore.isLoading = false;
};

const storeLanguage = (code: string) => {
  localStorage.setItem('language', code);
};
</script>
