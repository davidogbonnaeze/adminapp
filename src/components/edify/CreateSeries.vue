<template>
  <VButton color="primary" icon="fas fa-plus" elevated @click="addSeriesFormOpen = true">
    Add Series
  </VButton>
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
                <VInput
                  v-model="addSeriesFormData.title"
                  type="text"
                  placeholder="Ex: Redeeming the time"
                />
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
            <VDatePicker
              v-model="addSeriesFormData.release_date"
              :model-config="{ type: 'string', mask: 'iso' }"
              color="green"
              trim-weeks
            >
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
    <template #action>
      <VButton color="primary" :loading="saveButtonLoading" raised @click="createSeries()"
        >Save</VButton
      >
    </template>
  </VModal>
</template>

<script setup lang="ts">
import { Notyf } from 'notyf'
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

import { PreacherService } from '/@src/services/preacher.service'
import { CategoryService } from '/@src/services/category.service'
import { TopicService } from '/@src/services/topic.service'
import { SeriesService } from '/@src/services/series.service'
import { onMounted, reactive, ref } from 'vue'
import { Series } from '/@src/interfaces/series'
import { Preacher } from '/@src/interfaces/preacher'
import { Category } from '/@src/interfaces/category'
import { Topic } from '/@src/interfaces/topic'

onMounted(() => {
  fetchPreachers()
  fetchCategories()
  fetchTopics()
  fetchSeries()
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
    tableLoading.value = false
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

const onRemoveSeriesImage = (error: any) => {
  if (error) {
    console.error(error)
    return
  }
  addSeriesFormData.series_image = null
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
  saveButtonLoading.value = true
  const formData = new FormData()
  formData.append('release_date', addSeriesFormData.release_date)
  formData.append('series_image', addSeriesFormData.series_image)
  formData.append('title', addSeriesFormData.title)
  formData.append('duration', 1200)
  formData.append('preacher_id', addSeriesFormData.preacher_id)
  //TODO Handle scenario when topicList or categoryList contains only one value
  for (const topic_id of topicList.value) {
    formData.append('topic_ids', topic_id)
  }
  for (const category_id of categoryList.value) {
    formData.append('category_ids', category_id)
  }

  try {
    const response = await SeriesService.createSeries(formData)
    console.log(response)
    resetFormData()
    saveButtonLoading.value = false
    addSeriesFormOpen.value = false
    notyf.success('Series created successfully')
    await fetchSeries()
  } catch (error) {
    saveButtonLoading.value = false
    console.error(error)
  }
}
</script>

<style scoped></style>
