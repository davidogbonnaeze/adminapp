<template>
  <VButton
    v-if="!isText"
    color="primary"
    icon="fas fa-plus"
    elevated
    @click="addCategoryFormOpen = true"
  >
    Add Category
  </VButton>
  <button
    v-if="isText"
    class="text-is-primary comp-inline"
    @click="addCategoryFormOpen = true"
  >
    + Add Category
  </button>
  <VModal
    :open="addCategoryFormOpen"
    size="large"
    title="Add Category"
    actions="right"
    noclose
    @close="addCategoryFormOpen = false"
  >
    <template #content>
      <div class="modal-form">
        <div class="columns is-multiline">
          <div class="column is-12">
            <VField label="Name *">
              <VControl>
                <VInput
                  v-model="addCategoryFormData.name"
                  type="text"
                  placeholder="Ex: Chants, Confessions,..."
                />
              </VControl>
            </VField>
          </div>
          <div class="column is-12">
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
        </div>
      </div>
    </template>
    <template #action>
      <VButton
        color="primary"
        :loading="saveButtonLoading"
        raised
        @click="createCategory()"
        >Save</VButton
      >
    </template>
  </VModal>
</template>

<script setup lang="ts">
import { CategoryService } from '/@src/services/category.service'
import { reactive, ref } from 'vue'
import { Notyf } from 'notyf'

defineProps<{
  isText?: boolean
}>()

const emit = defineEmits(['fetchCategories'])
const notyf = new Notyf()
const saveButtonLoading = ref(false)
const addCategoryFormOpen = ref(false)
const addCategoryFormData = reactive({
  name: null as any,
  color: null as any,
  category_image: null as any,
})

const onAddCategoryImage = (error: any, fileInfo: any) => {
  if (error) {
    console.error(error)
    return
  }

  const _file = fileInfo.file as File
  if (_file) {
    addCategoryFormData.category_image = _file
  }
}

const onRemoveCategoryImage = (error: any) => {
  if (error) {
    console.error(error)
    return
  }
  addCategoryFormData.category_image = null
}

const resetFormData = () => {
  addCategoryFormData.name = null
  addCategoryFormData.color = null
  addCategoryFormData.category_image = null
}

const createCategory = async () => {
  saveButtonLoading.value = true
  const formData = new FormData()
  formData.append('name', addCategoryFormData.name)
  formData.append('color', '#ffffff')
  formData.append('category_image', addCategoryFormData.category_image)

  try {
    const response = await CategoryService.createCategory(formData)
    console.log(response)
    resetFormData()
    saveButtonLoading.value = false
    addCategoryFormOpen.value = false
    notyf.success('Category created successfully')
    emit('fetchCategories')
  } catch (error) {
    saveButtonLoading.value = false
    console.error(error)
  }
}
</script>

<style scoped></style>
