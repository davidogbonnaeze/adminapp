/**
 * We can extends the env types here
 * @see https://vitejs.dev/guide/env-and-mode.html#env-files
 */

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_API_BASE_URL: string
  readonly VITE_MAPBOX_ACCESS_TOKEN: string
  readonly SERMONS_DISTRIBUTION_DOMAIN_NAME: string
  readonly IMAGES_DISTRIBUTION_DOMAIN_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
