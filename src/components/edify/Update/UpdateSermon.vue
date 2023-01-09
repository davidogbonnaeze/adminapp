<template>
  <a href="#" role="menuitem" class="dropdown-item is-media" @click="openUpdateModal">
    <div class="icon">
      <i aria-hidden="true" class="fa fa-edit"></i>
    </div>
    <div class="meta">
      <span>Edit</span>
    </div>
  </a>
  <VModal
    :open="openUpdateSermonModal"
    size="large"
    title="Add Sermon"
    actions="right"
    noclose
    @close="openUpdateSermonModal = false"
  >
    <template #content>
      <div class="modal-form">
        <div class="columns is-multiline">
          <div class="column is-12">
            <VField label="Sermon Title *">
              <VControl>
                <VInput
                  v-model="updateSermonFormData.title"
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
                  v-model="updateSermonFormData.preacher_id"
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
          </div>
          <div class="column is-12">
            <VField
              class="is-image-select"
              label="Series (leave blank if sermon is not associated with any series)"
            >
              <VControl>
                <Multiselect
                  v-model="updateSermonFormData.series_id"
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
          <div class="column is-12">
            <VDatePicker
              v-model="updateSermonFormData.release_date"
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
      <VButton color="primary" :loading="saveButtonLoading" raised @click="updateSermon"
        >Update</VButton
      >
    </template>
  </VModal>
</template>

<script setup lang="ts">
import { Preacher } from '/@src/interfaces/preacher'
import { Category } from '/@src/interfaces/category'
import { Topic } from '/@src/interfaces/topic'
import { Sermon } from '/@src/interfaces/sermon'
import { Notyf } from 'notyf'
import { reactive, ref } from 'vue'
import { SermonService } from '/@src/services/sermon.service'
import { Series } from '/@src/interfaces/series'

const props = defineProps<{
  preachers: Preacher[]
  categories: Category[]
  topics: Topic[]
  series: Series[]
  sermon: Sermon
}>()

const notyf = new Notyf()
const topicList = ref<string[]>([])
const categoryList = ref<string[]>([])
const openUpdateSermonModal = ref(false)
const updateSermonFormData = reactive({
  title: null as any,
  preacher_id: null as any,
  release_date: null as any,
  series_id: null as any,
  category_ids: null as any,
  topic_ids: null as any,
})
const saveButtonLoading = ref(false)

const openUpdateModal = () => {
  if (props.sermon) {
    const sermon = props.sermon
    const topicIds: string[] = []
    const categoryIds: string[] = []
    sermon.topics.forEach((topic) => {
      topicIds.push(topic.id)
    })
    sermon.categories.forEach((category) => {
      categoryIds.push(category.id)
    })
    updateSermonFormData.title = sermon.title
    updateSermonFormData.preacher_id = sermon.preacher_id
    updateSermonFormData.release_date = sermon.release_date
    updateSermonFormData.series_id = sermon.series_id
    topicList.value = topicIds
    categoryList.value = categoryIds
  }
  openUpdateSermonModal.value = true
}

const prepareUpdateSermonPayload = () => {
  const payload = {
    release_date: updateSermonFormData.release_date,
    title: updateSermonFormData.title,
    preacher_id: updateSermonFormData.preacher_id,
    series_id: updateSermonFormData.series_id,
    topic_ids: topicList.value,
    category_ids: categoryList.value,
  }
  return payload
}

const updateSermon = async () => {
  saveButtonLoading.value = true
  const payload = prepareUpdateSermonPayload()
  try {
    const response = await SermonService.updateSermon(props.sermon.id, payload)
    console.log(response)
    saveButtonLoading.value = false
    openUpdateSermonModal.value = false
    notyf.success('Sermon updated successfully')
  } catch (error) {
    saveButtonLoading.value = false
    console.error(error)
  }
}
</script>

<style scoped></style>
