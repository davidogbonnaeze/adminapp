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
    :open="openUpdateCategoryModal"
    size="large"
    title="Add Category"
    actions="right"
    noclose
    @close="openUpdateCategoryModal = false"
  >
    <template #content>
      <div class="modal-form">
        <div class="columns is-multiline">
          <div class="column is-12">
            <VField label="Name *">
              <VControl>
                <VInput
                  v-model="updateCategoryFormData.name"
                  type="text"
                  placeholder="Ex: Chants, Confessions,..."
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </template>
    <template #action>
      <VButton color="primary" :loading="saveButtonLoading" raised @click="updateCategory"
        >Update</VButton
      >
    </template>
  </VModal>
</template>

<script setup lang="ts">
import { Notyf } from 'notyf'
import { reactive, ref } from 'vue'
import { Category } from '/@src/interfaces/category'
import { CategoryService } from '/@src/services/category.service'

const props = defineProps<{
  category: Category
}>()

const emit = defineEmits(['fetchCategories'])
const notyf = new Notyf()
const saveButtonLoading = ref(false)
const openUpdateCategoryModal = ref(false)
const updateCategoryFormData = reactive({
  name: null as any,
})

const openUpdateModal = () => {
  if (props.category) {
    const category = props.category
    updateCategoryFormData.name = category.name
  }
  openUpdateCategoryModal.value = true
}

const prepareUpdateCategoryPayload = () => {
  const payload = {
    name: updateCategoryFormData.name,
  }
  return payload
}

const updateCategory = async () => {
  saveButtonLoading.value = true
  const payload = prepareUpdateCategoryPayload()
  try {
    const response = await CategoryService.updateCategory(props.category.id, payload)
    console.log(response)
    saveButtonLoading.value = false
    openUpdateCategoryModal.value = false
    notyf.success('Category updated successfully')
    emit('fetchCategories')
  } catch (error) {
    saveButtonLoading.value = false
    console.error(error)
  }
}
</script>

<style scoped></style>
