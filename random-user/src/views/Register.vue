<template lang="pug">
div(class="inline-block m-auto p-10 self-center bg-substrate")
  form(
    class="flex flex-col gap-y-4"
    @submit.stop.prevent="handleSubmit"
  )
    Avatar(
      v-if="imageUrl"
      :imageUrl="imageUrl"
      @failed="setFieldError('imageUrl', 'invalid avatar url')"
      class="self-center"
    )
    //- avatar url input
    div(class="w-56")
      input(
        class="text-input"
        placeholder="Avatar Image URL"
        name="imageUrl"
        type="text"
        v-model.lazy="imageUrl"
        :disabled="isProcessing"
      )
      div(class="input-error") {{ errors.imageUrl }}
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
    //- name input
    div(class="w-56")
      input(
        class="text-input"
        placeholder="Name"
        name="name"
        type="text"
        v-model.lazy="name"
        :disabled="isProcessing"
      )
      div(class="input-error") {{ errors.name }}
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
    //- password confirm input
    div(class="w-56")
      input(
        class="text-input"
        placeholder="Password Again"
        name="passwordConfirm"
        type="password"
        v-model.lazy="passwordConfirm"
        :disabled="isProcessing"
      )
      div(class="input-error") {{ errors.passwordConfirm }}
    //- age input
    div(class="w-56")
      input(
        class="text-input"
        placeholder="Age"
        name="age"
        type="number"
        v-model.lazy="age"
        :disabled="isProcessing"
      )
      div(class="input-error") {{ errors.age }}
    //- gender select
    div(class="w-56")
      select(
        class="text-input bg-white"
        name="gender"
        v-model.lazy="gender"
        :disabled="isProcessing"
      )
        option(
          v-for="gender in genderOptions"
          :key="gender"
          :value="gender") {{ gender }}

      div(class="input-error") {{ errors.gender }}
    div(class="flex flex-row justify-between")
      span(
        class="action-text-primary"
        @click.stop="router.push({'name': 'login'})"
      ) Login
      button(
        class="action-button-primary"
        type="submit"
        :disabled="meta.valid === false || isProcessing === true"
      ) Register

</template>

<script setup lang="ts">
import type { AuthError } from '@firebase/auth';
import Avatar from '@/components/Avatar.vue';
import authService from '@/services/auth'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { ref, toRef } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()
const isProcessing = ref<boolean>(false)
const genderOptions = ['male', 'female', 'other']

const schema = yup.object({
  imageUrl: yup.string().optional().url(),
  email: yup.string().required().email(),
  name: yup.string().required().min(1), // name min length is 1
  password: yup.string().required().min(6), // password min length is 6 (firebase/auth requirements)
  passwordConfirm: yup.string().oneOf([yup.ref('password')], 'passwords must be equal'),
  age: yup.number().required().min(1).lessThan(999), // valid age range 1 ~ 999
  gender: yup.string().required().oneOf(genderOptions)
})

const { errors, meta, setFieldError } = useForm({
  validationSchema: schema,
});

const { value: imageUrl } = useField<string>('imageUrl');
const { value: email } = useField<string>('email');
const { value: name } = useField<string>('name');
const { value: password } = useField<string>('password');
const { value: passwordConfirm } = useField<string>('passwordConfirm');
const { value: age } = useField<number>('age');
const { value: gender } = useField<string>('gender');

async function handleSubmit() {
  if (meta.value.valid === false || isProcessing.value === true) {
    return
  }

  isProcessing.value = true

  try {
    // login success, get user info
    const user = await authService.signUp({
      email: email.value,
      password: password.value,
      name: name.value,
      gender: gender.value,
      age: age.value,
      avatar: imageUrl.value
    })

    router.push({'name': 'user-list'})

  } catch (error: unknown) {
    // login failed, throw an error
    const { code } = error as AuthError

    switch (code) {
      case 'auth/email-already-in-use':
        setFieldError('email', 'email aleary in use')
        break;
      case 'auth/invalid-email':
        setFieldError('email', 'invalid email')
        break;
      case 'auth/operation-not-allowed':
        setFieldError('email', 'operation not allowed')
        break;
      case 'auth/weak-password':
        setFieldError('password', 'password is not strong enough')
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