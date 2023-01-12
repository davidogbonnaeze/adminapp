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
      <span>Update sermon audio</span>
    </div>
  </a>
  <VModal
    :open="openUploadFileModal"
    size="large"
    title="Update Sermon Audio"
    actions="right"
    noclose
    @close="openUploadFileModal = false"
  >
    <template #content>
      <div>
        <VField label="Sermon Audio *">
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
              @addfile="onAddSermonAudio"
              @removefile="onRemoveSermonAudio"
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
import { Sermon } from '/@src/interfaces/sermon'
import { SermonService } from '/@src/services/sermon.service'

const notyf = new Notyf()
const openUploadFileModal = ref(false)
const isUploadingFile = ref(false)
const uploadFormData = reactive({
  sermon_file: null as any,
})

const props = defineProps<{
  sermon: Sermon
}>()

const onAddSermonAudio = (error: any, fileInfo: any) => {
  if (error) {
    notyf.error(error)
    console.error(error)
    return
  }

  const _file = fileInfo.file as File
  if (_file) {
    uploadFormData.sermon_file = _file
  }
}

const onRemoveSermonAudio = (error: any) => {
  if (error) {
    console.error(error)
    return
  }
  uploadFormData.sermon_file = null
}

const upload = async () => {
  isUploadingFile.value = true
  const formData = new FormData()
  formData.append('sermon_file', uploadFormData.sermon_file)
  try {
    const response = await SermonService.updateSermonAudio(props.sermon.id, formData)
    console.log(response)
    uploadFormData.sermon_file = null
    isUploadingFile.value = false
    openUploadFileModal.value = false
    notyf.success('File updated successfully')
  } catch (error) {
    isUploadingFile.value = false
    console.error(error)
  }
}
</script>

<style scoped></style>
