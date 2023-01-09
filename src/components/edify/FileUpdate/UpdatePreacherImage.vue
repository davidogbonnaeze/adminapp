<template>
  <a
    href="#"
    role="menuitem"
    class="dropdown-item is-media"
    @click="openUploadFileModal = true"
  >
    <div class="icon">
      <i aria-hidden="true" class="fa fa-cloud-download-alt"></i>
    </div>
    <div class="meta">
      <span>Update preacher image</span>
    </div>
  </a>
  <VModal
    :open="openUploadFileModal"
    size="large"
    title="Update Preacher Image"
    actions="right"
    noclose
    @close="openUploadFileModal = false"
  >
    <template #content>
      <div>
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
              @addfile="onAddPreacherImage"
              @removefile="onRemovePreacherImage"
            />
          </VControl>
        </VField>
      </div>
    </template>

    <template #action>
      <VButton color="primary" :loading="isUploadingFile" raised @click="upload"
        >Update</VButton
      >
    </template>
  </VModal>
</template>

<script setup lang="ts">
import { Notyf } from 'notyf'
import { Preacher } from '/@src/interfaces/preacher'
import { PreacherService } from '/@src/services/preacher.service'

const emit = defineEmits(['fetchPreachers'])
const notyf = new Notyf()
const openUploadFileModal = ref(false)
const isUploadingFile = ref(false)
const uploadFormData = reactive({
  preacher_image: null as any,
})

const props = defineProps<{
  preacher: Preacher
}>()

const onAddPreacherImage = (error: any, fileInfo: any) => {
  if (error) {
    notyf.error(error)
    console.error(error)
    return
  }

  const _file = fileInfo.file as File
  if (_file) {
    uploadFormData.preacher_image = _file
  }
}

const onRemovePreacherImage = (error: any) => {
  if (error) {
    console.error(error)
    return
  }
  uploadFormData.preacher_image = null
}

const upload = async () => {
  isUploadingFile.value = true
  const formData = new FormData()
  formData.append('preacher_image', uploadFormData.preacher_image)
  try {
    const response = await PreacherService.updatePreacherImage(
      props.preacher.id,
      formData
    )
    console.log(response)
    uploadFormData.preacher_image = null
    isUploadingFile.value = false
    openUploadFileModal.value = false
    notyf.success('File updated successfully')
    emit('fetchPreachers')
  } catch (error) {
    isUploadingFile.value = false
    console.error(error)
  }
}
</script>

<style scoped></style>
