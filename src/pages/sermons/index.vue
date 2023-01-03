<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import moment from 'moment'
import algoliasearch from 'algoliasearch/lite'

const searchClient = ref(algoliasearch('I12U2XGLQV', 'b271ed9dd42677204f390a183509e054'))
const tableLoading = ref<boolean>(false)
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Sermons')

useHead({
  title: 'Sermons - Edify',
})

//TODO filter series list when a preacher is selected on the form
</script>

<template>
  <SidebarLayout open-on-mounted>
    <!-- Content Wrapper -->
    <div class="page-content-inner">
      <div class="list-flex-toolbar flex-list-v1">
        <VButtons>
          <CreateSermon />
        </VButtons>
      </div>
      <VLoader :active="tableLoading" size="large">
        <ais-instant-search :search-client="searchClient" index-name="edify_sermons">
          <div class="search-panel">
            <div class="search-panel__filters">
              <ais-refinement-list attribute="brand" />
            </div>

            <div class="search-panel__results">
              <div class="searchbox">
                <ais-search-box placeholder="Search" />
              </div>
              <ais-hits>
                <template #default="{ items }">
                  <div
                    class="dataTable-wrapper dataTable-loading dataTable-empty no-footer fixed-columns"
                  >
                    <div class="dataTable-top"></div>
                    <div class="dataTable-container">
                      <table class="text-nowrap dataTable-table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Image</th>
                            <th>Audio</th>
                            <th>Release Date</th>
                            <th>Duration</th>
                            <th>Preacher</th>
                            <th>Series</th>
                            <th>Last Updated</th>
                            <th>Date Created</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-if="items.length === 0">
                            <td colspan="9">
                              <VPlaceholderSection
                                title="No sermon to show"
                                subtitle="There is currently no sermon to show in this list."
                              >
                                <template #image>
                                  <img
                                    class="light-image"
                                    src="/@src/assets/illustrations/placeholders/search-4.svg"
                                    alt=""
                                  />
                                  <img
                                    class="dark-image"
                                    src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
                                    alt=""
                                  />
                                </template>
                              </VPlaceholderSection>
                            </td>
                          </tr>
                          <tr v-for="sermon in items" :key="sermon.id">
                            <td>
                              <span
                                class="has-dark-text dark-inverted is-font-alt is-weight-600 rem-90"
                                >{{ sermon.title }}</span
                              >
                            </td>
                            <td>
                              <div class="flex-media">
                                <VAvatar :picture="sermon.image_url" size="medium" />
                              </div>
                            </td>
                            <td>
                              <a
                                class="light-text"
                                target="_blank"
                                :href="sermon.audio_url.slice(0, -4) + '_playlist.m3u8'"
                                >Insert Play Audio Button</a
                              >
                            </td>
                            <td>
                              <span class="light-text">{{
                                moment(sermon.release_date).format('YYYY-MM-DD')
                              }}</span>
                            </td>
                            <td>
                              <span class="light-text">{{ sermon.duration }}</span>
                            </td>
                            <td>
                              <span class="light-text">{{ sermon.preacher.name }}</span>
                            </td>
                            <td>
                              <span class="light-text">{{ sermon.series?.title }}</span>
                            </td>
                            <td>
                              <span class="light-text">{{
                                moment(sermon.updated_at).format('YYYY-MM-DD')
                              }}</span>
                            </td>
                            <td>
                              <span class="light-text">{{
                                moment(sermon.created_at).format('YYYY-MM-DD')
                              }}</span>
                            </td>
                            <td>
                              <VDropdown icon="feather:more-vertical" right spaced>
                                <template #content>
                                  <a
                                    href="#"
                                    role="menuitem"
                                    class="dropdown-item is-media"
                                  >
                                    <div class="icon">
                                      <i aria-hidden="true" class="lnil lnil-reload"></i>
                                    </div>
                                    <div class="meta">
                                      <span>Reload</span>
                                      <span>Reload Widget</span>
                                    </div>
                                  </a>

                                  <a
                                    href="#"
                                    role="menuitem"
                                    class="dropdown-item is-media"
                                  >
                                    <div class="icon">
                                      <i aria-hidden="true" class="lnil lnil-cogs"></i>
                                    </div>
                                    <div class="meta">
                                      <span>Configure</span>
                                      <span>Configure widget</span>
                                    </div>
                                  </a>

                                  <a
                                    href="#"
                                    role="menuitem"
                                    class="dropdown-item is-media"
                                  >
                                    <div class="icon">
                                      <i aria-hidden="true" class="lnil lnil-cog"></i>
                                    </div>
                                    <div class="meta">
                                      <span>Settings</span>
                                      <span>Widget Settings</span>
                                    </div>
                                  </a>

                                  <hr class="dropdown-divider" />

                                  <a
                                    href="#"
                                    role="menuitem"
                                    class="dropdown-item is-media"
                                  >
                                    <div class="icon">
                                      <i
                                        aria-hidden="true"
                                        class="lnil lnil-trash-can-alt"
                                      ></i>
                                    </div>
                                    <div class="meta">
                                      <span>Remove</span>
                                      <span>Remove from view</span>
                                    </div>
                                  </a>
                                </template>
                              </VDropdown>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </template>
              </ais-hits>

              <div class="pagination is-flex is-justify-content-center">
                <ais-pagination class="is-flex" />
              </div>
            </div>
          </div>
        </ais-instant-search>
      </VLoader>
    </div>
  </SidebarLayout>
</template>
