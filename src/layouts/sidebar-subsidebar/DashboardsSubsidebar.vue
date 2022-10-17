<script setup lang="ts">
const openSubsidebarLinks = ref('')
const emit = defineEmits(['close'])
</script>

<template>
  <div class="sidebar-panel is-generic">
    <div class="subpanel-header">
<!--      <ProjectsQuickDropdown />-->

      <h3 class="no-mb">Edify</h3>
      <div
        class="panel-close"
        tabindex="0"
        @keydown.space.prevent="emit('close')"
        @click="emit('close')"
      >
        <i aria-hidden="true" class="iconify" data-icon="feather:x"></i>
      </div>
    </div>
    <div class="inner" data-simplebar>
      <ul>
        <VCollapseLinks v-model:open="openSubsidebarLinks" collapse-id="sermons">
          <template #header>
            Sermons
            <i aria-hidden="true" class="iconify" data-icon="feather:chevron-right" />
          </template>

          <RouterLink to="/sermons" class="is-submenu">
            <i aria-hidden="true" class="lnil lnil-music-note"></i>
            <span>Sermons</span>
          </RouterLink>
        </VCollapseLinks>
        <VCollapseLinks v-model:open="openSubsidebarLinks" collapse-id="series">
          <template #header>
            Series
            <i aria-hidden="true" class="iconify" data-icon="feather:chevron-right" />
          </template>

          <RouterLink to="/series" class="is-submenu">
            <i aria-hidden="true" class="lnil lnil-video-alt"></i>
            <span>Series</span>
          </RouterLink>
        </VCollapseLinks>
        <VCollapseLinks v-model:open="openSubsidebarLinks" collapse-id="preachers">
          <template #header>
            Preachers
            <i aria-hidden="true" class="iconify" data-icon="feather:chevron-right" />
          </template>

          <RouterLink to="/preachers" class="is-submenu">
            <i aria-hidden="true" class="lnil lnil-megaphone"></i>
            <span>Preachers</span>
          </RouterLink>
        </VCollapseLinks>
        <VCollapseLinks v-model:open="openSubsidebarLinks" collapse-id="topics">
          <template #header>
            Topics
            <i aria-hidden="true" class="iconify" data-icon="feather:chevron-right" />
          </template>

          <RouterLink to="/topics" class="is-submenu">
            <i aria-hidden="true" class="lnil lnil-menu"></i>
            <span>Topics</span>
          </RouterLink>
        </VCollapseLinks>
        <VCollapseLinks v-model:open="openSubsidebarLinks" collapse-id="categories">
          <template #header>
            Categories
            <i aria-hidden="true" class="iconify" data-icon="feather:chevron-right" />
          </template>
          <RouterLink to="/categories" class="is-submenu">
            <i aria-hidden="true" class="lnil lnil-menu"></i>
            <span>Categories</span>
          </RouterLink>
        </VCollapseLinks>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/layout/sidebar-panel';
</style>
