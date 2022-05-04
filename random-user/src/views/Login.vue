<template lang="pug">
div(class="inline-block m-auto p-10 self-center bg-substrate")
  form(
    class="flex flex-col gap-y-4"
    @submit.stop.prevent="handleSubmit"
  )
    //- email input
    div(class="w-56")
      input(
        class="text-input"
        placeholder="Email"
        name="email"
        type="email"
        v-model.lazy="email"
        :disabled="isProcessing"
      )
      div(class="input-error") {{ errors.email }}
    //- password input
    div(class="w-56")
      input(
        class="text-input"
        placeholder="Password"
        name="password"
        type="password"
        v-model.lazy="password"
        :disabled="isProcessing"
      )
      div(class="input-error") {{ errors.password }}
    div(class="flex flex-row justify-between")
      span(
        class="action-text-primary"
        @click.stop="router.push({'name': 'register'})"
      ) Register
      button(
        class="action-button-primary"
        type="submit"
        :disabled="meta.valid === false || isProcessing === true"
      ) Login
</template>

<script setup lang="ts">
import type { AuthError } from '@firebase/auth';
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import authService from '@/services/auth'
import { useStore } from '@/stores/user'
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const userStore = useStore()
const router = useRouter()
const isProcessing = ref<boolean>(false)

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6) // password min length is 6 (firebase/auth requirements)
})

const { errors, meta, setFieldError } = useForm({
  validationSchema: schema,
});

const { value: email } = useField<string>('email');
const { value: password } = useField<string>('password');

async function handleSubmit() {
  if (meta.value.valid === false || isProcessing.value === true) {
    return
  }

  isProcessing.value = true

  try {
    // login success, get user info
    const user = await authService.signIn({
      email: email.value,
      password: password.value
    })

    router.push({'name': 'user-list'})

  } catch (error: unknown) {
    // login failed, throw an error
    const { code } = error as AuthError

    switch (code) {
      case 'auth/invalid-email':
        setFieldError('email', 'invalid email')
        break;
      case 'auth/user-disabled':
        setFieldError('email', 'user disabled')
        break;
      case 'auth/user-not-found':
        setFieldError('email', 'user doesn\'t exist')
        break;
      case 'auth/wrong-password':
        setFieldError('password', 'wrong password')
        break;
      default:
        console.error(error)
        break;
    }

  } finally {
    isProcessing.value = false
  }
}

</script>