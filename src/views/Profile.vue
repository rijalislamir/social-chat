<template>
  <section class="flex flex-col gap-8 h-screen">
    <div class="flex flex-col gap-8 p-4 h-screen">
      <div>
        <img
          v-if="userStore.profilePicture"
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

        <p class="pt-4 text-xs text-center">
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
            v-if="isEditMode"
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
          <div class="flex justify-between p-2">
            <div>{{ email }}</div>
          </div>
        </div>

        <div>
          <div class="p-2 font-bold">{{ $t('Profile.Language') }}</div>
          <select
            v-model="language"
            @change="
              () => {
                $i18n.locale = language;
                storeLanguage(language);
              }
            "
            name="language"
            id="language"
            class="w-full p-2 rounded-md cursor-pointer"
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
          class="bg-white p-2 text-black font-bold rounded grow"
          @click="() => logout(router)"
        >
          {{ $t('Profile.Logout') }}
        </button>
      </div>

      <div class="flex">
        <button
          class="bg-red-600 p-2 text-white font-bold rounded grow"
          @click="openDeleteModal"
        >
          {{ $t('Profile.DeleteAccount') }}
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
import { TimeoutId } from '../types';
import { LocaleLabels } from '../locales';
import Navbar from '../components/Navbar.vue';
import UserDeleteModal from '../components/UserDeleteModal.vue';
import UserIcon from '../assets/user-icon.svg';

const router = useRouter();
const userStore = useUserStore();
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

  if (
    (!nameInput.value && !encodedProfilePicture.value) ||
    nameInput.value?.value.trim() === userStore.name
  )
    return;

  const { success, user, message } = await updateUser(
    userStore.id,
    nameInput.value?.value || userStore.name,
    encodedProfilePicture.value || userStore.profilePicture
  );

  if (!success) {
    if (message.type === 'entity.too.large')
      alert('Exceed ~500kb (max size) limit!');
    return;
  }

  userStore.setUser(
    user.id,
    user.name,
    user.email,
    encodedProfilePicture.value
  );
};

const storeLanguage = (code: string) => {
  localStorage.setItem('language', code);
};
</script>
