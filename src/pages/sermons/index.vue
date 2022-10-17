<script setup lang="ts">

import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import {onMounted, reactive, ref} from "vue";
import type {Sermon} from "/@src/interfaces/sermon";
import {SermonService} from "/@src/services/sermon.service";
import {Notyf} from "notyf";
import moment from "moment";
import {PreacherService} from "/@src/services/preacher.service";
import type {Series} from "/@src/interfaces/series";
import type {Preacher} from "/@src/interfaces/preacher";
import {SeriesService} from "/@src/services/series.service";
import type {Category} from "/@src/interfaces/category";
import type {Topic} from "/@src/interfaces/topic";
import {CategoryService} from "/@src/services/category.service";
import {TopicService} from "/@src/services/topic.service";

const notyf = new Notyf()
const sermons = ref<Sermon[]>([])
const preachers = ref<Preacher[]>([])
const series = ref<Series[]>([])
const categories = ref<Category[]>([])
const topics = ref<Topic[]>([])
const topicList = ref([])
const categoryList = ref([])
const addSermonFormOpen = ref(false)
const addSermonFormData = reactive({
  title: null as any,
  sermon_file: null as any,
  preacher_id: null as any,
  sermon_image: null as any,
  release_date: null as any,
  duration: null as any,
  series_id: null as any,
  category_ids: null as any,
  topic_ids: null as any,
})
const tableLoading = ref(true)
const saveButtonLoading = ref(false)
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Sermons')

onMounted(() => {
  fetchPreachers();
  fetchSeries();
  fetchCategories();
  fetchTopics();
  fetchSermons();
})

useHead({
  title: 'Sermons - Edify',
})

const fetchSermons = async () => {
  try {
    const response = await SermonService.getSermons()
    sermons.value = response.data.data
    tableLoading.value = false;
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

const fetchSeries = async () => {
  try {
    const response = await SeriesService.getSeries()
    series.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}



const onAddSermonFile = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error)
    return
  }

  const _file = fileInfo.file as File
  console.log(_file.type)
  if (_file) {

    addSermonFormData.sermon_file = _file
  }
}

const onAddSermonImage = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error)
    return
  }

  const _file = fileInfo.file as File
  if (_file) {
    addSermonFormData.sermon_image = _file
  }
}

const onRemoveSermonFile = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error)
    return
  }
  addSermonFormData.sermon_file = null;
}

const onRemoveSermonImage = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error)
    return
  }
  addSermonFormData.sermon_image = null;
}

const resetFormData = () => {
  addSermonFormData.title = null
  addSermonFormData.sermon_image = null
  addSermonFormData.release_date = null
  addSermonFormData.sermon_file = null
  addSermonFormData.duration = null
  addSermonFormData.series_id = null
  addSermonFormData.preacher_id = null
  addSermonFormData.category_ids = null
  addSermonFormData.topic_ids = null
}

const createSermon = async () => {
  saveButtonLoading.value = true;
  const formData = new FormData();
  formData.append('sermon_file', addSermonFormData.sermon_file)
  formData.append('sermon_image', addSermonFormData.sermon_image)
  formData.append('title', addSermonFormData.title)
  formData.append('preacher_id', addSermonFormData.preacher_id)
  formData.append('series_id', addSermonFormData.series_id)
  formData.append('release_date', addSermonFormData.release_date)
  formData.append('duration', addSermonFormData.duration)
  //TODO Handle scenario when topicList or categoryList contains only one value
  for (const topic_id of topicList.value){
    formData.append('topic_ids', topic_id)
  }
  for (const category_id of categoryList.value){
    formData.append('category_ids', category_id)
  }

  try {
    const response = await SermonService.createSermon(formData);
    resetFormData();
    saveButtonLoading.value = false;
    addSermonFormOpen.value = false;
    notyf.success('Sermon created successfully')
    await fetchSermons();
  } catch (error) {
    saveButtonLoading.value = false;
    console.error(error)
  }
}
//TODO filter series list when a preacher is selected on the form
</script>

<template>
  <SidebarLayout open-on-mounted>
    <!-- Content Wrapper -->
    <div class="page-content-inner">
      <div class="list-flex-toolbar flex-list-v1">
        <VButtons>
          <VButton color="primary" icon="fas fa-plus" @click="addSermonFormOpen = true" elevated> Add Sermon </VButton>
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
            <th scope="col">Audio</th>
            <th scope="col" >Release Date</th>
            <th scope="col" >Duration</th>
            <th scope="col" >Preacher</th>
            <th scope="col">Series</th>
            <th scope="col">Last Updated</th>
            <th scope="col">Date Created</th>
            <th scope="col" data-sortable="false"></th>
          </tr>
          </thead>
          <tbody v-if="!tableLoading">
          <tr v-if="sermons.length === 0">
            <td colspan="9">
              <!--Empty Placeholder-->
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
          <tr v-for="sermon in sermons">
            <td>
              <VField>
                <VControl>
                  <VCheckbox color="primary" circle outlined />
                </VControl>
              </VField>
            </td>
            <td >
              <span class="has-dark-text dark-inverted is-font-alt is-weight-600 rem-90">{{sermon.title}}</span>
            </td>
            <td>
              <span class="light-text">{{sermon.image_url}}</span>
            </td>
            <td >
              <span class="light-text">{{ sermon.audio_url}}</span>
            </td>
            <td>
              <span class="light-text">{{ sermon.release_date}}</span>
            </td>
            <td>
              <span class="light-text">{{ sermon.duration }}</span>
            </td>
            <td>
              <span class="light-text">{{ sermon.preacher.name }}</span>
            </td>
            <td>
              <span class="light-text">{{ sermon.series.title }}</span>
            </td>
            <td>
              <span class="light-text">{{ moment(sermon.updated_at).format("YYYY-MM-DD") }}</span>
            </td>
            <td>
              <span class="light-text">{{ moment(sermon.created_at).format("YYYY-MM-DD") }}</span>
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
      :open="addSermonFormOpen"
      size="large"
      title="Add Sermon"
      actions="right"
      noclose
      @close="addSermonFormOpen = false"
    >
      <template #content>
        <div class="modal-form">
          <div class="columns is-multiline">
            <div class="column is-12">
              <VField label="Sermon Title *">
                <VControl>
                  <VInput v-model="addSermonFormData.title" type="text"  placeholder="Ex: Redeeming the time" />
                </VControl>
              </VField>
            </div>
            <div class="column is-12">
              <VField class="is-image-select" label="Preacher *">
                <VControl>
                  <Multiselect
                    v-model="addSermonFormData.preacher_id"
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
            <div class="column is-12">
              <VField class="is-image-select" label="Series (leave blank if sermon is not associated with any series)">
                <VControl>
                  <Multiselect
                    v-model="addSermonFormData.series_id"
                    placeholder="Select Series"
                    track-by="title"
                    label="title"
                    value-prop="id"
                    :search="true"
                    :options="series"
                    :max-height="145"
                    :searchable="true"
                  >
                    <template #singlelabel="{ value }">
                      <div class="multiselect-single-label">
                        {{ value.title }}
                      </div>
                    </template>
                    <template #option="{ option }">
                      {{ option.title }}
                    </template>
                  </Multiselect>
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField label="Sermon Image *">
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
                    @addfile="onAddSermonImage"
                    @removefile="onRemoveSermonImage"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField label="Sermon File *">
                <VControl>
                  <VFilePond
                    class="profile-filepond"
                    name="profile_filepond"
                    :chunk-retry-delays="[500, 1000, 3000]"
                    label-idle="<i class='lnil lnil-cloud-upload'></i>"
                    :accepted-file-types="['audio/mpeg']"
                    :drop-validation="true"
                    style-panel-layout="integrated"
                    style-load-indicator-position="center bottom"
                    style-progress-indicator-position="right bottom"
                    style-button-remove-item-position="left bottom"
                    style-button-process-item-position="right bottom"
                    @addfile="onAddSermonFile"
                    @removefile="onRemoveSermonFile"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-12">
              <VField label="Sermon Duration *">
                <VControl>
                  <VInput v-model="addSermonFormData.duration" type="number"  placeholder="Ex: 1200" />
                </VControl>
              </VField>
            </div>
            <div class="column is-12">
                <VDatePicker v-model="addSermonFormData.release_date" :model-config="{type: 'string',mask: 'iso' }" color="green" trim-weeks>
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
        <VButton color="primary" :loading="saveButtonLoading" raised @click="createSermon()">Save</VButton>
      </template>
    </VModal>
  </SidebarLayout>
</template>
