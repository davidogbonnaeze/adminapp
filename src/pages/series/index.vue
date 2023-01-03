<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { onMounted, ref } from 'vue'
import { SeriesService } from '/@src/services/series.service'
import moment from 'moment'
import CreateSeries from '/@src/components/edify/CreateSeries.vue'
import { Series } from '/@src/interfaces/series'

const seriesList = ref<Series[]>([])
const tableLoading = ref(true)
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Series')

onMounted(() => {
  fetchSeries()
})

useHead({
  title: 'Series - Edify',
})

const fetchSeries = async () => {
  try {
    const response = await SeriesService.getSeries()
    seriesList.value = response.data.data
    tableLoading.value = false
  } catch (error) {
    console.error(error)
  }
}
//TODO filter series list when a preacher is selected on the form
</script>

<template>
  <SidebarLayout open-on-mounted>
    <div class="page-content-inner">
      <div class="list-flex-toolbar flex-list-v1">
        <VButtons>
          <CreateSeries />
        </VButtons>
      </div>
      <VLoader :active="tableLoading" size="large">
        <VSimpleDatatables>
          <thead>
            <tr>
              <th scope="col" data-sortable="false">
                <VField>
                  <VControl>
                    <!--                <VCheckbox color="primary" circle outlined />-->
                  </VControl>
                </VField>
              </th>
              <th scope="col">Title</th>
              <th scope="col">Image</th>
              <th scope="col">Release Date</th>
              <th scope="col">Duration</th>
              <th scope="col">Preacher</th>
              <th scope="col">Sermons</th>
              <th scope="col">Topics</th>
              <th scope="col">Categories</th>
              <th scope="col">Last Updated</th>
              <th scope="col">Date Created</th>
              <th scope="col" data-sortable="false"></th>
            </tr>
          </thead>
          <tbody v-if="!tableLoading">
            <tr v-if="seriesList.length === 0">
              <td colspan="9">
                <!--Empty Placeholder-->
                <VPlaceholderSection
                  title="No series to show"
                  subtitle="There is currently no series to show in this list."
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
            <tr v-for="series in seriesList" :key="series.id">
              <td>
                <VField>
                  <VControl>
                    <VCheckbox color="primary" circle outlined />
                  </VControl>
                </VField>
              </td>
              <td>
                <span
                  class="has-dark-text dark-inverted is-font-alt is-weight-600 rem-90"
                  >{{ series.title }}</span
                >
              </td>
              <td>
                <div class="flex-media">
                  <VAvatar :picture="series.image_url" size="medium" />
                </div>
              </td>
              <td>
                <span class="light-text">{{
                  moment(series.release_date).format('YYYY-MM-DD')
                }}</span>
              </td>
              <td>
                <span class="light-text">{{ series.duration }}</span>
              </td>
              <td>
                <span class="light-text">{{ series.preacher.name }}</span>
              </td>
              <td>
                <span class="light-text">{{ series.sermons.length }}</span>
              </td>
              <td>
                <span class="light-text">{{ series.topics.length }}</span>
              </td>
              <td>
                <span class="light-text">{{ series.categories.length }}</span>
              </td>
              <td>
                <span class="light-text">{{
                  moment(series.updated_at).format('YYYY-MM-DD')
                }}</span>
              </td>
              <td>
                <span class="light-text">{{
                  moment(series.created_at).format('YYYY-MM-DD')
                }}</span>
              </td>
              <td>
                <VDropdown icon="feather:more-vertical" right spaced>
                  <template #content>
                    <a href="#" role="menuitem" class="dropdown-item is-media">
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-reload"></i>
                      </div>
                      <div class="meta">
                        <span>Reload</span>
                        <span>Reload Widget</span>
                      </div>
                    </a>

                    <a href="#" role="menuitem" class="dropdown-item is-media">
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-cogs"></i>
                      </div>
                      <div class="meta">
                        <span>Configure</span>
                        <span>Configure widget</span>
                      </div>
                    </a>

                    <a href="#" role="menuitem" class="dropdown-item is-media">
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-cog"></i>
                      </div>
                      <div class="meta">
                        <span>Settings</span>
                        <span>Widget Settings</span>
                      </div>
                    </a>

                    <hr class="dropdown-divider" />

                    <a href="#" role="menuitem" class="dropdown-item is-media">
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-trash-can-alt"></i>
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
        </VSimpleDatatables>
      </VLoader>
    </div>
  </SidebarLayout>
</template>
