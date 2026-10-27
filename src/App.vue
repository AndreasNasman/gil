<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { ref, onMounted } from 'vue'

const loading = ref(false)

const data = ref([])

// {"Authorization": "Bearer " + ScriptApp.getOAuthToken()}

const accessToken = ""

async function fetchData() {
  loading.value = true
  try {
    // const response = await fetch(`https://script.google.com/macros/s/AKfycby04EGJi61Ht090CplXYZ_m37rJFNIT4SMZDW9h8bqh2LxfNs_4PntjCFyUFv1AxeM4/exec?access_token=${accessToken}`,
    const response = await fetch("/api/execs", {
      headers: {
            Authorization: `Bearer ${accessToken}`,
      }
    })
    data.value = await response.json()
  } catch (error) {
    console.error(`Failed to fetch data: ${error}`)
  } finally {
    loading.value = false
  }
}

async function onSubmit(event) {
  console.log("submitting")
  const data = new FormData(event.target);
  const action = event.target.action;
  fetch(action, {
    method: 'POST',
    body: data
  })
  .then(() => {
    console.log("Success!");
      fetchData()
   })
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="grid w-screen h-screen place-content-center">
    <div v-if="loading">Loading...</div>
    <form v-else class="border grid" method="POST"
      action="https://script.google.com/macros/s/AKfycby04EGJi61Ht090CplXYZ_m37rJFNIT4SMZDW9h8bqh2LxfNs_4PntjCFyUFv1AxeM4/exec?access_token="
      @submit.prevent="onSubmit"
    >
      <input name="Email" type="email" placeholder="Email" required>
      <input name="Name" type="text" placeholder="Name" required>
      <button class="p-1 bg-amber-500 rounded" type="submit">Send</button>
    </form>

    <button class="mt-1 p-1 bg-blue-500 rounded" @click="fetchData">Fetch</button>

    <table class="text-white w-full border-separate border-spacing-2 border border-gray-400 bg-white text-sm dark:border-gray-500 dark:bg-gray-800">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="border border-gray-300 dark:border-gray-600" v-for="header in data.headers">{{ header }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in data.rows">
          <td class="border border-gray-300 dark:border-gray-700" v-for="value in row">{{value}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
