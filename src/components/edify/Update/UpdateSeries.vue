<template>
  <a href="#" role="menuitem" class="dropdown-item is-media" @click="openSeriesModal">
    <div class="icon">
      <i aria-hidden="true" class="fa fa-edit"></i>
    </div>
    <div class="meta">
      <span>Edit</span>
    </div>
  </a>
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
      <VButton color="primary" :loading="saveButtonLoading" raised @click="updateSeries"
        >Update</VButton
      >
    </template>
  </VModal>
</template>

<script setup lang="ts">
import { Notyf } from 'notyf'
import { SeriesService } from '/@src/services/series.service'
import { Preacher } from '/@src/interfaces/preacher'
import { Category } from '/@src/interfaces/category'
import { Topic } from '/@src/interfaces/topic'
import type { Series } from '/@src/interfaces/series'

const emit = defineEmits(['fetchSeries'])
const notyf = new Notyf()
const topicList = ref<string[]>([])
const categoryList = ref<string[]>([])
const addSeriesFormOpen = ref(false)
const addSeriesFormData = reactive({
  title: null as any,
  release_date: null as any,
  preacher_id: null as any,
  series_image: null as any,
  category_ids: null as any,
  topic_ids: null as any,
})
const saveButtonLoading = ref(false)

const props = defineProps<{
  preachers: Preacher[]
  categories: Category[]
  topics: Topic[]
  isText?: boolean
  isEdit?: boolean
  series?: Series
}>()

const openSeriesModal = () => {
  if (props.series) {
    const series = props.series
    const topicIds: string[] = []
    const categoryIds: string[] = []
    series.topics.forEach((topic) => {
      topicIds.push(topic.id)
    })
    series.categories.forEach((category) => {
      categoryIds.push(category.id)
    })
    addSeriesFormData.title = series.title
    addSeriesFormData.preacher_id = series.preacher_id
    topicList.value = topicIds
    categoryList.value = categoryIds
    addSeriesFormData.release_date = series.release_date
  }
  addSeriesFormOpen.value = true
}

const prepareUpdateSeriesPayload = () => {
  const payload = {
    release_date: addSeriesFormData.release_date,
    title: addSeriesFormData.title,
    preacher_id: addSeriesFormData.preacher_id,
    topic_ids: topicList.value,
    category_ids: categoryList.value,
  }
  return payload
}

const updateSeries = async () => {
  saveButtonLoading.value = true
  const payload = prepareUpdateSeriesPayload()
  const seriesId = props.series?.id as string
  try {
    const response = await SeriesService.updateSeries(seriesId, payload)
    console.log(response)
    saveButtonLoading.value = false
    addSeriesFormOpen.value = false
    notyf.success('Series updated successfully')
    emit('fetchSeries')
  } catch (error) {
    saveButtonLoading.value = false
    console.error(error)
  }
}
</script>

<style scoped></style>
