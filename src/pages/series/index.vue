<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { onMounted, ref } from 'vue'
import { SeriesService } from '/@src/services/series.service'
import moment from 'moment'
import CreateSeries from '/@src/components/edify/Create/CreateSeries.vue'
import { Series } from '/@src/interfaces/series'
import { Notyf } from 'notyf'
import { PreacherService } from '/@src/services/preacher.service'
import { CategoryService } from '/@src/services/category.service'
import { TopicService } from '/@src/services/topic.service'
import { Preacher } from '/@src/interfaces/preacher'
import { Category } from '/@src/interfaces/category'
import { Topic } from '/@src/interfaces/topic'
import UpdateSeries from '/@src/components/edify/Update/UpdateSeries.vue'

const notyf = new Notyf()
const seriesList = ref<Series[]>([])
const preachers = ref<Preacher[]>([])
const categories = ref<Category[]>([])
const topics = ref<Topic[]>([])
const tableLoading = ref(true)
const isDeletingSeries = ref<boolean>(false)
const deleteSeriesModal = ref<boolean>(false)
const selectedSeries = ref<Series>()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Series')

onMounted(() => {
  fetchSeries()
  fetchPreachers()
  fetchCategories()
  fetchTopics()
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

const fetchPreachers = async () => {
  try {
    const response = await PreacherService.getPreachers()
    preachers.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}

const fetchCategories = async () => {
  try {
    const response = await CategoryService.getCategories()
    categories.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}

const fetchTopics = async () => {
  try {
    const response = await TopicService.getTopics()
    topics.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}

const openDeleteSeriesModal = (series: Series) => {
  deleteSeriesModal.value = true
  selectedSeries.value = series
}

const deleteSeries = async () => {
  isDeletingSeries.value = true
  try {
    const seriesId = selectedSeries.value?.id as string
    await SeriesService.deleteSeries(seriesId)
    isDeletingSeries.value = false
    await fetchSeries()
    notyf.success('Series deleted successfully')
  } catch (error) {
    isDeletingSeries.value = false
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
          <CreateSeries
            :categories="categories"
            :preachers="preachers"
            :topics="topics"
          />
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
                    <a
                      href="#"
                      role="menuitem"
                      class="dropdown-item is-media"
                      @click="openDeleteSeriesModal(series)"
                    >
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-trash-can-alt"></i>
                      </div>
                      <div class="meta">
                        <span>Delete</span>
                      </div>
                    </a>
                    <hr class="dropdown-divider" />
                    <UpdateSeries
                      :categories="categories"
                      :preachers="preachers"
                      :topics="topics"
                      :series="series"
                      @fetch-series="fetchSeries"
                    />
                    <hr class="dropdown-divider" />
                    <UpdateSeriesImage :series="series" @fetch-series="fetchSeries" />
                  </template>
                </VDropdown>
              </td>
            </tr>
          </tbody>
        </VSimpleDatatables>
      </VLoader>
    </div>

    <VModal
      :open="deleteSeriesModal"
      size="large"
      title="Delete Series"
      actions="right"
      noclose
      @close="deleteSeriesModal = false"
    >
      <template #content>
        <h5 v-if="selectedSeries" class="has-text-centered">
          Delete
          <span class="is-medium-bold">{{ selectedSeries.title }}</span>
        </h5>
      </template>
      <template #action>
        <VButton color="primary" :loading="isDeletingSeries" raised @click="deleteSeries"
          >Delete</VButton
        >
      </template>
    </VModal>
  </SidebarLayout>
</template>
