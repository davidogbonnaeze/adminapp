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
      <span>Update category image</span>
    </div>
  </a>
  <VModal
    :open="openUploadFileModal"
    size="large"
    title="Update Category Image"
    actions="right"
    noclose
    @close="openUploadFileModal = false"
  >
    <template #content>
      <div>
        <VField label="Category Image *">
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
              @addfile="onAddCategoryImage"
              @removefile="onRemoveCategoryImage"
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
import { CategoryService } from '/@src/services/category.service'
import { Category } from '/@src/interfaces/category'

const emit = defineEmits(['fetchCategories'])
const notyf = new Notyf()
const openUploadFileModal = ref(false)
const isUploadingFile = ref(false)
const uploadFormData = reactive({
  category_image: null as any,
})

const props = defineProps<{
  category: Category
}>()

const onAddCategoryImage = (error: any, fileInfo: any) => {
  if (error) {
    notyf.error(error)
    console.error(error)
    return
  }

  const _file = fileInfo.file as File
  if (_file) {
    uploadFormData.category_image = _file
  }
}

const onRemoveCategoryImage = (error: any) => {
  if (error) {
    console.error(error)
    return
  }
  uploadFormData.category_image = null
}

const upload = async () => {
  isUploadingFile.value = true
  const formData = new FormData()
  formData.append('category_image', uploadFormData.category_image)
  try {
    const response = await CategoryService.updateCategoryImage(
      props.category.id,
      formData
    )
    console.log(response)
    uploadFormData.category_image = null
    isUploadingFile.value = false
    openUploadFileModal.value = false
    notyf.success('File updated successfully')
    emit('fetchCategories')
  } catch (error) {
    isUploadingFile.value = false
    console.error(error)
  }
}
</script>

<style scoped></style>
