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
      <span>Update series image</span>
    </div>
  </a>
  <VModal
    :open="openUploadFileModal"
    size="large"
    title="Update Series Image"
    actions="right"
    noclose
    @close="openUploadFileModal = false"
  >
    <template #content>
      <div>
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
import { SeriesService } from '/@src/services/series.service'
import { Series } from '/@src/interfaces/series'

const emit = defineEmits(['fetchSeries'])
const notyf = new Notyf()
const openUploadFileModal = ref(false)
const isUploadingFile = ref(false)
const uploadFormData = reactive({
  series_image: null as any,
})

const props = defineProps<{
  series: Series
}>()

const onAddSeriesImage = (error: any, fileInfo: any) => {
  if (error) {
    notyf.error(error)
    console.error(error)
    return
  }

  const _file = fileInfo.file as File
  if (_file) {
    uploadFormData.series_image = _file
  }
}

const onRemoveSeriesImage = (error: any) => {
  if (error) {
    console.error(error)
    return
  }
  uploadFormData.series_image = null
}

const upload = async () => {
  isUploadingFile.value = true
  const formData = new FormData()
  formData.append('series_image', uploadFormData.series_image)
  try {
    const response = await SeriesService.updateSeriesImage(props.series.id, formData)
    console.log(response)
    uploadFormData.series_image = null
    isUploadingFile.value = false
    openUploadFileModal.value = false
    notyf.success('File updated successfully')
    emit('fetchSeries')
  } catch (error) {
    isUploadingFile.value = false
    console.error(error)
  }
}
</script>

<style scoped></style>
