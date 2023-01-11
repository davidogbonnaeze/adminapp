<template>
  <div>
    <VButton
      color="primary"
      icon="fas fa-plus"
      elevated
      @click="addSermonFormOpen = true"
    >
      Add Sermon
    </VButton>
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
                  <VInput
                    v-model="addSermonFormData.title"
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
                    <template #option="{ option }"
                      >x {{ option.title }} {{ option.name }}
                    </template>
                  </Multiselect>
                </VControl>
              </VField>
              <CreatePreacher :is-text="true" @fetch-preachers="fetchPreachers" />
            </div>
            <div class="column is-12">
              <VField
                class="is-image-select"
                label="Series (leave blank if sermon is not associated with any series)"
              >
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
              <CreateSeries
                :is-text="true"
                :topics="topics"
                :categories="categories"
                :preachers="preachers"
                @fetch-series="fetchSeries"
              />
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
                    :accepted-file-types="['audio/mpeg', 'audio/x-m4a', 'audio/mp4']"
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
              <VDatePicker
                v-model="addSermonFormData.release_date"
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
              <CreateCategory :is-text="true" @fetch-categories="fetchCategories" />
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
              <CreateTopic :is-text="true" @fetch-topics="fetchTopics" />
            </div>
          </div>
        </div>
      </template>
      <template #action>
        <VButton
          color="primary"
          :loading="saveButtonLoading"
          raised
          @click="createSermon()"
          >Save</VButton
        >
      </template>
    </VModal>
  </div>
</template>

<script setup lang="ts">
import { SermonService } from '/@src/services/sermon.service'
import { onMounted, reactive, ref } from 'vue'
import { Notyf } from 'notyf'
import { Preacher } from '/@src/interfaces/preacher'
import { Series } from '/@src/interfaces/series'
import { Category } from '/@src/interfaces/category'
import { Topic } from '/@src/interfaces/topic'
import { PreacherService } from '/@src/services/preacher.service'
import { CategoryService } from '/@src/services/category.service'
import { TopicService } from '/@src/services/topic.service'
import { SeriesService } from '/@src/services/series.service'

const notyf = new Notyf()
const topicList = ref([])
const categoryList = ref([])
const addSermonFormOpen = ref(false)
const addSermonFormData = reactive({
  title: null as any,
  sermon_file: null as any,
  preacher_id: null as any,
  sermon_image: null as any,
  release_date: null as any,
  series_id: null as any,
  category_ids: null as any,
  topic_ids: null as any,
})
const saveButtonLoading = ref(false)
const preachers = ref<Preacher[]>([])
const series = ref<Series[]>([])
const categories = ref<Category[]>([])
const topics = ref<Topic[]>([])

onMounted(() => {
  fetchPreachers()
  fetchSeries()
  fetchCategories()
  fetchTopics()
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

const onRemoveSermonFile = (error: any) => {
  if (error) {
    console.error(error)
    return
  }
  addSermonFormData.sermon_file = null
}

const onRemoveSermonImage = (error: any) => {
  if (error) {
    console.error(error)
    return
  }
  addSermonFormData.sermon_image = null
}

const resetFormData = () => {
  addSermonFormData.title = null
  addSermonFormData.sermon_image = null
  addSermonFormData.release_date = null
  addSermonFormData.sermon_file = null
  addSermonFormData.series_id = null
  addSermonFormData.preacher_id = null
  addSermonFormData.category_ids = null
  addSermonFormData.topic_ids = null
}

const createSermon = async () => {
  saveButtonLoading.value = true
  const formData = new FormData()
  formData.append('sermon_file', addSermonFormData.sermon_file)
  formData.append('sermon_image', addSermonFormData.sermon_image)
  formData.append('title', addSermonFormData.title)
  formData.append('preacher_id', addSermonFormData.preacher_id)
  if (addSermonFormData.series_id != null) {
    formData.append('series_id', addSermonFormData.series_id)
  }
  formData.append('release_date', addSermonFormData.release_date)
  //TODO Handle scenario when topicList or categoryList contains only one value
  for (const topic_id of topicList.value) {
    formData.append('topic_ids', topic_id)
  }
  for (const category_id of categoryList.value) {
    formData.append('category_ids', category_id)
  }

  try {
    const response = await SermonService.createSermon(formData)
    console.log(response)
    resetFormData()
    saveButtonLoading.value = false
    addSermonFormOpen.value = false
    notyf.success('Sermon created successfully')
  } catch (error) {
    saveButtonLoading.value = false
    console.error(error)
  }
}
</script>

<style scoped></style>
