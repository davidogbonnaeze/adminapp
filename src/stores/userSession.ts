import { acceptHMRUpdate, defineStore } from 'pinia'

export interface AuthState {
  token: any
  isLoggedIn: boolean
  loading: boolean
  user: Record<string, never>
}

export const useUserSession = defineStore('userSession', {
  state: (): AuthState => ({
    token: undefined,
    isLoggedIn: false,
    user: {},
    loading: false,
  }),
  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
  },
  actions: {
    setToken(token: string) {
      this.token = token
      this.isLoggedIn = true
    },
    setUser(user: Record<string, never>) {
      this.user = user
    },
    setLoading(isLoadingValue: boolean) {
      this.loading = isLoadingValue
    },
    logoutUser() {
      this.token = undefined
      this.isLoggedIn = false
      this.user = {}
    },
  },
  persist: true,
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserSession, import.meta.hot))
}
