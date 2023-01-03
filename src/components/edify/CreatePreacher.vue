<template>
  <VButton
    v-if="!isText"
    color="primary"
    icon="fas fa-plus"
    elevated
    @click="addPreacherFormOpen = true"
  >
    Add Preacher
  </VButton>
  <button
    v-if="isText"
    class="text-is-primary comp-inline"
    @click="addPreacherFormOpen = true"
  >
    + Add Preacher
  </button>
  <VModal
    :open="addPreacherFormOpen"
    size="large"
    title="Add Preacher"
    actions="right"
    noclose
    @close="addPreacherFormOpen = false"
  >
    <template #content>
      <div class="modal-form">
        <div class="columns is-multiline">
          <div class="column is-6">
            <VField class="is-image-select" label="Title *">
              <VControl>
                <Multiselect
                  v-model="addPreacherFormData.title"
                  placeholder="Select title"
                  track-by="name"
                  label="name"
                  :search="true"
                  :options="[
                    {
                      value: 'Apostle',
                      name: 'Apostle',
                    },
                    {
                      value: 'Pastor',
                      name: 'Pastor',
                    },
                    {
                      value: 'Prophet',
                      name: 'Prophet',
                    },
                    {
                      value: 'Evangelist',
                      name: 'Evangelist',
                    },
                    {
                      value: 'Reverend',
                      name: 'Reverend',
                    },
                    {
                      value: 'Brother',
                      name: 'Brother',
                    },
                    {
                      value: 'Bishop',
                      name: 'Bishop',
                    },
                    {
                      value: 'Minister',
                      name: 'Minister',
                    },
                  ]"
                  :max-height="145"
                >
                  <template #singlelabel="{ value }">
                    <div class="multiselect-single-label">
                      {{ value.name }}
                    </div>
                  </template>
                  <template #option="{ option }">
                    {{ option.name }}
                  </template>
                </Multiselect>
              </VControl>
            </VField>
          </div>
          <div class="column is-6">
            <VField label="Name *">
              <VControl>
                <VInput
                  v-model="addPreacherFormData.name"
                  type="text"
                  placeholder="Ex: John Doe"
                />
              </VControl>
            </VField>
          </div>
          <div class="column is-12">
            <VField label="Preacher Image *">
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
                  @addfile="onAddFile"
                  @removefile="onRemoveFile"
                />
              </VControl>
            </VField>
          </div>
          <div class="column is-12">
            <VField label="Bio *">
              <VControl>
                <VTextarea
                  v-model="addPreacherFormData.bio"
                  rows="3"
                  placeholder="Details about the project..."
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </template>
    <template #action>
      <VButton
        color="primary"
        :loading="saveButtonLoading"
        raised
        @click="createPreacher()"
        >Save</VButton
      >
    </template>
  </VModal>
</template>

<script setup lang="ts">
import { Notyf } from 'notyf'
import { reactive, ref } from 'vue'
import { PreacherService } from '/@src/services/preacher.service'

defineProps<{
  isText?: boolean
}>()

const notyf = new Notyf()
const addPreacherFormOpen = ref(false)
const addPreacherFormData = reactive({
  title: null as any,
  name: null as any,
  bio: null as any,
  preacher_image: null as any,
})
const saveButtonLoading = ref(false)

const createPreacher = async () => {
  saveButtonLoading.value = true
  const formData = new FormData()
  formData.append('preacher_image', addPreacherFormData.preacher_image)
  formData.append('title', addPreacherFormData.title)
  formData.append('name', addPreacherFormData.name)
  formData.append('bio', addPreacherFormData.bio)
  try {
    await PreacherService.createPreacher(formData)
    resetFormData()
    saveButtonLoading.value = false
    addPreacherFormOpen.value = false
    notyf.success('Preacher created successfully')
  } catch (error) {
    saveButtonLoading.value = false
    console.error(error)
  }
}

const resetFormData = () => {
  addPreacherFormData.preacher_image = null
  addPreacherFormData.title = null
  addPreacherFormData.bio = null
  addPreacherFormData.name = null
}

const onAddFile = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error)
    return
  }
  const _file = fileInfo.file as File
  if (_file) {
    addPreacherFormData.preacher_image = _file
    console.log(addPreacherFormData.preacher_image)
  }
}

const onRemoveFile = (error: any) => {
  if (error) {
    console.error(error)
    return
  }
  addPreacherFormData.preacher_image = null
  console.log(addPreacherFormData.preacher_image)
}
</script>

<style scoped></style>
