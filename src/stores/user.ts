import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const id = ref('');
  const name = ref('');
  const email = ref('');

  // TODO: should not be here
  const onlineUsers = ref<any>([]);

  const setUser = ({
    newId,
    newName,
    newEmail,
  }: {
    newId: string;
    newName: string;
    newEmail: string;
  }) => {
    id.value = newId;
    name.value = newName;
    email.value = newEmail;
  };

  const resetUser = () => {
    id.value = '';
    name.value = '';
    email.value = '';
  };

  return { id, name, email, onlineUsers, setUser, resetUser };
});
