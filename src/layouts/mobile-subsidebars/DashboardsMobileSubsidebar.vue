<template>
  <div class="mobile-subsidebar">
    <div class="inner">
      <div class="sidebar-title">
        <h3>Edify</h3>
      </div>

      <ul class="submenu" data-simplebar>
        <VCollapseLinks>
          <template #header>
            Sermons
            <i aria-hidden="true" class="iconify" data-icon="feather:chevron-right" />
          </template>

          <RouterLink to="/sermons" class="is-submenu">
            <i aria-hidden="true" class="lnil lnil-music-note"></i>
            <span>Sermons</span>
          </RouterLink>
        </VCollapseLinks>
        <VCollapseLinks >
          <template #header>
            Series
            <i aria-hidden="true" class="iconify" data-icon="feather:chevron-right" />
          </template>

          <RouterLink to="/series" class="is-submenu">
            <i aria-hidden="true" class="lnil lnil-video-alt"></i>
            <span>Series</span>
          </RouterLink>
        </VCollapseLinks>
        <VCollapseLinks >
          <template #header>
            Preachers
            <i aria-hidden="true" class="iconify" data-icon="feather:chevron-right" />
          </template>

          <RouterLink to="/preachers" class="is-submenu">
            <i aria-hidden="true" class="lnil lnil-megaphone"></i>
            <span>Preachers</span>
          </RouterLink>
        </VCollapseLinks>
        <VCollapseLinks >
          <template #header>
            Topics
            <i aria-hidden="true" class="iconify" data-icon="feather:chevron-right" />
          </template>

          <RouterLink to="/topics" class="is-submenu">
            <i aria-hidden="true" class="lnil lnil-menu"></i>
            <span>Topics</span>
          </RouterLink>
        </VCollapseLinks>
        <VCollapseLinks >
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
