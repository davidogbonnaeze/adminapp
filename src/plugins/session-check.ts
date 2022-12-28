import { definePlugin } from '/@src/app'
import { useUserSession } from '/@src/stores/userSession'

/**
 * Here we are setting up two router navigation guards
 * (note that we can have multiple guards in multiple plugins)
 *
 * We can add meta to pages either by declaring them manualy in the
 * routes declaration (see /@src/router.ts)
 * or by adding a <route> tag into .vue files (see /@src/pages/sidebar/dashboards.ts)
 *
 * <route lang="yaml">
 * meta:
 *   requiresAuth: true
 * </route>
 *
 * <script setup lang="ts">
 *  // TS script
 * </script>
 *
 * <template>
 *  // HTML content
 * </template>
 */
export default definePlugin(async ({ router, api, pinia }) => {
  const userSession = useUserSession(pinia)

  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !userSession.isLoggedIn) {
      next({
        path: '/',
        // save the location we were at to come back later
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  })

  console.log(api)
})
