<script setup lang="ts">
import { initDarkmode } from '/@src/stores/darkmode'
import axios from 'axios'
import { useUserSession } from '/@src/stores/userSession'

// This is the global app setup function

/**
 * Initialize the darkmode watcher
 *
 * @see /@src/stores/darkmode
 */
initDarkmode()
const store = useUserSession()

const token = computed(() => store.token)

onMounted(() => {
  if (token.value) {
    axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
  }
})

watch(
  () => token.value,
  async (val) => {
    if (val) {
      axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
    } else {
      delete axios.defaults.headers.common.Authorization
    }
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <Suspense>
      <RouterView v-slot="{ Component }">
        <Transition name="fade-slow" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </Suspense>
    <ClientOnly>
      <VReloadPrompt app-name="Vuero" />
    </ClientOnly>
  </div>
</template>
