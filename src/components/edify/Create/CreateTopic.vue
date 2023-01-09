<template>
  <VButton
    v-if="!isText"
    color="primary"
    icon="fas fa-plus"
    elevated
    @click="addTopicFormOpen = true"
  >
    Add Topic
  </VButton>
  <button
    v-if="isText"
    class="text-is-primary comp-inline"
    @click="addTopicFormOpen = true"
  >
    + Add Topic
  </button>
  <VModal
    :open="addTopicFormOpen"
    size="large"
    title="Add Topic"
    actions="right"
    noclose
    @close="addTopicFormOpen = false"
  >
    <template #content>
      <div class="modal-form">
        <div class="columns is-multiline">
          <div class="column is-12">
            <VField label="Name *">
              <VControl>
                <VInput
                  v-model="addTopicFormData.name"
                  type="text"
                  placeholder="Ex: Grace, Faith,..."
                />
              </VControl>
            </VField>
          </div>
          <div class="column is-12">
            <VField label="Topic Image *">
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
                  @addfile="onAddTopicImage"
                  @removefile="onRemoveTopicImage"
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </template>
    <template #action>
      <VButton color="primary" :loading="saveButtonLoading" raised @click="createTopic()"
        >Save</VButton
      >
    </template>
  </VModal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Notyf } from 'notyf'
import { TopicService } from '/@src/services/topic.service'

defineProps<{
  isText?: boolean
}>()

const emit = defineEmits(['fetchTopics'])
const notyf = new Notyf()
const saveButtonLoading = ref(false)
const addTopicFormOpen = ref(false)
const addTopicFormData = reactive({
  name: null as any,
  color: null as any,
  topic_image: null as any,
})

const onAddTopicImage = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error)
    return
  }

  const _file = fileInfo.file as File
  if (_file) {
    addTopicFormData.topic_image = _file
  }
}

const onRemoveTopicImage = (error: any) => {
  if (error) {
    console.error(error)
    return
  }
  addTopicFormData.topic_image = null
}

const resetFormData = () => {
  addTopicFormData.name = null
  addTopicFormData.color = null
  addTopicFormData.topic_image = null
}

const createTopic = async () => {
  saveButtonLoading.value = true
  const formData = new FormData()
  formData.append('name', addTopicFormData.name)
  formData.append('color', '#ffffff')
  formData.append('topic_image', addTopicFormData.topic_image)

  try {
    const response = await TopicService.createTopic(formData)
    console.log(response)
    resetFormData()
    saveButtonLoading.value = false
    addTopicFormOpen.value = false
    emit('fetchTopics')
    notyf.success('Topic created successfully')
  } catch (error) {
    saveButtonLoading.value = false
    console.error(error)
  }
}
</script>

<style scoped></style>
