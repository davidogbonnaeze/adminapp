<script setup lang="ts">

import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import {onMounted, reactive, ref} from "vue";
import {SeriesService} from "/@src/services/series.service";
import type {Series} from "/@src/interfaces/series";
import { Notyf } from 'notyf';
import moment from "moment";
import {PreacherService} from "/@src/services/preacher.service";
import type {Preacher} from "/@src/interfaces/preacher";
import {SermonService} from "/@src/services/sermon.service";
import type {Category} from "/@src/interfaces/category";
import type {Topic} from "/@src/interfaces/topic";
import {CategoryService} from "/@src/services/category.service";
import {TopicService} from "/@src/services/topic.service";

const notyf = new Notyf()
const seriesList = ref<Series[]>([])
const preachers = ref<Preacher[]>([])
const categories = ref<Category[]>([])
const topics = ref<Topic[]>([])
const topicList = ref([])
const categoryList = ref([])
const addSeriesFormOpen = ref(false)
const addSeriesFormData = reactive({
  title: null as any,
  release_date: null as any,
  preacher_id: null as any,
  series_image: null as any,
  category_ids: null as any,
  topic_ids: null as any,
})
const tableLoading = ref(true)
const saveButtonLoading = ref(false)
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Series')

onMounted(() => {
  fetchPreachers();
  fetchCategories();
  fetchTopics();
  fetchSeries()
})

useHead({
  title: 'Series - Edify',
})

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

const fetchSeries = async () => {
  try {
    const response = await SeriesService.getSeries()
    seriesList.value = response.data.data
    tableLoading.value = false;
  } catch (error) {
    console.error(error)
  }
}

const onAddSeriesImage = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error)
    return
  }

  const _file = fileInfo.file as File
  if (_file) {
    addSeriesFormData.series_image = _file
  }
}

const onRemoveSeriesImage = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error)
    return
  }
  addSeriesFormData.series_image = null;
}

const resetFormData = () => {
  addSeriesFormData.title = null
  addSeriesFormData.release_date = null
  addSeriesFormData.preacher_id = null
  addSeriesFormData.category_ids = null
  addSeriesFormData.topic_ids = null
  addSeriesFormData.series_image = null
}

const createSeries = async () => {
  saveButtonLoading.value = true;
  const formData = new FormData();
  formData.append('release_date', addSeriesFormData.release_date)
  formData.append('series_image', addSeriesFormData.series_image)
  formData.append('title', addSeriesFormData.title)
  formData.append('duration', 1200)
  formData.append('preacher_id', addSeriesFormData.preacher_id)
  //TODO Handle scenario when topicList or categoryList contains only one value
  for (const topic_id of topicList.value){
    formData.append('topic_ids', topic_id)
  }
  for (const category_id of categoryList.value){
    formData.append('category_ids', category_id)
  }

  try {
    const response = await SeriesService.createSeries(formData);
    resetFormData();
    saveButtonLoading.value = false;
    addSeriesFormOpen.value = false;
    notyf.success('Series created successfully')
    await fetchSeries();
  } catch (error) {
    saveButtonLoading.value = false;
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
          <VButton color="primary" icon="fas fa-plus" @click="addSeriesFormOpen = true"  elevated> Add Series </VButton>
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
            <th scope="col" >Title</th>
            <th scope="col">Image</th>
            <th scope="col" >Release Date</th>
            <th scope="col" >Duration</th>
            <th scope="col" >Preacher</th>
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
          <tr v-for="series in seriesList">
            <td>
              <VField>
                <VControl>
                  <VCheckbox color="primary" circle outlined />
                </VControl>
              </VField>
            </td>
            <td >
              <span class="has-dark-text dark-inverted is-font-alt is-weight-600 rem-90">{{series.title}}</span>
            </td>
            <td>
              <div class="flex-media">
                <VAvatar :picture="'https://d1zuqyxxudi0k.cloudfront.net/' + series.image_url " size="medium" />
              </div>
            </td>
            <td>
              <span class="light-text">{{ moment(series.release_date).format("YYYY-MM-DD")}}</span>
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
              <span class="light-text">{{ moment(series.updated_at).format("YYYY-MM-DD") }}</span>
            </td>
            <td>
              <span class="light-text">{{ moment(series.created_at).format("YYYY-MM-DD") }}</span>
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
    <VModal
      :open="addSeriesFormOpen"
      size="large"
      title="Add Series"
      actions="right"
      noclose
      @close="addSeriesFormOpen = false"
    >
      <template #content>
        <div class="modal-form">
          <div class="columns is-multiline">
            <div class="column is-12">
              <VField label="Series Title *">
                <VControl>
                  <VInput v-model="addSeriesFormData.title" type="text"  placeholder="Ex: Redeeming the time" />
                </VControl>
              </VField>
            </div>
            <div class="column is-12">
              <VField class="is-image-select" label="Preacher *">
                <VControl>
                  <Multiselect
                    v-model="addSeriesFormData.preacher_id"
                    placeholder="Select Preacher"
                    track-by="name"
                    label="name"
                    value-prop="id"
                    :search="true"
                    :options="preachers"
                    :max-height="145"
                    :searchable="true"

                  >
                    <template #singlelabel="{ value }">
                      <div class="multiselect-single-label">
                        {{ value.title }} {{ value.name }}
                      </div>
                    </template>
                    <template #option="{ option }">
                      {{ option.title }} {{ option.name }}
                    </template>
                  </Multiselect>
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField label="Series Image *">
                <VControl>
                  <VFilePond
                    class="profile-filepond"
                    name="profile_filepond"
                    :chunk-retry-delays="[500, 1000, 3000]"
                    label-idle="<i class='lnil lnil-cloud-upload'></i>"
                    :accepted-file-types="['image/png']"
                    :drop-validation="true"
                    :image-preview-height="140"
                    :image-resize-target-width="140"
                    :image-resize-target-height="140"
                    image-crop-aspect-ratio="1:1"
                    style-panel-layout="compact circle"
                    style-panel-aspext-ratio="1:1"
                    style-load-indicator-position="center bottom"
                    style-progress-indicator-position="right bottom"
                    style-button-remove-item-position="left bottom"
                    style-button-process-item-position="right bottom"
                    @addfile="onAddSeriesImage"
                    @removefile="onRemoveSeriesImage"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-12">
              <VDatePicker v-model="addSeriesFormData.release_date" :model-config="{type: 'string',mask: 'iso' }" color="green" trim-weeks>
                <template #default="{ inputValue, inputEvents }">
                  <VField label="Release Date *">
                    <VControl icon="feather:calendar">
                      <VInput :value="inputValue" v-on="inputEvents" />
                    </VControl>
                  </VField>
                </template>
              </VDatePicker>
            </div>
            <div class="column is-12">
              <VField class="is-image-select" label="Categories">
                <VControl>
                  <Multiselect
                    v-model="categoryList"
                    mode="tags"
                    label="name"
                    :searchable="true"
                    :create-tag="true"
                    value-prop="id"
                    :options="categories"
                    placeholder="Add Categories"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-12">
              <VField class="is-image-select" label="Topics">
                <VControl>
                  <Multiselect
                    v-model="topicList"
                    mode="tags"
                    label="name"
                    :searchable="true"
                    :create-tag="true"
                    value-prop="id"
                    :options="topics"
                    placeholder="Add Topics"
                  />
                </VControl>
              </VField>
            </div>

          </div>
        </div>
      </template>
      <template #action="{ close }">
        <VButton color="primary" :loading="saveButtonLoading" raised @click="createSeries()">Save</VButton>
      </template>
    </VModal>
  </SidebarLayout>
</template>
